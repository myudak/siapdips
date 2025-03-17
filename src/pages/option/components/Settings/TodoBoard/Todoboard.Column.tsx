import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@/types/kanban";
import KanbanTask from "./Todoboard.Task";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, PlusCircle, GripVertical } from "lucide-react";
import NewTaskDialog from "./Todoboard.Newtaskdialog";

interface KanbanColumnProps {
  column: Column;
  onUpdateTitle: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateTask?: (updatedTask: Task) => void;
  overlay?: boolean;
}

export default function KanbanColumn({
  column,
  onUpdateTitle,
  onDeleteColumn,
  onUpdateTask,
  overlay,
}: KanbanColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  // Remove the local tasks state and use column.tasks directly

  // Add droppable functionality to the column
  const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const {
    setNodeRef: setSortableNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
    animateLayoutChanges: () => false,
  });

  // Combine the refs for both sortable and droppable functionality
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableNodeRef(node);
    setDroppableNodeRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSubmit = () => {
    if (title.trim()) {
      onUpdateTitle(column.id, title);
      setIsEditing(false);
    }
  };

  const handleNewTask = (task: Task) => {
    const newTask = { ...task, status: column.id };
    // Pass the new task to the parent component through onUpdateTask
    column.tasks.push(newTask);
    onUpdateTask?.(newTask);
    setIsNewTaskDialogOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    // Pass the updated task to the parent component
    onUpdateTask?.(updatedTask);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-80 flex-shrink-0 bg-gray-900 dark:bg-gray-800/50 rounded-lg p-4 min-h-[200px] max-h-[50dvh] ${
        isDragging ? "opacity-50" : ""
      } ${overlay ? "cursor-grabbing" : "cursor-default"} ${
        isOver ? "ring-2 ring-indigo-500" : ""
      }   `}
      {...attributes}
    >
      <div
        className="flex items-center justify-between mb-4"
        onMouseEnter={() => setIsHoveringTitle(true)}
        onMouseLeave={() => setIsHoveringTitle(false)}
      >
        <div className="flex items-center space-x-2">
          <div
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-700 rounded"
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-500" />
          </div>
          {isEditing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              className="bg-gray-700 border-gray-600 text-white"
              autoFocus
            />
          ) : (
            <div className="flex items-center">
              <h2
                className="text-lg font-semibold text-white cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                {column.title}
              </h2>
              {/* <button
                onClick={() => setIsEditing(true)}
                className="ml-2 p-1 hover:bg-gray-700 rounded"
              >
                <Pencil className="h-4 w-4 text-gray-400" />
              </button> */}
            </div>
          )}
        </div>
        <div
          className={`flex items-center space-x-2 transition-opacity duration-200 ${
            isHoveringTitle ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            onClick={() => setIsNewTaskDialogOpen(true)}
            variant="ghost"
            size="sm"
            className="text-gray-400"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              if (confirm("Beneran mau delete list ini?")) {
                onDeleteColumn(column.id);
              }
            }}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-[80%] overflow-y-auto ">
        <div className="text-sm text-gray-400">
          {column.tasks.length} {column.tasks.length === 1 ? "todo" : "todos"}
        </div>
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <KanbanTask
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onSubmit={handleNewTask}
      />
    </div>
  );
}
