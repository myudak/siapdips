/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { toast } from "sonner";
import { cardComponents, CardComponentsType } from "./ListSort.card";

const initialCards = Object.keys(cardComponents);
const LOCAL_STORAGE_KEY = "sortableCards";

const LisSort = ({ setIsLocalStatus }: any) => {
  const [items, setItems] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const savedArray = JSON.parse(saved);
      const isSameArray =
        savedArray.length === initialCards.length &&
        [...savedArray].sort().join() === [...initialCards].sort().join();
      if (isSameArray) return savedArray;
    }
    return initialCards;
  });

  const [itemsHide] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + "Hide");
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  const sensors = useSensors(useSensor(MouseSensor));

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    toast.success("Saved", {
      action: {
        label: "X",
        onClick: () => console.log("(#-_ゝ-)"),
      },
    });
  }, [items]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prev: any[]) => {
        const oldIndex = prev.indexOf(active.id);
        const newIndex = prev.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const propsMap: Partial<Record<keyof CardComponentsType, any>> = {
    Ipkstatus: { setIsLocalStatus },
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => (
          <SortableItem
            key={id}
            id={id}
            // @ts-ignore
            Component={cardComponents[id]}
            // @ts-ignore
            propis={propsMap[id]}
            itemsHide={itemsHide}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

function SortableItem({
  id,
  Component,
  propis,
  itemsHide,
}: {
  id: string;
  Component: React.FC<any>;
  propis?: any;
  itemsHide: string[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log("id", id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`${isDragging ? "opacity-50" : ""} ${
        itemsHide.includes(id) ? "hidden" : ""
      }`}
      role=""
    >
      <Component attributes={attributes} listeners={listeners} {...propis} />
    </div>
  );
}

export default LisSort;
