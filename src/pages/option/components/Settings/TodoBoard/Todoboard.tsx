import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  closestCorners,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Task, Status } from "@/types/kanban";
import KanbanColumn from "./Todoboard.Column";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import NewColumnDialog from "./Todoboard.Newcolumndialog";
import { db } from "@/lib/db";

const initialColumns: Column[] = [
  {
    id: "myudak",
    title: "Personal",
    tasks: [
      {
        id: "tymmp70",
        title: "dragmee",
        description: "WOOH",
        priority: "🔥 PENTING!!",
        status: "in-progress",
        labels: [],
        comments: ["asd"],
      },
    ],
    position: 1,
  },
  {
    id: "luNgapainNjir",
    title: "Done",
    tasks: [],
    position: 2,
  },
  {
    id: "unchdip",
    title: "UNDIP",
    position: 0,
    tasks: [
      {
        id: "vv72lf9",
        title: "Laprak..",
        description: "gtw pertama",
        priority: "⏳ Diperhatikan",
        status: "todo",
        labels: [],
        comments: ["https://github.com/myudak"],
      },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [isNewColumnDialogOpen, setIsNewColumnDialogOpen] = useState(false);

  // Configure sensors for better touch support
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8, // 8px of movement to activate drag
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 200ms delay before drag starts
      tolerance: 8, // 8px tolerance for movement
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    const initDB = async () => {
      try {
        await db.init();
        const savedColumns = await db.getAllColumns();
        if (savedColumns.length > 0) {
          setColumns(savedColumns.sort((a, b) => a.position - b.position));
        } else {
          setColumns(initialColumns.sort((a, b) => a.position - b.position));
          await db.saveColumns(initialColumns);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
        setColumns(initialColumns.sort((a, b) => a.position - b.position));
      }
    };

    initDB();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Add visual feedback when drag starts
    console.log("Drag started:", event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (active.data.current?.type === "column") {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        try {
          const newColumns = arrayMove([...columns], oldIndex, newIndex).map(
            (col, index) => ({
              ...col,
              position: index,
            })
          );
          await db.saveColumns(newColumns);
          setColumns(newColumns);
        } catch (error) {
          console.error("Failed to save column reorder:", error);
        }
      }
    } else {
      const activeTask = active.data.current?.task as Task;
      if (!activeTask) return;

      const activeColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === activeId)
      );

      const overColumn = columns.find(
        (col) =>
          col.id === overId || col.tasks.some((task) => task.id === overId)
      );

      if (!activeColumn || !overColumn) return;

      const activeTaskIndex = activeColumn.tasks.findIndex(
        (task) => task.id === activeId
      );

      let newColumns = [...columns];
      if (activeColumn.id === overColumn.id) {
        const overTaskIndex = overColumn.tasks.findIndex(
          (task) => task.id === overId
        );

        const reorderedTasks = [...activeColumn.tasks];
        const [movedTask] = reorderedTasks.splice(activeTaskIndex, 1);

        const newIndex =
          overTaskIndex !== -1 ? overTaskIndex : reorderedTasks.length;
        reorderedTasks.splice(newIndex, 0, movedTask);

        newColumns = columns.map((col) =>
          col.id === activeColumn.id ? { ...col, tasks: reorderedTasks } : col
        );
      } else {
        const updatedTask = {
          ...activeColumn.tasks[activeTaskIndex],
          status: overColumn.id as Status,
        };

        const overTaskIndex = overColumn.tasks.findIndex(
          (task) => task.id === overId
        );

        const newOverTasks = [...overColumn.tasks];
        if (overTaskIndex !== -1) {
          newOverTasks.splice(overTaskIndex, 0, updatedTask);
        } else {
          newOverTasks.push(updatedTask);
        }

        newColumns = columns.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== activeId),
            };
          }
          if (col.id === overColumn.id) {
            return { ...col, tasks: newOverTasks };
          }
          return col;
        });
      }

      setColumns(newColumns);
      try {
        await db.saveColumns(newColumns);
      } catch (error) {
        console.error("Failed to save task movement:", error);
      }
    }
  };

  const handleNewColumn = async (title: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newId = `${title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${randomSuffix}` as Status;
    const newColumns = [
      ...columns,
      {
        id: newId,
        title,
        tasks: [],
        position: columns.length,
      },
    ];
    setColumns(newColumns);
    try {
      await db.saveColumns(newColumns);
    } catch (error) {
      console.error("Failed to save new column:", error);
    }
    setIsNewColumnDialogOpen(false);
  };

  const handleUpdateColumnTitle = async (
    columnId: string,
    newTitle: string
  ) => {
    const newColumns = columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    setColumns(newColumns);
    try {
      await db.saveColumns(newColumns);
    } catch (error) {
      console.error("Failed to update column title:", error);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    const newColumns = columns.filter((col) => col.id !== columnId);
    setColumns(newColumns);
    try {
      await db.saveColumns(newColumns);
    } catch (error) {
      console.error("Failed to delete column:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (updatedTask._delete) {
      const newColumns = columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== updatedTask.id),
      }));
      setColumns(newColumns);
      try {
        await db.saveColumns(newColumns);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
      return;
    }

    const newColumns = columns.map((col) => ({
      ...col,
      tasks: col.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
    setColumns(newColumns);
    try {
      await db.saveColumns(newColumns);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-muted/20 p-4 sm:p-6 lg:p-8 rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          {"ƪ(˘⌣˘)ʃ（*＾-＾*）"}
        </h1>
        <Button
          onClick={() => setIsNewColumnDialogOpen(true)}
          variant="outline"
          className="touch-manipulation min-h-[44px] w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add List
        </Button>
      </div>

      <div className="touch-pan-x">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[]}
        >
          <div
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-6 
                         max-w-full sm:max-w-[calc(320px*2+1.5rem*1)] lg:max-w-[calc(320px*3+1.5rem*2)] 
                         mx-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          >
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  onUpdateTitle={handleUpdateColumnTitle}
                  onDeleteColumn={handleDeleteColumn}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </SortableContext>
          </div>
          {/* <DragOverlay>
            {activeTask ? (
              <KanbanTask task={activeTask} overlay />
            ) : activeColumn ? (
              <KanbanColumn
                column={activeColumn}
                onUpdateTitle={handleUpdateColumnTitle}
                onDeleteColumn={handleDeleteColumn}
                overlay
              />
            ) : null}
          </DragOverlay> */}
        </DndContext>
      </div>

      <NewColumnDialog
        open={isNewColumnDialogOpen}
        onOpenChange={setIsNewColumnDialogOpen}
        onSubmit={handleNewColumn}
      />

      {/* TRIPPIN */}
      <div className="hidden bg-purple-500 bg-green-500 bg-blue-500 bg-red-500 bg-yellow-500 bg-indigo-500 bg-teal-500 bg-pink-500 bg-orange-500 bg-gray-500"></div>
    </div>
  );
}
