import React, { useMemo, useState, useRef, useEffect } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Download,
  Edit3,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface Job {
  company: string;
  companySize: string;
  date: string;
  experienceLevel: string;
  industry: string;
  jobType: string;
  location: string;
  notes: string;
  salary: string;
  status: string;
  title: string;
  url: string;
}

interface NivoSankeyNode {
  id: string;
  nodeColor?: string;
}

interface NivoSankeyLink {
  source: string;
  target: string;
  value: number;
}

interface NivoSankeyData {
  nodes: NivoSankeyNode[];
  links: NivoSankeyLink[];
}

interface SankeyDiagramProps {
  jobs: Job[];
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ jobs }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // Define the status progression order and labels (removed "saved")
  const statusOrder = [
    "applied",
    "assessment",
    "phone-screen",
    "interview",
    "offer",
  ];

  const statusLabels = {
    applied: "Applied",
    assessment: "Assessment",
    "phone-screen": "Phone Screen",
    interview: "Interview",
    offer: "Offer",
  };

  // Define colors for each status
  const statusColors = {
    saved: "#6366F1",
    applied: "#4F46E5",
    assessment: "#8B5CF6",
    "phone-screen": "#EC4899",
    interview: "#F59E0B",
    offer: "#10B981",
  };

  // Calculate smart backtracked counts - only backtrack to Applied (not through every status)
  const calculateBacktrackedCounts = (
    rawCounts: Record<string, number>
  ): Record<string, number> => {
    const backtrackedCounts: Record<string, number> = { ...rawCounts };

    // Smart backtracking: jobs can skip intermediate statuses
    // All jobs must start from "Applied", so backtrack everything to Applied
    let totalJobsThatProgressed = 0;

    // Count all jobs that progressed beyond Applied
    for (let i = 1; i < statusOrder.length; i++) {
      const status = statusOrder[i];
      totalJobsThatProgressed += backtrackedCounts[status] || 0;
    }

    // Add progressed jobs to Applied count
    backtrackedCounts["applied"] =
      (backtrackedCounts["applied"] || 0) + totalJobsThatProgressed;

    // For other statuses, only backtrack immediate higher statuses that actually exist
    // Phone Screen: add Interview + Offer counts (jobs that progressed through phone screen)
    if (backtrackedCounts["interview"] || backtrackedCounts["offer"]) {
      const phoneScreenBacktrack =
        (backtrackedCounts["interview"] || 0) +
        (backtrackedCounts["offer"] || 0);
      backtrackedCounts["phone-screen"] =
        (backtrackedCounts["phone-screen"] || 0) + phoneScreenBacktrack;
    }

    // Interview: add Offer count (jobs that progressed through interview)
    if (backtrackedCounts["offer"]) {
      backtrackedCounts["interview"] =
        (backtrackedCounts["interview"] || 0) + backtrackedCounts["offer"];
    }

    return backtrackedCounts;
  };

  // Calculate actual job counts with backtracking
  const actualCounts = useMemo(() => {
    const rawCounts: Record<string, number> = {};
    statusOrder.forEach((status) => {
      rawCounts[status] = jobs.filter((job) => job.status === status).length;
    });

    // Apply backtracking logic for realistic pipeline view
    return calculateBacktrackedCounts(rawCounts);
  }, [jobs]);

  // Flow definitions for manual editing
  interface FlowDefinition {
    source: string;
    target: string;
    value: number;
  }

  const [manualFlows, setManualFlows] = useState<FlowDefinition[]>([]);
  const [flowText, setFlowText] = useState<string>("");
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  // Get display data (manual flows if in edit mode, otherwise actual counts)
  const displayData = useMemo(() => {
    if (editMode && manualFlows.length > 0) {
      return { type: "flows" as const, flows: manualFlows };
    }
    return { type: "counts" as const, counts: actualCounts };
  }, [editMode, manualFlows, actualCounts]);

  // Generate dynamic text template from backtracked actual counts
  const generateFlowTemplate = (counts: Record<string, number>): string => {
    const lines: string[] = [];

    // Create realistic flows based on backtracked data
    for (let i = 0; i < statusOrder.length; i++) {
      const currentStatus = statusOrder[i];
      const currentCount = counts[currentStatus] || 0;

      if (currentCount > 0) {
        // Find the next non-zero status to flow to
        let nextStatus = null;
        let nextCount = 0;

        for (let j = i + 1; j < statusOrder.length; j++) {
          const candidateStatus = statusOrder[j];
          const candidateCount = counts[candidateStatus] || 0;
          if (candidateCount > 0) {
            nextStatus = candidateStatus;
            nextCount = candidateCount;
            break;
          }
        }

        // Flow to next status (jobs that progressed)
        if (nextStatus && nextCount > 0) {
          lines.push(
            `${
              statusLabels[currentStatus as keyof typeof statusLabels]
            } [${nextCount}] ${
              statusLabels[nextStatus as keyof typeof statusLabels]
            }`
          );
        }

        // Remaining jobs stopped at this stage
        const remaining = currentCount - nextCount;
        if (remaining > 0 && currentStatus !== "offer") {
          lines.push(
            `${
              statusLabels[currentStatus as keyof typeof statusLabels]
            } [${remaining}] No Update`
          );
        }
      }
    }

    return lines.join("\n");
  };

  // Parse flow text into flow definitions
  const parseFlowText = (
    text: string
  ): { flows: FlowDefinition[]; errors: string[] } => {
    const lines = text.split("\n").filter((line) => line.trim());
    const errors: string[] = [];
    const flows: FlowDefinition[] = [];

    // Regex pattern: Source [value] Target
    const flowPattern = /^(.+?)\s*\[(\d+)\]\s*(.+)$/;

    // Extended target mapping
    const targetMapping: Record<string, string> = {
      ...statusLabels,
      "no update": "no-update",
      rejected: "rejected",
      offer: "offer",
    };

    lines.forEach((line, index) => {
      const match = line.trim().match(flowPattern);
      if (!match) {
        errors.push(
          `Line ${index + 1}: Invalid format. Expected "Source [value] Target"`
        );
        return;
      }

      const [, sourceName, valueStr, targetName] = match;
      const value = parseInt(valueStr);

      if (isNaN(value) || value < 0) {
        errors.push(
          `Line ${
            index + 1
          }: Invalid value "${valueStr}". Must be a non-negative number.`
        );
        return;
      }

      // Find source status
      const sourceStatus = Object.entries(statusLabels).find(
        ([, label]) => label.toLowerCase() === sourceName.trim().toLowerCase()
      )?.[0];

      if (!sourceStatus) {
        errors.push(`Line ${index + 1}: Unknown source status "${sourceName}"`);
        return;
      }

      // Find target status
      const targetKey = targetName.trim().toLowerCase();
      let targetStatus = Object.entries(targetMapping).find(
        ([, label]) => label.toLowerCase() === targetKey
      )?.[0];

      // If not found in mapping, try direct match with status keys
      if (!targetStatus) {
        targetStatus = Object.keys(statusLabels).find(
          (key) =>
            statusLabels[key as keyof typeof statusLabels].toLowerCase() ===
            targetKey
        );
      }

      // Special handling for common targets
      if (!targetStatus) {
        if (targetKey === "no update") targetStatus = "no-update";
        else if (targetKey === "rejected") targetStatus = "rejected";
        else {
          errors.push(
            `Line ${index + 1}: Unknown target status "${targetName}"`
          );
          return;
        }
      }

      flows.push({
        source: sourceStatus,
        target: targetStatus,
        value: value,
      });
    });

    return { flows, errors };
  };

  // Enhanced Sankey data that supports both flow and count modes
  const sankeyData: NivoSankeyData = useMemo(() => {
    let nodes: NivoSankeyNode[] = [
      ...statusOrder.map((status) => ({
        id: status,
        nodeColor: statusColors[status as keyof typeof statusColors],
      })),
    ];

    let links: NivoSankeyLink[] = [];

    if (displayData.type === "flows") {
      // Use manual flows directly
      const { flows } = displayData;

      // Add special nodes for non-standard targets
      const specialNodes = new Set<string>();
      flows.forEach((flow) => {
        if (
          !statusOrder.includes(flow.target) &&
          !specialNodes.has(flow.target)
        ) {
          specialNodes.add(flow.target);
          nodes.push({
            id: flow.target,
            nodeColor: "#6B7280", // Gray for special nodes
          });
        }
      });

      // Convert flows to links
      links = flows.map((flow) => ({
        source: flow.source,
        target: flow.target,
        value: flow.value,
      }));
    } else {
      console.log("Using actual counts for Sankey data");
      const template = generateFlowTemplate(actualCounts);
      console.log("Generated flow template:", template);
      const { flows, errors } = parseFlowText(template);
      if (errors.length > 0) {
        console.error("Flow parsing errors:", errors);
        return { nodes: [], links: [] };
      }

      // Add special nodes for non-standard targets
      const specialNodes = new Set<string>();
      flows.forEach((flow) => {
        if (
          !statusOrder.includes(flow.target) &&
          !specialNodes.has(flow.target)
        ) {
          specialNodes.add(flow.target);
          nodes.push({
            id: flow.target,
            nodeColor: "#6B7280", // Gray for special nodes
          });
        }
      });

      // Convert flows to links
      links = flows.map((flow) => ({
        source: flow.source,
        target: flow.target,
        value: flow.value,
      }));
    }
    // else {

    //   // Use backtracked count-based logic with proper flow connections
    //   const { counts } = displayData;

    //   // Add "No Update" node if needed
    //   let hasNoUpdateNode = false;

    //   // Create flows from backtracked counts
    //   for (let i = 0; i < statusOrder.length - 1; i++) {
    //     const currentStatus = statusOrder[i];
    //     const nextStatus = statusOrder[i + 1];
    //     const currentCount = counts[currentStatus] || 0;
    //     const nextCount = counts[nextStatus] || 0;

    //     if (currentCount > 0) {
    //       // Flow to next status (jobs that progressed)
    //       if (nextCount > 0) {
    //         links.push({
    //           source: currentStatus,
    //           target: nextStatus,
    //           value: nextCount,
    //         });
    //       }

    //       // Remaining jobs stopped at this stage
    //       const remaining = currentCount - nextCount;
    //       if (remaining > 0) {
    //         if (!hasNoUpdateNode) {
    //           nodes.push({
    //             id: "No Update",
    //             nodeColor: "#6B7280", // Gray color for stopped nodes
    //           });
    //           hasNoUpdateNode = true;
    //         }

    //         links.push({
    //           source: currentStatus,
    //           target: "No Update",
    //           value: remaining,
    //         });
    //       }
    //     }
    //   }
    // }

    // Ensure we always have some minimal structure even with all zeros
    if (links.length === 0) {
      // Create minimal flow structure for visualization
      for (let i = 0; i < statusOrder.length - 1; i++) {
        links.push({
          source: statusOrder[i],
          target: statusOrder[i + 1],
          value: 1, // Minimal flow for visualization
        });
      }
    }

    // Collect all used node ids from links
    const usedNodeIds = new Set();
    links.forEach((link) => {
      usedNodeIds.add(link.source);
      usedNodeIds.add(link.target);
    });
    console.log("Used node IDs:", usedNodeIds);

    nodes = nodes.filter((node) => usedNodeIds.has(node.id));
    console.log("Filtered nodes:", nodes);

    console.log("Nivo Sankey Data:", { nodes, links, displayData });
    return { nodes, links };
  }, [displayData]);

  // Handle text change
  const handleFlowTextChange = (text: string) => {
    setFlowText(text);
    const { flows, errors } = parseFlowText(text);
    setParseErrors(errors);

    if (errors.length === 0) {
      setManualFlows(flows);
    }
  };

  // Generate template button handler
  const generateTemplate = () => {
    const template = generateFlowTemplate(actualCounts);
    setFlowText(template);
    handleFlowTextChange(template);
  };

  // Reset to actual data
  const resetToActualData = () => {
    setManualFlows([]);
    setFlowText("");
    setParseErrors([]);
    setEditMode(false);
  };

  // Initialize manual flows when entering edit mode
  const handleEditModeToggle = (enabled: boolean) => {
    setEditMode(enabled);
    if (enabled && manualFlows.length === 0) {
      // Generate initial flows from actual counts
      const template = generateFlowTemplate(actualCounts);
      setFlowText(template);
      handleFlowTextChange(template);
    }
    if (enabled) {
      setIsEditPanelOpen(true);
    }
  };

  // Export to PNG
  const exportToPNG = async () => {
    if (!chartRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `job-pipeline-sankey-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Chart exported successfully!");
    } catch (error) {
      console.error("Error exporting chart:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Custom tooltip for Nivo Sankey
  const customTooltip = ({
    node,
    link,
  }: {
    node?: { id: string; value?: number };
    link?: { source: { id: string }; target: { id: string }; value: number };
  }) => {
    if (link) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {statusLabels[link.source.id as keyof typeof statusLabels] ||
              link.source.id}{" "}
            →{" "}
            {statusLabels[link.target.id as keyof typeof statusLabels] ||
              link.target.id}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {link.value} job{link.value > 1 ? "s" : ""}
          </p>
        </div>
      );
    }

    if (node) {
      const nodeLabel =
        statusLabels[node.id as keyof typeof statusLabels] || node.id;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {nodeLabel}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {node.value || 0} job{(node.value || 0) > 1 ? "s" : ""}
          </p>
        </div>
      );
    }

    return null;
  };

  const totalJobs = useMemo(() => {
    if (displayData.type === "flows") {
      // Calculate total from flows
      return displayData.flows
        .filter((flow) => flow.source === "applied")
        .reduce((sum, flow) => sum + flow.value, 0);
    } else if (displayData.type === "counts") {
      // Calculate total from counts
      return displayData.counts.applied || 0;
    }
    return jobs.length;
  }, [editMode, displayData, jobs.length]);

  return (
    <div className="w-full space-y-4">
      {/* Controls Panel */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Controls</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <Label htmlFor="edit-mode" className="text-sm">
                  Edit Mode
                </Label>
                <Switch
                  id="edit-mode"
                  checked={editMode}
                  onCheckedChange={handleEditModeToggle}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPNG}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export PNG"}
              </Button>
            </div>
          </div>
        </CardHeader>

        {editMode && (
          <CardContent className="pt-0">
            <Collapsible
              open={isEditPanelOpen}
              onOpenChange={setIsEditPanelOpen}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2">
                  <span className="text-sm font-medium">
                    Manual Value Editor
                  </span>
                  {isEditPanelOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="flow-editor"
                      className="text-sm font-medium"
                    >
                      Flow Editor
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateTemplate}
                      className="text-xs"
                    >
                      Generate Template
                    </Button>
                  </div>

                  <Textarea
                    id="flow-editor"
                    value={flowText}
                    onChange={(e) => handleFlowTextChange(e.target.value)}
                    placeholder="Enter flows in format: Source [value] Target&#10;Example:&#10;Applied [25] No Update&#10;Applied [8] Phone Screen&#10;Assessment [2] Phone Screen"
                    className="min-h-[120px] text-sm font-mono"
                  />

                  {parseErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <div className="space-y-1">
                          {parseErrors.map((error, index) => (
                            <div key={index} className="text-xs">
                              {error}
                            </div>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToActualData}
                    className="text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset to Actual Data
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Total: {totalJobs} jobs
                  </span>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        )}
      </Card>

      {/* Sankey Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            Job Application Pipeline
            <div className="flex items-center gap-2">
              {editMode && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Edit Mode
                </span>
              )}
              <span className="text-sm font-normal text-muted-foreground">
                {totalJobs} Total Applications
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-background">
            <div ref={chartRef} className="w-full h-[400px] bg-background">
              <ResponsiveSankey
                data={sankeyData}
                margin={{ top: 40, right: 80, bottom: 40, left: 60 }}
                align="justify"
                colors={{ scheme: "category10" }}
                linkBlendMode={isDarkMode ? "screen" : "multiply"}
                nodeOpacity={1}
                nodeHoverOthersOpacity={0.35}
                nodeThickness={18}
                nodeSpacing={24}
                nodeBorderWidth={0}
                nodeBorderColor={{
                  from: "color",
                  modifiers: [["darker", 0.8]],
                }}
                linkOpacity={0.5}
                linkHoverOthersOpacity={0.1}
                linkContract={3}
                enableLinkGradient={true}
                labelPosition="outside"
                labelOrientation="horizontal"
                labelPadding={16}
                labelTextColor={
                  isDarkMode
                    ? "#ffffff"
                    : {
                        from: "color",
                        modifiers: [["darker", 1]],
                      }
                }
                animate={true}
                motionConfig="gentle"
                theme={{
                  background: "transparent",
                  text: {
                    fontSize: 12,
                    fill: "currentColor",
                  },
                  tooltip: {
                    container: {
                      background: "white",
                      color: "#333",
                      fontSize: 12,
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    },
                  },
                }}
                nodeTooltip={({ node }) => customTooltip({ node })}
                linkTooltip={({ link }) => customTooltip({ link })}
                layers={["links", "nodes", "labels"]}
                legends={[
                  {
                    anchor: "top-right",
                    direction: "column",
                    translateX: 130,
                    itemWidth: 100,
                    itemHeight: 14,
                    itemDirection: "right-to-left",
                    itemsSpacing: 2,
                    itemTextColor: "#999",
                    symbolSize: 14,
                  },
                ]}
              />
            </div>

            {/* Status Summary */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statusOrder.map((status) => {
                // Calculate count based on display data type
                let count = 0;
                if (displayData.type === "flows") {
                  // Sum up all flows from this status
                  count = displayData.flows
                    .filter((flow) => flow.source === status)
                    .reduce((sum, flow) => sum + flow.value, 0);
                } else {
                  count = displayData.counts[status] || 0;
                }

                const percentage =
                  totalJobs > 0 ? ((count / totalJobs) * 100).toFixed(1) : "0";

                const statusStyleColors = {
                  saved:
                    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
                  applied: "bg-blue-500 text-white dark:bg-blue-600",
                  assessment:
                    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
                  "phone-screen":
                    "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
                  interview:
                    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
                  offer:
                    "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
                };

                return (
                  <div key={status} className="text-center">
                    <div
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        statusStyleColors[
                          status as keyof typeof statusStyleColors
                        ]
                      }`}
                    >
                      {statusLabels[status as keyof typeof statusLabels]}
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                      {count}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SankeyDiagram;
