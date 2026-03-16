import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, LayoutDashboard, RotateCcw, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

const SettingcardNewTab = () => {
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
    setPrefs(normalizeNewTabDashboardPrefs(result[STORAGE_KEY_NEW_TAB_DASHBOARD_PREFS]));
  };

  const persistPrefs = async (nextPrefs: NewTabDashboardPrefs, toastMessage?: string) => {
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
    await persistPrefs(nextPrefs, `Preset switched to ${NEW_TAB_PRESET_LABELS[value]}`);
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
    await persistPrefs(DEFAULT_NEW_TAB_DASHBOARD_PREFS, "New tab dashboard reset to default");
  };

  const visibleCount = prefs.moduleOrder.length - prefs.hiddenModules.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          New Tab Dashboard
        </CardTitle>
        <CardDescription>
          Control the layout and visual mood of your new tab page without touching the popup layout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
          <div className="space-y-1">
            <Label htmlFor="new-tab-dashboard-toggle" className="text-base font-medium">
              Enable custom new tab dashboard
            </Label>
            <p className="text-sm text-muted-foreground">
              Turning this off shows the minimal placeholder state, while keeping your saved layout and visual preferences.
            </p>
          </div>
          <Switch
            id="new-tab-dashboard-toggle"
            checked={enabled}
            onCheckedChange={(checked) => void handleToggleEnabled(checked)}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-xl border border-border/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">Preset</h3>
                <p className="text-sm text-muted-foreground">
                  Start from an opinionated look, then tweak the details manually.
                </p>
              </div>
              <Badge variant="secondary">{NEW_TAB_PRESET_LABELS[prefs.preset]}</Badge>
            </div>

            <Select value={prefs.preset} onValueChange={(value) => void handlePresetChange(value as NewTabPresetId)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a preset" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_IDS.map((presetId) => (
                  <SelectItem key={presetId} value={presetId}>
                    {NEW_TAB_PRESET_LABELS[presetId]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-sm text-muted-foreground">
              {NEW_TAB_PRESET_DESCRIPTIONS[prefs.preset]}
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-border/60 p-4">
            <div>
              <h3 className="text-base font-semibold">Quick Status</h3>
              <p className="text-sm text-muted-foreground">
                {visibleCount} of {prefs.moduleOrder.length} modules visible.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Layout saved in chrome storage</Badge>
              <Badge variant="outline">Popup stays separate</Badge>
              <Badge variant="outline">Full reset available</Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Visual Controls</h3>
            <p className="text-sm text-muted-foreground">
              Manual overrides stay on top of the selected preset.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SettingSelect
              label="Background"
              value={prefs.backgroundStyle}
              options={BACKGROUND_OPTIONS}
              onChange={(value) => void handleFieldChange("backgroundStyle", value as NewTabBackgroundStyle)}
            />
            <SettingSelect
              label="Accent Tone"
              value={prefs.accentTone}
              options={ACCENT_OPTIONS}
              onChange={(value) => void handleFieldChange("accentTone", value as NewTabAccentTone)}
            />
            <SettingSelect
              label="Density"
              value={prefs.density}
              options={DENSITY_OPTIONS}
              onChange={(value) => void handleFieldChange("density", value as NewTabDensity)}
            />
            <SettingSelect
              label="Typography"
              value={prefs.typography}
              options={TYPOGRAPHY_OPTIONS}
              onChange={(value) => void handleFieldChange("typography", value as NewTabTypography)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">Layout</h3>
              <p className="text-sm text-muted-foreground">
                Drag to reorder the 4 modules. Use the switch to hide or show each module on the page.
              </p>
            </div>
            <Badge variant="secondary">Settings only</Badge>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => void handleDragEnd(event)}
          >
            <SortableContext items={prefs.moduleOrder} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {prefs.moduleOrder.map((moduleId) => (
                  <SortableModuleRow
                    key={moduleId}
                    moduleId={moduleId}
                    hidden={prefs.hiddenModules.includes(moduleId)}
                    onToggleVisibility={() => void handleModuleVisibilityToggle(moduleId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") })}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Preview New Tab
            </Button>
            <Button
              variant="outline"
              onClick={() => chrome.tabs.create({ url: "https://kulon2.undip.ac.id/my/" })}
            >
              Open Kulon Assignments
            </Button>
          </div>
          <Button variant="destructive" onClick={() => void handleReset()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

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
    <div className="space-y-2 rounded-xl border border-border/60 p-4">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as T)}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: moduleId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-border/60 bg-background/70 p-4 ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-border/60 bg-background/90 p-2 text-muted-foreground transition-colors hover:text-foreground"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${NEW_TAB_MODULE_LABELS[moduleId]}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{NEW_TAB_MODULE_LABELS[moduleId]}</p>
            <Badge variant={hidden ? "outline" : "secondary"}>
              {hidden ? "Hidden" : "Visible"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {NEW_TAB_MODULE_DESCRIPTIONS[moduleId]}
          </p>
        </div>
        <Switch checked={!hidden} onCheckedChange={onToggleVisibility} />
      </div>
    </div>
  );
}

export default SettingcardNewTab;
