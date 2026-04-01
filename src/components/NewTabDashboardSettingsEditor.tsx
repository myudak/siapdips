import { useEffect, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  LayoutDashboard,
  RotateCcw,
  Settings2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_NEW_TAB_DASHBOARD_PREFS,
  NEW_TAB_MODULE_DESCRIPTIONS,
  NEW_TAB_MODULE_LABELS,
  NEW_TAB_PRESET_DESCRIPTIONS,
  NEW_TAB_PRESET_LABELS,
  STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
  STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS,
  applyNewTabPreset,
  normalizeNewTabDashboardPrefs,
  type NewTabAccentTone,
  type NewTabBackgroundStyle,
  type NewTabDashboardPrefs,
  type NewTabDensity,
  type NewTabModuleId,
  type NewTabPresetId,
  type NewTabTypography,
} from "@/lib/kulon/shared";

const BACKGROUND_OPTIONS: Array<[NewTabBackgroundStyle, string]> = [
  ["aurora", "Aurora"],
  ["paper", "Paper"],
  ["grid", "Grid"],
];

const ACCENT_OPTIONS: Array<[NewTabAccentTone, string]> = [
  ["sky", "Sky"],
  ["emerald", "Emerald"],
  ["amber", "Amber"],
  ["slate", "Slate"],
];

const DENSITY_OPTIONS: Array<[NewTabDensity, string]> = [
  ["compact", "Compact"],
  ["comfortable", "Comfortable"],
  ["airy", "Airy"],
];

const TYPOGRAPHY_OPTIONS: Array<[NewTabTypography, string]> = [
  ["clean", "Clean"],
  ["editorial", "Editorial"],
  ["mono", "Mono"],
];

const PRESET_IDS: NewTabPresetId[] = ["campusDawn", "paperDesk", "nightLab"];

interface NewTabDashboardSettingsEditorProps {
  context?: "option" | "newtab";
  onClose?: () => void;
}

export default function NewTabDashboardSettingsEditor({
  context = "option",
  onClose,
}: NewTabDashboardSettingsEditorProps) {
  const [enabled, setEnabled] = useState(false);
  const [prefs, setPrefs] = useState<NewTabDashboardPrefs>(
    DEFAULT_NEW_TAB_DASHBOARD_PREFS
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } })
  );

  useEffect(() => {
    void loadState();
  }, []);

  const loadState = async () => {
    const result = await chrome.storage.local.get([
      STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED,
      STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS,
    ]);

    setEnabled(Boolean(result[STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]));
    setPrefs(
      normalizeNewTabDashboardPrefs(
        result[STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS]
      )
    );
  };

  const persistPrefs = async (
    nextPrefs: NewTabDashboardPrefs,
    toastMessage?: string
  ) => {
    setPrefs(nextPrefs);
    await chrome.storage.local.set({
      [STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS]: nextPrefs,
    });

    if (toastMessage) {
      toast.success(toastMessage);
    }
  };

  const handleToggleEnabled = async (checked: boolean) => {
    setEnabled(checked);
    await chrome.storage.local.set({
      [STORAGE_KEY_NEW_TAB_DASHBOARD_ENABLED]: checked,
    });
    toast.success(
      checked ? "New tab dashboard enabled" : "New tab dashboard disabled"
    );
  };

  const handlePresetChange = async (value: NewTabPresetId) => {
    const nextPrefs = applyNewTabPreset(value, prefs);
    await persistPrefs(
      nextPrefs,
      `Preset switched to ${NEW_TAB_PRESET_LABELS[value]}`
    );
  };

  const handleFieldChange = async <K extends keyof NewTabDashboardPrefs>(
    field: K,
    value: NewTabDashboardPrefs[K]
  ) => {
    const nextPrefs = normalizeNewTabDashboardPrefs({
      ...prefs,
      [field]: value,
    });
    await persistPrefs(nextPrefs);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = prefs.moduleOrder.indexOf(active.id as NewTabModuleId);
    const newIndex = prefs.moduleOrder.indexOf(over.id as NewTabModuleId);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const nextPrefs = {
      ...prefs,
      moduleOrder: arrayMove(prefs.moduleOrder, oldIndex, newIndex),
    };
    await persistPrefs(nextPrefs, "New tab layout order updated");
  };

  const handleModuleVisibilityToggle = async (moduleId: NewTabModuleId) => {
    const isHidden = prefs.hiddenModules.includes(moduleId);
    const nextPrefs = {
      ...prefs,
      hiddenModules: isHidden
        ? prefs.hiddenModules.filter((value) => value !== moduleId)
        : [...prefs.hiddenModules, moduleId],
    };
    await persistPrefs(nextPrefs);
  };

  const handleReset = async () => {
    await persistPrefs(
      DEFAULT_NEW_TAB_DASHBOARD_PREFS,
      "New tab dashboard reset to default"
    );
  };

  const visibleCount = prefs.moduleOrder.length - prefs.hiddenModules.length;
  const isInline = context === "newtab";

  return (
    <div className="space-y-8 p-6 sm:p-8 text-[var(--brutal-ink)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Settings2 className="h-6 w-6" />
            <h2 className="text-xl md:text-2xl font-display font-black uppercase tracking-tighter">Customize New Tab Dashboard</h2>
          </div>
          <p className="max-w-2xl font-mono text-xs uppercase opacity-70 leading-relaxed">
            Adjust the dashboard directly from this page. Layout, module visibility,
            and the visual mood are saved in chrome storage separately from popup cards.
          </p>
        </div>
        {isInline && onClose ? (
          <button className="brutal-icon-btn shrink-0" onClick={onClose} aria-label="Close customization panel">
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="brutal-card bg-[var(--brutal-surface)] p-5 flex items-center justify-between gap-6">
        <div className="space-y-2">
          <Label htmlFor="new-tab-dashboard-toggle" className="font-display font-bold text-lg uppercase tracking-tight block">
            Enable custom new tab dashboard
          </Label>
          <p className="font-mono text-[10px] uppercase opacity-60">
            Turning this off shows the soft disabled state while keeping your saved preferences.
          </p>
        </div>
        <Switch
          id="new-tab-dashboard-toggle"
          checked={enabled}
          onCheckedChange={(checked) => void handleToggleEnabled(checked)}
          className="border-[3px] border-[var(--brutal-ink)] data-[state=checked]:bg-[var(--brutal-primary)] data-[state=unchecked]:bg-[var(--brutal-bg)] [&>span]:bg-[var(--brutal-ink)] shadow-[4px_4px_0_var(--brutal-ink)]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="brutal-card bg-[var(--brutal-surface)] p-5 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 block">
              <h3 className="font-display font-bold text-base uppercase tracking-tight">Preset</h3>
              <p className="font-mono text-[10px] uppercase opacity-60">
                Pick a base mood, then keep fine-tuning it.
              </p>
            </div>
            <span className="brutal-badge bg-[var(--brutal-ink)] text-[var(--brutal-bg)]">{NEW_TAB_PRESET_LABELS[prefs.preset]}</span>
          </div>

          <Select
            value={prefs.preset}
            onValueChange={(value) => void handlePresetChange(value as NewTabPresetId)}
          >
            <SelectTrigger className="brutal-input rounded-none border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] h-auto py-3 shadow-[4px_4px_0_var(--brutal-ink)] uppercase font-mono font-bold text-xs ring-0 focus:ring-0">
              <SelectValue placeholder="Choose a preset" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] shadow-[4px_4px_0_var(--brutal-ink)] font-mono text-xs uppercase font-bold text-[var(--brutal-ink)]">
              {PRESET_IDS.map((presetId) => (
                <SelectItem key={presetId} value={presetId} className="focus:bg-[var(--brutal-primary)] focus:text-[var(--brutal-bg)] rounded-none cursor-pointer">
                  {NEW_TAB_PRESET_LABELS[presetId]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="font-mono text-[10px] uppercase opacity-70 border-l-[3px] border-[var(--brutal-primary)] pl-3">
            {NEW_TAB_PRESET_DESCRIPTIONS[prefs.preset]}
          </p>
        </div>

        <div className="brutal-card bg-[var(--brutal-surface)] p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-1 block">
            <h3 className="font-display font-bold text-base uppercase tracking-tight">Quick Status</h3>
            <p className="font-mono text-[10px] uppercase opacity-60">
              {visibleCount} of {prefs.moduleOrder.length} modules visible.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="brutal-badge border-[2px] border-[var(--brutal-ink)] bg-transparent text-[var(--brutal-ink)]">Live on new tab</span>
            <span className="brutal-badge border-[2px] border-[var(--brutal-ink)] bg-transparent text-[var(--brutal-ink)]">Popup stays separate</span>
            <span className="brutal-badge border-[2px] border-[var(--brutal-ink)] bg-transparent text-[var(--brutal-ink)]">Full reset available</span>
          </div>
        </div>
      </div>

      <div className="brutal-divider w-full border-[var(--brutal-ink)] opacity-30" />

      <div className="space-y-6">
        <div className="space-y-1 block">
          <h3 className="font-display font-bold text-xl uppercase tracking-tight">Visual Controls</h3>
          <p className="font-mono text-xs uppercase opacity-60">
            Manual overrides sit on top of the selected preset.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SettingSelect
            label="Background"
            value={prefs.backgroundStyle}
            options={BACKGROUND_OPTIONS}
            onChange={(value) =>
              void handleFieldChange(
                "backgroundStyle",
                value as NewTabBackgroundStyle
              )
            }
          />
          <SettingSelect
            label="Accent Tone"
            value={prefs.accentTone}
            options={ACCENT_OPTIONS}
            onChange={(value) =>
              void handleFieldChange("accentTone", value as NewTabAccentTone)
            }
          />
          <SettingSelect
            label="Density"
            value={prefs.density}
            options={DENSITY_OPTIONS}
            onChange={(value) =>
              void handleFieldChange("density", value as NewTabDensity)
            }
          />
          <SettingSelect
            label="Typography"
            value={prefs.typography}
            options={TYPOGRAPHY_OPTIONS}
            onChange={(value) =>
              void handleFieldChange("typography", value as NewTabTypography)
            }
          />
        </div>
      </div>

      <div className="brutal-divider w-full border-[var(--brutal-ink)] opacity-30" />

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 block">
            <h3 className="font-display font-bold text-xl uppercase tracking-tight">Layout</h3>
            <p className="font-mono text-xs uppercase opacity-60 max-w-lg">
              Drag modules to reorder them. Use the switch to hide or show each module.
            </p>
          </div>
          <span className="brutal-badge bg-[var(--brutal-secondary)] text-[var(--brutal-bg)] shadow-[2px_2px_0_var(--brutal-ink)]">
            {isInline ? "Editing OS Customizer" : "Settings page"}
          </span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => void handleDragEnd(event)}
        >
          <SortableContext
            items={prefs.moduleOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {prefs.moduleOrder.map((moduleId) => (
                <SortableModuleRow
                  key={moduleId}
                  moduleId={moduleId}
                  hidden={prefs.hiddenModules.includes(moduleId)}
                  onToggleVisibility={() =>
                    void handleModuleVisibilityToggle(moduleId)
                  }
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className="brutal-divider w-full border-[var(--brutal-ink)] opacity-30 mt-6" />

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between pt-2">
        <div className="flex flex-wrap gap-4">
          {!isInline ? (
            <button
              className="brutal-btn flex items-center bg-[var(--brutal-bg)] text-[var(--brutal-ink)]"
              onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") })}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Preview New Tab
            </button>
          ) : null}
          <button
            className="brutal-btn flex items-center bg-[var(--brutal-bg)] text-[var(--brutal-ink)]"
            onClick={() => chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })}
          >
            Open Kulon 
          </button>
          {isInline && onClose ? (
            <button className="brutal-btn brutal-btn-primary text-[var(--brutal-bg)]" onClick={onClose}>
              Done Editing
            </button>
          ) : null}
        </div>
        <button className="brutal-btn bg-[#c42828] text-white border-[#7d1414] shadow-[4px_4px_0_#4a0707] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#4a0707] flex items-center transition-all" onClick={() => void handleReset()}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Default
        </button>
      </div>
    </div>
  );
}

function SettingSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<[T, string]>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="brutal-card bg-[var(--brutal-surface)] p-5 space-y-3">
      <Label className="font-display font-bold text-sm uppercase tracking-tight block">{label}</Label>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as T)}>
        <SelectTrigger className="brutal-input rounded-none border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] h-auto py-3 shadow-[4px_4px_0_var(--brutal-ink)] uppercase font-mono font-bold text-xs ring-0 focus:ring-0">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="rounded-none border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] shadow-[4px_4px_0_var(--brutal-ink)] font-mono text-xs uppercase font-bold text-[var(--brutal-ink)]">
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue} className="focus:bg-[var(--brutal-primary)] focus:text-[var(--brutal-bg)] rounded-none cursor-pointer">
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SortableModuleRow({
  moduleId,
  hidden,
  onToggleVisibility,
}: {
  moduleId: NewTabModuleId;
  hidden: boolean;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: moduleId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-surface)] p-4 flex items-center justify-between gap-4 transition-transform ${
        isDragging ? "shadow-[8px_8px_0_var(--brutal-primary)] -translate-y-1 -translate-x-1 z-10" : "shadow-[4px_4px_0_var(--brutal-ink)] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_var(--brutal-ink)]"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          className="border-[3px] border-[var(--brutal-ink)] bg-[var(--brutal-bg)] p-2 hover:bg-[var(--brutal-ink)] hover:text-[var(--brutal-bg)] transition-colors"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${NEW_TAB_MODULE_LABELS[moduleId]}`}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 space-y-1 block">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-display font-bold uppercase text-base tracking-tight">{NEW_TAB_MODULE_LABELS[moduleId]}</p>
            <span className={`brutal-badge text-[10px] px-2 py-0.5 border-[2px] shadow-[2px_2px_0_var(--brutal-ink)] ${hidden ? "bg-[var(--brutal-secondary)] text-[var(--brutal-bg)]" : "bg-[var(--brutal-primary)] text-[var(--brutal-bg)]"}`}>
              {hidden ? "Hidden" : "Visible"}
            </span>
          </div>
          <p className="font-mono text-[10px] uppercase opacity-60">
            {NEW_TAB_MODULE_DESCRIPTIONS[moduleId]}
          </p>
        </div>
      </div>
      <Switch 
        checked={!hidden} 
        onCheckedChange={onToggleVisibility} 
        className="shrink-0 border-[3px] border-[var(--brutal-ink)] data-[state=checked]:bg-[var(--brutal-primary)] data-[state=unchecked]:bg-[var(--brutal-bg)] [&>span]:bg-[var(--brutal-ink)] shadow-[4px_4px_0_var(--brutal-ink)]"
      />
    </div>
  );
}
