// DOM side of the Moodle AI helper: detect the question type, describe every
// answer field for the AI, and write the AI answer back into the page.
// The pure answer handling lives in ./answer.ts.

// Explicit extension: tests import this module with node's type stripping,
// which needs the real file name. tsc allows it (allowImportingTsExtensions).
import { normalizeMoodlePromptText } from "./chatgpt.ts";

export type MoodleQuestionType =
  | "multichoice_single"
  | "multichoice_multiple"
  | "truefalse"
  | "shortanswer"
  | "numerical"
  | "match"
  | "gapselect"
  | "ddwtos"
  | "ddimageortext"
  | "cloze"
  | "unsupported"
  | "unknown";

export type MoodleFieldKind = "choice" | "select" | "text";

export interface MoodleAnswerOption {
  key: string;
  text: string;
}

export interface MoodleAnswerField {
  /** Stable id shared between the AI prompt and the DOM applier. */
  id: string;
  kind: MoodleFieldKind;
  label: string;
  multiple?: boolean;
  options?: MoodleAnswerOption[];
}

export interface MoodleQuestionPayload {
  questionLabel: string;
  questionText: string;
  questionType: MoodleQuestionType;
  /** Empty for question types that cannot be filled in (essay, image drag). */
  fields: MoodleAnswerField[];
}

export interface MoodleAnswerApplication {
  applied: number;
  failedFields: string[];
}

/** Minimal shape of a resolved answer; see ResolvedMoodleAnswer in ./answer.ts. */
export interface MoodleAnswerTarget {
  fieldId: string;
  optionIndex?: number;
  text?: string;
}

const HIDDEN_CLASSES = [
  "visually-hidden",
  "accesshide",
  "sr-only",
  "hidden",
] as const;

// Sub-containers of a question that never hold an answerable control.
const IGNORED_CONTAINERS = ".info, .outcome, .comment, .history, .im-controls";

const CONTROL_SELECTOR = [
  'input[type="radio"]',
  'input[type="checkbox"]',
  'input[type="text"]',
  'input[type="number"]',
  // ddwtos / ddimageortext keep the real answer of every drop zone here.
  "input.placeinput",
  "select",
  "textarea",
].join(", ");

const QTYPE_TO_QUESTION_TYPE: Record<string, MoodleQuestionType> = {
  multichoice: "multichoice_single",
  truefalse: "truefalse",
  shortanswer: "shortanswer",
  numerical: "numerical",
  calculated: "numerical",
  calculatedsimple: "numerical",
  calculatedmulti: "numerical",
  match: "match",
  randomsamatch: "match",
  gapselect: "gapselect",
  ddwtos: "ddwtos",
  ddimageortext: "ddimageortext",
  multianswer: "cloze",
};

// Rendered, but no control we can fill in programmatically: essay textareas are
// overwritten by the editor at submit time, and ddmarker answers are drop-zone
// coordinates that never reach the DOM.
const UNFILLABLE_QTYPES = new Set([
  "essay",
  "ddmarker",
  "description",
  "random",
  "randomshortanswer",
]);

type CollectedField =
  | { kind: "choice"; field: MoodleAnswerField; inputs: HTMLInputElement[] }
  | {
      kind: "select";
      field: MoodleAnswerField;
      select: HTMLSelectElement;
      optionValues: string[];
    }
  | {
      kind: "place";
      field: MoodleAnswerField;
      input: HTMLInputElement;
      optionValues: string[];
    }
  | {
      kind: "text";
      field: MoodleAnswerField;
      input: HTMLInputElement | HTMLTextAreaElement;
    };

function isHiddenElement(element: Element): boolean {
  return HIDDEN_CLASSES.some((className) => element.classList.contains(className));
}

function getVisibleText(element: Element): string {
  function extract(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const child = node as Element;
    if (isHiddenElement(child)) return "";
    if (child.tagName === "SELECT") return "";
    return Array.from(child.childNodes).map(extract).join("");
  }

  return extract(element).replace(/\s+/g, " ").trim();
}

function toOptionKey(text: string, index: number): string {
  const cleaned = text.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return cleaned || String.fromCharCode(97 + index);
}

function letterKey(index: number): string {
  return index < 26
    ? String.fromCharCode(97 + index)
    : `opt${index + 1}`;
}

/**
 * Question type comes from the wrapper class list that Moodle renders as
 * `que <qtype> <behaviour> <state>`. The flags are only a fallback for themes
 * that strip those classes.
 */
export function classifyMoodleQuestionType(
  classNames: string,
  flags: { hasCheckbox: boolean }
): MoodleQuestionType {
  const classes = classNames.split(/\s+/).filter(Boolean);

  for (const className of classes) {
    if (className === "multichoice") {
      return flags.hasCheckbox ? "multichoice_multiple" : "multichoice_single";
    }
    if (UNFILLABLE_QTYPES.has(className)) return "unsupported";
    const mapped = QTYPE_TO_QUESTION_TYPE[className];
    if (mapped) return mapped;
  }

  return flags.hasCheckbox ? "multichoice_multiple" : "unknown";
}

/** The label element Moodle renders next to a choice input. */
function getChoiceLabelElement(
  root: HTMLElement,
  input: HTMLInputElement
): HTMLElement | null {
  const labelId = input.getAttribute("aria-labelledby");
  if (labelId) {
    const byAria = root.querySelector<HTMLElement>(`#${CSS.escape(labelId)}`);
    if (byAria) return byAria;
  }

  const byRegion = input
    .closest<HTMLElement>(".r0, .r1")
    ?.querySelector<HTMLElement>('[data-region="answer-label"]');
  if (byRegion) return byRegion;

  const id = input.id;
  if (id) {
    const byFor = root.querySelector<HTMLElement>(`label[for="${CSS.escape(id)}"]`);
    if (byFor) return byFor;
  }

  return input.closest("label");
}

function describeChoiceInput(
  root: HTMLElement,
  input: HTMLInputElement,
  index: number
): MoodleAnswerOption | null {
  const labelElement = getChoiceLabelElement(root, input);
  const rawText = labelElement
    ? getVisibleText(labelElement)
    : input.getAttribute("aria-label") || "";
  const answerNumber = labelElement
    ?.querySelector<HTMLElement>(".answernumber")
    ?.textContent?.trim();
  const text = answerNumber
    ? rawText.replace(answerNumber, "").trim()
    : rawText.trim();

  if (!text) return null;

  return { key: toOptionKey(answerNumber || "", index), text };
}

function isUsableControl(element: HTMLElement): boolean {
  if (isHiddenElement(element)) return false;
  if (element.getAttribute("aria-hidden") === "true") return false;
  if (element.closest(IGNORED_CONTAINERS)) return false;
  if (element instanceof HTMLInputElement && element.disabled) return false;
  if (
    element instanceof HTMLInputElement &&
    (element.type === "radio" || element.type === "checkbox") &&
    element.value === "-1"
  ) {
    // Moodle's "Clear my choice" control.
    return false;
  }
  return true;
}

function isPlaceholderOption(
  option: HTMLOptionElement,
  questionType: MoodleQuestionType
): boolean {
  const value = option.value.trim();
  if (value === "") return true;
  // match/randomsamatch label the localized "choosedots" entry with value 0.
  // Real choices start at 1 there.
  return questionType === "match" && value === "0";
}

function describeSelectLabel(
  select: HTMLSelectElement,
  questionType: MoodleQuestionType,
  index: number
): string {
  if (questionType === "match") {
    const row = select.closest("tr");
    const promptText = row?.querySelector<HTMLElement>("td.text, .text");
    const prompt = promptText ? getVisibleText(promptText) : "";
    if (prompt) return `Pasangan untuk: ${prompt.slice(0, 120)}`;
  }

  if (/(^|_)unit$/.test(select.name)) {
    return "Satuan jawaban";
  }

  const container = select.closest<HTMLElement>("p, li, div");
  const context = container ? getVisibleText(container) : "";
  if (context && context.length <= 160) return `Dropdown ${index + 1} — ${context}`;

  return `Dropdown ${index + 1}`;
}

function collectSelectField(
  select: HTMLSelectElement,
  questionType: MoodleQuestionType,
  index: number
): CollectedField | null {
  const options: MoodleAnswerOption[] = [];
  const optionValues: string[] = [];

  for (const option of Array.from(select.options)) {
    if (isPlaceholderOption(option, questionType)) continue;
    options.push({ key: letterKey(options.length), text: getVisibleText(option) });
    optionValues.push(option.value);
  }

  if (options.length === 0) return null;

  const id = select.name || select.id || `select-${index + 1}`;

  return {
    kind: "select",
    select,
    optionValues,
    field: {
      id,
      kind: "select",
      label: describeSelectLabel(select, questionType, index),
      options,
    },
  };
}

/** Numeric suffix of a class name such as `choice3`, `place2`, `group1`. */
function getClassNumber(element: Element, prefix: string): string | null {
  for (const className of Array.from(element.classList)) {
    if (!className.startsWith(prefix)) continue;
    const suffix = className.slice(prefix.length);
    if (/^\d+$/.test(suffix)) return suffix;
  }
  return null;
}

function describeDragHome(element: HTMLElement, index: number): string {
  const text =
    getVisibleText(element) ||
    element.getAttribute("alt") ||
    element.getAttribute("title") ||
    element.getAttribute("aria-label") ||
    "";
  return text.trim() || `Item ${index + 1}`;
}

/**
 * ddwtos / ddimageortext keep the submitted answer in a hidden `placeinput`.
 * The options are the drag homes of the same group, identified by their
 * `choice{K}` class, which is exactly the value the JS writes into the input.
 */
function collectPlaceField(
  root: HTMLElement,
  input: HTMLInputElement,
  index: number
): CollectedField | null {
  const group = getClassNumber(input, "group");
  const homes = Array.from(root.querySelectorAll<HTMLElement>(".draghome")).filter(
    (home) => group === null || getClassNumber(home, "group") === group
  );

  const options: MoodleAnswerOption[] = [];
  const optionValues: string[] = [];

  for (const home of homes) {
    const choice = getClassNumber(home, "choice");
    if (choice === null) continue;
    options.push({
      key: letterKey(options.length),
      text: describeDragHome(home, options.length),
    });
    optionValues.push(choice);
  }

  if (options.length === 0) return null;

  const place = getClassNumber(input, "place") ?? String(index + 1);

  return {
    kind: "place",
    input,
    optionValues,
    field: {
      id: input.name || input.id || `place-${place}`,
      kind: "select",
      label: `Drop zone ${place}${group ? ` (grup ${group})` : ""}`,
      options,
    },
  };
}

function detectQuestionType(
  root: HTMLElement,
  hasCheckbox: boolean
): MoodleQuestionType {
  return classifyMoodleQuestionType(root.className || "", { hasCheckbox });
}

/**
 * Single walk over the question controls, in DOM order. Both the AI prompt and
 * the applier use this, so field ids and option indexes always agree.
 */
function collectMoodleFields(root: HTMLElement): CollectedField[] {
  const collected: CollectedField[] = [];
  const choiceGroups = new Map<string, { kind: "choice"; field: MoodleAnswerField; inputs: HTMLInputElement[] }>();
  const questionType = detectQuestionType(
    root,
    Boolean(root.querySelector('input[type="checkbox"]'))
  );
  const elements = Array.from(
    root.querySelectorAll<HTMLElement>(CONTROL_SELECTOR)
  ).filter(isUsableControl);

  let selectIndex = 0;
  let textIndex = 0;
  let placeIndex = 0;

  for (const element of elements) {
    if (element instanceof HTMLInputElement) {
      const isChoice = element.type === "radio" || element.type === "checkbox";

      if (isChoice) {
        // Multi-response checkboxes name every option separately
        // (`q44:2_choice0`), radios already share one name (`q44:2_answer`).
        const rawName = element.name || element.id || `choice-${collected.length + 1}`;
        const groupId =
          element.type === "checkbox" ? rawName.replace(/\d+$/, "") : rawName;
        let group = choiceGroups.get(groupId);

        if (!group) {
          group = {
            kind: "choice",
            inputs: [],
            field: {
              id: groupId,
              kind: "choice",
              label:
                element.type === "checkbox"
                  ? "Checkbox (boleh lebih dari satu jawaban)"
                  : "Pilihan ganda (satu jawaban)",
              multiple: element.type === "checkbox",
              options: [],
            },
          };
          choiceGroups.set(groupId, group);
          collected.push(group);
        }

        const option = describeChoiceInput(root, element, group.inputs.length);
        group.inputs.push(element);
        if (option) {
          group.field.options?.push(option);
        } else {
          // Keep option index aligned with the input list.
          group.field.options?.push({
            key: letterKey(group.inputs.length - 1),
            text: `Pilihan ${group.inputs.length}`,
          });
        }
        continue;
      }

      if (element.type === "hidden") {
        const placeField = collectPlaceField(root, element, placeIndex);
        placeIndex += 1;
        if (placeField) collected.push(placeField);
        continue;
      }

      if (element.type === "text" || element.type === "number") {
        textIndex += 1;
        collected.push({
          kind: "text",
          input: element,
          field: {
            id: element.name || element.id || `text-${textIndex}`,
            kind: "text",
            label: `Isian ${textIndex}`,
          },
        });
        continue;
      }

      continue;
    }

    if (element instanceof HTMLTextAreaElement) {
      textIndex += 1;
      collected.push({
        kind: "text",
        input: element,
        field: {
          id: element.name || element.id || `textarea-${textIndex}`,
          kind: "text",
          label: `Jawaban uraian ${textIndex}`,
        },
      });
      continue;
    }

    if (element instanceof HTMLSelectElement) {
      const field = collectSelectField(element, questionType, selectIndex);
      selectIndex += 1;
      if (field) collected.push(field);
    }
  }

  return collected;
}

export function extractMoodleQuestion(
  root: HTMLElement
): MoodleQuestionPayload | null {
  const formulation =
    root.querySelector<HTMLElement>(".content .formulation") ??
    root.querySelector<HTMLElement>(".formulation");
  const nomorSoal = root.querySelector<HTMLElement>("div.info > h3");

  if (!formulation || !nomorSoal) return null;

  const questionText = normalizeMoodlePromptText(getVisibleText(formulation));
  if (!questionText) return null;

  const questionType = detectQuestionType(
    root,
    Boolean(root.querySelector('.answer input[type="checkbox"]'))
  );
  const collected = collectMoodleFields(root);
  // Types without a fillable control (essay with its editor, ddmarker) keep
  // their answer in the helper panel; nothing is written back to the page.
  const fields =
    questionType === "unsupported" ? [] : collected.map((entry) => entry.field);

  return {
    questionLabel: nomorSoal.textContent?.trim() || "[No Nomor Soal]",
    questionText,
    questionType,
    fields,
  };
}

function dispatchInputEvents(element: HTMLElement): void {
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function highlightChoiceInput(input: HTMLInputElement): void {
  const optionRow = input.closest<HTMLElement>(".r0, .r1");
  if (optionRow) {
    optionRow.style.border = "2px solid #4CAF50";
    optionRow.style.borderRadius = "4px";
  }
}

function clearChoiceHighlight(input: HTMLInputElement): void {
  const optionRow = input.closest<HTMLElement>(".r0, .r1");
  if (optionRow) {
    optionRow.style.border = "";
  }
}

/**
 * Applies resolved answers to the page. Choice groups are set to exactly the
 * options the AI picked; text and select fields get their value plus the
 * `input`/`change` events Moodle listens for.
 */
export function applyMoodleAnswers(
  root: HTMLElement,
  answers: MoodleAnswerTarget[]
): MoodleAnswerApplication {
  const collected = collectMoodleFields(root);
  const byId = new Map(collected.map((entry) => [entry.field.id, entry]));
  const failedFields: string[] = [];
  const appliedFields = new Set<string>();

  const grouped = new Map<string, MoodleAnswerTarget[]>();
  for (const answer of answers) {
    if (!answer.fieldId) continue;
    const list = grouped.get(answer.fieldId) ?? [];
    list.push(answer);
    grouped.set(answer.fieldId, list);
  }

  for (const [fieldId, entries] of grouped) {
    const collectedField = byId.get(fieldId);
    if (!collectedField) {
      failedFields.push(fieldId);
      continue;
    }

    if (collectedField.kind === "choice") {
      const wanted = new Set(
        entries
          .map((entry) => entry.optionIndex)
          .filter((index): index is number => index !== undefined)
      );
      if (wanted.size === 0) {
        failedFields.push(fieldId);
        continue;
      }

      // Drop the highlight a previous answer left behind.
      collectedField.inputs.forEach(clearChoiceHighlight);

      collectedField.inputs.forEach((input, index) => {
        const shouldBeChecked = wanted.has(index);
        if (input.checked !== shouldBeChecked) {
          input.click();
        }
        if (shouldBeChecked && input.checked) {
          highlightChoiceInput(input);
        }
      });

      // A radio group keeps only the last clicked option, so a multi-answer
      // payload on radios is reported as a failure instead of a silent partial.
      const allApplied = Array.from(wanted).every(
        (index) => collectedField.inputs[index]?.checked
      );
      if (allApplied) {
        appliedFields.add(fieldId);
      } else {
        failedFields.push(fieldId);
      }
      continue;
    }

    if (collectedField.kind === "select" || collectedField.kind === "place") {
      const entry = entries.find((candidate) => candidate.optionIndex !== undefined);
      const optionValue =
        entry?.optionIndex !== undefined
          ? collectedField.optionValues[entry.optionIndex]
          : undefined;

      if (optionValue === undefined) {
        failedFields.push(fieldId);
        continue;
      }

      const control =
        collectedField.kind === "select" ? collectedField.select : collectedField.input;
      control.value = optionValue;
      dispatchInputEvents(control);
      appliedFields.add(fieldId);
      continue;
    }

    const text = entries.find((entry) => entry.text)?.text;
    if (!text) {
      failedFields.push(fieldId);
      continue;
    }

    collectedField.input.value = text;
    dispatchInputEvents(collectedField.input);
    appliedFields.add(fieldId);
  }

  return { applied: appliedFields.size, failedFields };
}
