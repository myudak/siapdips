import { useEffect, useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Label } from "@/types/kanban";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Clock,
  GripVertical,
  MessageSquare,
  Plus,
  Trash2Icon,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KanbanTaskProps {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  overlay?: boolean;
}

const priorityColors = {
  none: "bg-gray-500/10 text-gray-500",
  "🌿 santai": "bg-blue-500/10 text-blue-500",
  "⏳ Diperhatikan": "bg-yellow-500/10 text-yellow-500",
  "🔥 PENTING!!": "bg-red-500/10 text-red-500",
};

const priorityIcons = {
  none: Clock,
  "🌿 santai": Clock,
  "⏳ Diperhatikan": AlertCircle,
  "🔥 PENTING!!": AlertCircle,
};

const predefinedColors = [
  "purple",
  "green",
  "blue",
  "red",
  "yellow",
  "indigo",
  "teal",
  "pink",
  "orange",
  "gray",
];

export default function KanbanTask({
  task,
  onUpdate,
  overlay,
}: KanbanTaskProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState<number | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = priorityIcons[task.priority];

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setNewComment("");

      const updatedTask = {
        ...editedTask,
        comments: updatedComments,
      };
      setEditedTask(updatedTask);
      onUpdate?.(updatedTask);
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      const newLabelObj: Label = {
        name: newLabel.trim(),
        color: selectedColor,
      };
      const updatedTask = {
        ...editedTask,
        labels: [...(editedTask.labels || []), newLabelObj],
      };
      setEditedTask(updatedTask);
      onUpdate?.(updatedTask);
      setNewLabel("");
      setIsAddingLabel(false);
    }
  };

  const handleRemoveLabel = (labelToRemove: Label) => {
    const updatedTask = {
      ...editedTask,
      labels: editedTask.labels?.filter(
        (label) => label.name !== labelToRemove.name
      ),
    };
    setEditedTask(updatedTask);
    onUpdate?.(updatedTask);
  };

  const handlePriorityChange = (value: string) => {
    console.log("SP", value);
    const updatedTask = {
      ...editedTask,
      priority: value as Task["priority"],
    };
    setEditedTask(updatedTask);
    onUpdate?.(updatedTask);
  };

  // Update editedTask when task prop changes
  useEffect(() => {
    setEditedTask(task);
    setComments(task.comments || []);
  }, [task]);

  const getFaviconUrl = (url: any) => {
    console.log("GET FAVICON");
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
    } catch (error) {
      return "";
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`${isDragging ? "opacity-50" : ""} ${
          overlay ? "cursor-grabbing" : ""
        } cursor-pointer `}
      >
        <Card
          className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors group relative"
          onClick={() => setIsDialogOpen(true)}
        >
          <div
            {...attributes}
            {...listeners}
            className="absolute top-3 left-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </div>
          <CardHeader className="p-4 pl-9">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium text-white mb-2">
                  {task.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mb-2">
                  {task.labels?.map((label) => (
                    <Badge
                      key={label.name}
                      variant="outline"
                      className={`bg-${label.color}-500/10 text-${label.color}-500`}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              {task.priority !== "none" && (
                <Badge
                  variant="outline"
                  className={`${priorityColors[task.priority]}`}
                >
                  <Icon className="mr-1 h-3 w-3" />
                  {task.priority}
                </Badge>
              )}

              {comments.length > 0 && (
                <div className="flex items-center text-gray-400 text-sm">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {comments.length}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[425px] bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Todo</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <Input
              value={editedTask.title}
              onChange={(e) => {
                const updatedTask = {
                  ...editedTask,
                  title: e.target.value,
                };
                setEditedTask(updatedTask);
              }}
              onBlur={() => onUpdate?.(editedTask)}
              className="bg-gray-800 border-gray-700 text-lg font-semibold"
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Delete todo?")) {
                  onUpdate?.({ ...task, _delete: true });
                  setIsDialogOpen(false);
                }
              }}
              className="ml-2"
            >
              <Trash2Icon className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Description
              </h4>
              {isEditingDescription ? (
                <Textarea
                  value={editedTask.description}
                  onChange={(e) => {
                    const updatedTask = {
                      ...editedTask,
                      description: e.target.value,
                    };
                    setEditedTask(updatedTask);
                  }}
                  onBlur={() => {
                    onUpdate?.(editedTask);
                    setIsEditingDescription(false);
                  }}
                  className="bg-gray-800 border-gray-700"
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => setIsEditingDescription(true)}
                  className="prose prose-invert prose-sm max-w-none hover:bg-gray-800/50 rounded-md p-2 cursor-pointer max-h-64 overflow-y-auto"
                >
                  <ReactMarkdown
                    components={{
                      a: ({ node, href, ...props }) => {
                        const faviconUrl = useMemo(
                          () => getFaviconUrl(href),
                          [href]
                        );

                        return (
                          <a
                            {...props}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-all"
                          >
                            <img
                              src={faviconUrl}
                              alt="Favicon"
                              className="w-4 h-4 m-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                            {props.children}
                          </a>
                        );
                      },
                    }}
                  >
                    {editedTask.description.replace(
                      /(https?:\/\/[^\s]+)/g,
                      "[$1]($1)"
                    ) || "description..."}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Prioritas
              </h4>
              <Select
                value={editedTask.priority}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="none">""</SelectItem>
                  <SelectItem value="🌿 santai">🌿 santai</SelectItem>
                  <SelectItem value="⏳ Diperhatikan">
                    ⏳ Diperhatikan
                  </SelectItem>
                  <SelectItem value="🔥 PENTING!!">🔥 PENTING!!</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-300">Labels</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingLabel(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedTask.labels?.map((label) => (
                  <Badge
                    key={label.name}
                    variant="outline"
                    className={`cursor-default bg-${label.color}-500/10 text-${label.color}-500 group`}
                  >
                    {label.name}
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {isAddingLabel && (
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    placeholder="Label name"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-[100px] bg-${selectedColor}-500/10 text-${selectedColor}-500`}
                      >
                        Color
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] bg-gray-800 border-gray-700">
                      <div className="grid grid-cols-5 gap-2">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 ring-white
                              ${selectedColor === color ? "ring-2" : ""}`}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={handleAddLabel}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Comments
              </h4>
              <div className="space-y-2 mb-4 ">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-3 rounded-md text-sm text-gray-300 max-h-64 overflow-y-auto"
                  >
                    {isEditingComment === index ? (
                      <Textarea
                        value={comment}
                        onChange={(e) => {
                          const newComments = [...comments];
                          newComments[index] = e.target.value;
                          setComments(newComments);
                          const updatedTask = {
                            ...editedTask,
                            comments: newComments,
                          };
                          setEditedTask(updatedTask);
                          onUpdate?.(updatedTask);
                        }}
                        onBlur={() => setIsEditingComment(null)}
                        className="bg-gray-700 border-gray-600"
                        autoFocus
                      />
                    ) : (
                      <div className="flex justify-between items-start gap-2 group relative">
                        <div
                          onClick={() => setIsEditingComment(index)}
                          className="flex-1 prose prose-invert prose-sm max-w-none hover:bg-gray-700/50 rounded p-1 cursor-pointer"
                        >
                          <ReactMarkdown
                            components={{
                              a: ({ node, href, ...props }) => (
                                <a
                                  {...props}
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-all"
                                >
                                  <img
                                    src={getFaviconUrl(href)}
                                    alt="Favicon"
                                    className="w-4 h-4 m-0"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                  {props.children}
                                </a>
                              ),
                            }}
                          >
                            {comment.replace(
                              /(https?:\/\/[^\s]+)/g,
                              "[$1]($1)"
                            )}
                          </ReactMarkdown>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("delete comment?")) {
                              const newComments = comments.filter(
                                (_, i) => i !== index
                              );
                              setComments(newComments);
                              const updatedTask = {
                                ...editedTask,
                                comments: newComments,
                              };
                              setEditedTask(updatedTask);
                              onUpdate?.(updatedTask);
                            }
                          }}
                          className="text-gray-400 hover:text-red-400 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 -top-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button
                  onClick={handleAddComment}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
