import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, Label } from "@/types/kanban";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, X } from "lucide-react";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Task) => void;
}

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

export default function NewTaskDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("none");
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [isAddingLabel, setIsAddingLabel] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      priority: priority.replace(/\\u([\dA-F]{4})/gi, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      ) as Task["priority"],
      status: "todo",
      labels,
    });
    setTitle("");
    setDescription("");
    setPriority("none");
    setLabels([]);
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      setLabels([...labels, { name: newLabel.trim(), color: selectedColor }]);
      setNewLabel("");
      setIsAddingLabel(false);
    }
  };

  const handleRemoveLabel = (labelName: string) => {
    setLabels(labels.filter((label) => label.name !== labelName));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>new todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Select
              value={priority}
              onValueChange={(value: Task["priority"]) => {
                return setPriority(value);
              }}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Prioritas" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="none">""</SelectItem>
                <SelectItem value="🌿 santai">🌿 santai</SelectItem>
                <SelectItem value="⏳ Diperhatikan">⏳ Diperhatikan</SelectItem>
                <SelectItem value="🔥 PENTING!!">🔥 PENTING!!</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">Labels</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingLabel(true)}
                className="text-gray-400 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <Badge
                  key={label.name}
                  variant="outline"
                  className={`bg-${label.color}-500/10 text-${label.color}-500 group`}
                >
                  {label.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveLabel(label.name)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {isAddingLabel && (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Label name"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
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
                          type="button"
                          className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 ring-white
                            ${selectedColor === color ? "ring-2" : ""}`}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  onClick={handleAddLabel}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-indigo-300 hover:bg-indigo-600">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
