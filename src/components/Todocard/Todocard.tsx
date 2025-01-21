import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripHorizontal, ListTodo } from "lucide-react";
import { TodoItem } from "./Todocard.item";
import { TodoInput } from "./Todocard.input";
import { Todo } from "./Todocard.type";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button } from "../ui/button";

export function TodoList({
  listeners,
  attributes,
}: {
  listeners?: DraggableAttributes;
  attributes?: SyntheticListenerMap;
}) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);

        return newItems;
      });
    }
  };

  useEffect(() => {
    if (todos.length > 0) {
      chrome.storage.local.set({ todo: todos });
      console.log("Todos saved to storage:", todos);
    }
  }, [todos]);

  useEffect(() => {
    chrome.storage.local.get("todo", (result) => {
      const storedTodos = result.todo ? result.todo : [];
      console.log("Stored todos:", storedTodos);
      setTodos(storedTodos);
    });
  }, []);

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700">
      <Button
        variant="ghost"
        size="icon"
        className="w-full h-8 rounded-b-none border border-b-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        {...attributes}
        {...listeners}
      >
        <GripHorizontal className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ListTodo className="w-6 h-6" />
          Todo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TodoInput onAdd={addTodo} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
              {/* {todos.length === 0 && (
                <div className="text-center text-muted-foreground py-6">
                  No todos yet. Add one above!
                </div>
              )} */}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
