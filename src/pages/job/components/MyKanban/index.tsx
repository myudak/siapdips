import { createId } from "@paralleldrive/cuid2";
import {
  ClockIcon,
  EditIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  PenIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useJsLoaded } from "@/hooks/use-js-loaded";
import type {
  KanbanBoardCircleColor,
  KanbanBoardDropDirection,
} from "@/components/ui/kanban";
import {
  KANBAN_BOARD_CIRCLE_COLORS,
  KanbanBoard,
  KanbanBoardCard,
  KanbanBoardCardButton,
  KanbanBoardCardButtonGroup,
  KanbanBoardCardTextarea,
  KanbanBoardColumn,
  KanbanBoardColumnButton,
  kanbanBoardColumnClassNames,
  KanbanBoardColumnFooter,
  KanbanBoardColumnHeader,
  KanbanBoardColumnIconButton,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  kanbanBoardColumnListItemClassNames,
  KanbanBoardColumnSkeleton,
  KanbanBoardColumnTitle,
  KanbanBoardExtraMargin,
  KanbanBoardProvider,
  KanbanColorCircle,
  useDndEvents,
} from "@/components/ui/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Types
type CardPriority = "low" | "medium" | "high" | "urgent";

type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
};

type Card = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  priority?: CardPriority;
  dueDate?: string;
  assignee?: string;
  comments?: Comment[];
};

type Column = {
  id: string;
  title: string;
  color: KanbanBoardCircleColor;
  items: Card[];
};

export default function KanbanBoardPage() {
  return (
    <div className="grid h-screen grid-rows-[var(--header-height)_1fr_6rem] overflow-x-hidden sm:grid-rows-[var(--header-height)_1fr_var(--header-height)]">
      <main className="relative">
        <div className="absolute inset-0 h-full overflow-x-hidden px-4 py-4 md:px-6">
          <KanbanBoardProvider>
            <MyKanbanBoard />
          </KanbanBoardProvider>
        </div>
      </main>
    </div>
  );
}

// Constants
const STORAGE_KEY = "kanban-board-data";

// Default data
const DEFAULT_COLUMNS: Column[] = [
  {
    id: "col-backlog",
    title: "Backlog",
    color: "primary",
    items: [
      {
        id: "card-1",
        title: "Update resume",
        description: "Revise and tailor resume for software engineering roles.",
        tags: ["resume", "prep"],
        priority: "high",
        assignee: "You",
      },
      {
        id: "card-2",
        title: "Research companies",
        description: "Identify companies and roles that match your interests.",
        tags: ["research"],
        priority: "medium",
      },
    ],
  },
  {
    id: "col-todo",
    title: "Todo",
    color: "blue",
    items: [
      {
        id: "card-3",
        title: "Apply to Microsoft",
        description: "Submit application for Frontend Engineer position.",
        tags: ["application"],
        priority: "high",
        dueDate: "2024-07-10",
      },
      {
        id: "card-4",
        title: "Apply to Gojek",
        description: "Apply for Software Engineer, Typescript/React.",
        tags: ["application"],
        priority: "medium",
      },
    ],
  },
  {
    id: "col-done",
    title: "Done",
    color: "yellow",
    items: [
      {
        id: "card-5",
        title: "Job Dashboard",
        description: "SIaP DiPS Job Dashboard",
        dueDate: "2025-07-06",
      },
    ],
  },
];

// localStorage utilities
function saveToLocalStorage(data: Column[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

function loadFromLocalStorage(): Column[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
  }
  return DEFAULT_COLUMNS;
}

function resetToDefault() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset localStorage:", error);
  }
  return DEFAULT_COLUMNS;
}

export function MyKanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(loadFromLocalStorage);

  // Save to localStorage whenever columns change
  useEffect(() => {
    saveToLocalStorage(columns);
  }, [columns]);

  // Scroll to the right when a new column is added.
  const scrollContainerReference = useRef<HTMLDivElement>(null);

  function scrollRight() {
    if (scrollContainerReference.current) {
      scrollContainerReference.current.scrollLeft =
        scrollContainerReference.current.scrollWidth;
    }
  }

  /*
  Column logic
  */

  const handleAddColumn = (title?: string) => {
    if (title) {
      flushSync(() => {
        setColumns((previousColumns) => [
          ...previousColumns,
          {
            id: createId(),
            title,
            color:
              KANBAN_BOARD_CIRCLE_COLORS[previousColumns.length] ?? "primary",
            items: [],
          },
        ]);
      });
    }

    scrollRight();
  };

  function handleDeleteColumn(columnId: string) {
    flushSync(() => {
      setColumns((previousColumns) =>
        previousColumns.filter((column) => column.id !== columnId)
      );
    });

    scrollRight();
  }

  function handleUpdateColumnTitle(columnId: string, title: string) {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.id === columnId ? { ...column, title } : column
      )
    );
  }

  /*
  Card logic
  */

  function handleAddCard(columnId: string, cardContent: string) {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              items: [...column.items, { id: createId(), title: cardContent }],
            }
          : column
      )
    );
  }

  function handleUpdateCard(cardId: string, updatedCard: Partial<Card>) {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.items.some((card) => card.id === cardId)
          ? {
              ...column,
              items: column.items.map((card) =>
                card.id === cardId ? { ...card, ...updatedCard } : card
              ),
            }
          : column
      )
    );
  }

  function handleDeleteCard(cardId: string) {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.items.some((card) => card.id === cardId)
          ? { ...column, items: column.items.filter(({ id }) => id !== cardId) }
          : column
      )
    );
  }

  function handleMoveCardToColumn(columnId: string, index: number, card: Card) {
    setColumns((previousColumns) =>
      previousColumns.map((column) => {
        if (column.id === columnId) {
          // Remove the card from the column (if it exists) before reinserting it.
          const updatedItems = column.items.filter(({ id }) => id !== card.id);
          return {
            ...column,
            items: [
              // Items before the insertion index.
              ...updatedItems.slice(0, index),
              // Insert the card.
              card,
              // Items after the insertion index.
              ...updatedItems.slice(index),
            ],
          };
        } else {
          // Remove the card from other columns.
          return {
            ...column,
            items: column.items.filter(({ id }) => id !== card.id),
          };
        }
      })
    );
  }

  function handleUpdateCardTitle(cardId: string, cardTitle: string) {
    setColumns((previousColumns) =>
      previousColumns.map((column) =>
        column.items.some((card) => card.id === cardId)
          ? {
              ...column,
              items: column.items.map((card) =>
                card.id === cardId ? { ...card, title: cardTitle } : card
              ),
            }
          : column
      )
    );
  }

  /*
  Moving cards with the keyboard.
  */
  const [activeCardId, setActiveCardId] = useState<string>("");
  const originalCardPositionReference = useRef<{
    columnId: string;
    cardIndex: number;
  } | null>(null);
  const { onDragStart, onDragEnd, onDragCancel, onDragOver } = useDndEvents();

  // This helper returns the appropriate overId after a card is placed.
  // If there's another card below, return that card's id, otherwise return the column's id.
  function getOverId(column: Column, cardIndex: number): string {
    if (cardIndex < column.items.length - 1) {
      return column.items[cardIndex + 1].id;
    }

    return column.id;
  }

  // Find column and index for a given card.
  function findCardPosition(cardId: string): {
    columnIndex: number;
    cardIndex: number;
  } {
    for (const [columnIndex, column] of columns.entries()) {
      const cardIndex = column.items.findIndex((c) => c.id === cardId);

      if (cardIndex !== -1) {
        return { columnIndex, cardIndex };
      }
    }

    return { columnIndex: -1, cardIndex: -1 };
  }

  function moveActiveCard(
    cardId: string,
    direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown"
  ) {
    const { columnIndex, cardIndex } = findCardPosition(cardId);
    if (columnIndex === -1 || cardIndex === -1) return;

    const card = columns[columnIndex].items[cardIndex];

    let newColumnIndex = columnIndex;
    let newCardIndex = cardIndex;

    switch (direction) {
      case "ArrowUp": {
        newCardIndex = Math.max(cardIndex - 1, 0);

        break;
      }
      case "ArrowDown": {
        newCardIndex = Math.min(
          cardIndex + 1,
          columns[columnIndex].items.length - 1
        );

        break;
      }
      case "ArrowLeft": {
        newColumnIndex = Math.max(columnIndex - 1, 0);
        // Keep same cardIndex if possible, or if out of range, insert at end
        newCardIndex = Math.min(
          newCardIndex,
          columns[newColumnIndex].items.length
        );

        break;
      }
      case "ArrowRight": {
        newColumnIndex = Math.min(columnIndex + 1, columns.length - 1);
        newCardIndex = Math.min(
          newCardIndex,
          columns[newColumnIndex].items.length
        );

        break;
      }
    }

    // Perform state update in flushSync to ensure immediate state update.
    flushSync(() => {
      handleMoveCardToColumn(columns[newColumnIndex].id, newCardIndex, card);
    });

    // Find the card's new position and announce it.
    const { columnIndex: updatedColumnIndex, cardIndex: updatedCardIndex } =
      findCardPosition(cardId);
    const overId = getOverId(columns[updatedColumnIndex], updatedCardIndex);

    onDragOver(cardId, overId);
  }

  function handleCardKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    cardId: string
  ) {
    const { key } = event;

    if (activeCardId === "" && key === " ") {
      // Pick up the card.
      event.preventDefault();
      setActiveCardId(cardId);
      onDragStart(cardId);

      const { columnIndex, cardIndex } = findCardPosition(cardId);
      originalCardPositionReference.current =
        columnIndex !== -1 && cardIndex !== -1
          ? { columnId: columns[columnIndex].id, cardIndex }
          : null;
    } else if (activeCardId === cardId) {
      // Card is already active.
      if (key === " " || key === "Enter") {
        event.preventDefault();
        // Drop the card.
        flushSync(() => {
          setActiveCardId("");
        });

        const { columnIndex, cardIndex } = findCardPosition(cardId);
        if (columnIndex !== -1 && cardIndex !== -1) {
          const overId = getOverId(columns[columnIndex], cardIndex);
          onDragEnd(cardId, overId);
        } else {
          // If we somehow can't find the card, just call onDragEnd with cardId.
          onDragEnd(cardId);
        }

        originalCardPositionReference.current = null;
      } else if (key === "Escape") {
        event.preventDefault();

        // Cancel the drag.
        if (originalCardPositionReference.current) {
          const { columnId, cardIndex } = originalCardPositionReference.current;
          const {
            columnIndex: currentColumnIndex,
            cardIndex: currentCardIndex,
          } = findCardPosition(cardId);

          // Revert card only if it moved.
          if (
            currentColumnIndex !== -1 &&
            (columnId !== columns[currentColumnIndex].id ||
              cardIndex !== currentCardIndex)
          ) {
            const card = columns[currentColumnIndex].items[currentCardIndex];
            flushSync(() => {
              handleMoveCardToColumn(columnId, cardIndex, card);
            });
          }
        }

        onDragCancel(cardId);
        originalCardPositionReference.current = null;

        setActiveCardId("");
      } else if (
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowUp" ||
        key === "ArrowDown"
      ) {
        event.preventDefault();
        moveActiveCard(cardId, key);
        // onDragOver is called inside moveActiveCard after placement.
      }
    }
  }

  function handleCardBlur() {
    setActiveCardId("");
  }

  const jsLoaded = useJsLoaded();

  return (
    <KanbanBoard ref={scrollContainerReference}>
      {columns.map((column) =>
        jsLoaded ? (
          <MyKanbanBoardColumn
            activeCardId={activeCardId}
            column={column}
            key={column.id}
            onAddCard={handleAddCard}
            onCardBlur={handleCardBlur}
            onCardKeyDown={handleCardKeyDown}
            onDeleteCard={handleDeleteCard}
            onDeleteColumn={handleDeleteColumn}
            onMoveCardToColumn={handleMoveCardToColumn}
            onUpdateCard={handleUpdateCard}
            onUpdateCardTitle={handleUpdateCardTitle}
            onUpdateColumnTitle={handleUpdateColumnTitle}
          />
        ) : (
          <KanbanBoardColumnSkeleton key={column.id} />
        )
      )}

      {/* Add a new column */}
      {jsLoaded ? (
        <MyNewKanbanBoardColumn onAddColumn={handleAddColumn} />
      ) : (
        <Skeleton className="h-9 w-10.5 flex-shrink-0" />
      )}

      <KanbanBoardExtraMargin />
    </KanbanBoard>
  );
}

function MyKanbanBoardColumn({
  activeCardId,
  column,
  onAddCard,
  onCardBlur,
  onCardKeyDown,
  onDeleteCard,
  onDeleteColumn,
  onMoveCardToColumn,
  onUpdateCard,
  onUpdateCardTitle,
  onUpdateColumnTitle,
}: {
  activeCardId: string;
  column: Column;
  onAddCard: (columnId: string, cardContent: string) => void;
  onCardBlur: () => void;
  onCardKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveCardToColumn: (columnId: string, index: number, card: Card) => void;
  onUpdateCard: (cardId: string, updatedCard: Partial<Card>) => void;
  onUpdateCardTitle: (cardId: string, cardTitle: string) => void;
  onUpdateColumnTitle: (columnId: string, columnTitle: string) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const listReference = useRef<HTMLUListElement>(null);
  const moreOptionsButtonReference = useRef<HTMLButtonElement>(null);
  const { onDragCancel, onDragEnd } = useDndEvents();

  function scrollList() {
    if (listReference.current) {
      listReference.current.scrollTop = listReference.current.scrollHeight;
    }
  }

  function closeDropdownMenu() {
    flushSync(() => {
      setIsEditingTitle(false);
    });

    moreOptionsButtonReference.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const columnTitle = formData.get("columnTitle") as string;
    onUpdateColumnTitle(column.id, columnTitle);
    closeDropdownMenu();
  }

  function handleDropOverColumn(dataTransferData: string) {
    const card = JSON.parse(dataTransferData) as Card;
    onMoveCardToColumn(column.id, 0, card);
  }

  function handleDropOverListItem(cardId: string) {
    return (
      dataTransferData: string,
      dropDirection: KanbanBoardDropDirection
    ) => {
      const card = JSON.parse(dataTransferData) as Card;
      const cardIndex = column.items.findIndex(({ id }) => id === cardId);
      const currentCardIndex = column.items.findIndex(
        ({ id }) => id === card.id
      );

      const baseIndex = dropDirection === "top" ? cardIndex : cardIndex + 1;
      const targetIndex =
        currentCardIndex !== -1 && currentCardIndex < baseIndex
          ? baseIndex - 1
          : baseIndex;

      // Safety check to ensure targetIndex is within bounds
      const safeTargetIndex = Math.max(
        0,
        Math.min(targetIndex, column.items.length)
      );
      const overCard = column.items[safeTargetIndex];

      if (card.id === overCard?.id) {
        onDragCancel(card.id);
      } else {
        onMoveCardToColumn(column.id, safeTargetIndex, card);
        onDragEnd(card.id, overCard?.id || column.id);
      }
    };
  }

  return (
    <KanbanBoardColumn
      columnId={column.id}
      key={column.id}
      onDropOverColumn={handleDropOverColumn}
    >
      <KanbanBoardColumnHeader>
        {isEditingTitle ? (
          <form
            className="w-full"
            onSubmit={handleSubmit}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                closeDropdownMenu();
              }
            }}
          >
            <Input
              aria-label="Column title"
              autoFocus
              defaultValue={column.title}
              name="columnTitle"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeDropdownMenu();
                }
              }}
              required
            />
          </form>
        ) : (
          <>
            <KanbanBoardColumnTitle columnId={column.id}>
              <KanbanColorCircle color={column.color} />
              {column.title}
            </KanbanBoardColumnTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  title="More options"
                  ref={moreOptionsButtonReference}
                >
                  <MoreHorizontalIcon />

                  <span className="sr-only">
                    More options for {column.title}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent sideOffset={8} alignOffset={-4} align="end">
                <DropdownMenuLabel>Column</DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    <PenIcon />
                    Edit Details
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDeleteColumn(column.id)}
                  >
                    <Trash2Icon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </KanbanBoardColumnHeader>

      <KanbanBoardColumnList ref={listReference}>
        {column.items.map((card) => (
          <KanbanBoardColumnListItem
            cardId={card.id}
            key={card.id}
            onDropOverListItem={handleDropOverListItem(card.id)}
          >
            <MyKanbanBoardCard
              card={card}
              isActive={activeCardId === card.id}
              onCardBlur={onCardBlur}
              onCardKeyDown={onCardKeyDown}
              onDeleteCard={onDeleteCard}
              onUpdateCard={onUpdateCard}
              onUpdateCardTitle={onUpdateCardTitle}
            />
          </KanbanBoardColumnListItem>
        ))}
      </KanbanBoardColumnList>

      <MyNewKanbanBoardCard
        column={column}
        onAddCard={onAddCard}
        scrollList={scrollList}
      />
    </KanbanBoardColumn>
  );
}

function MyKanbanBoardCard({
  card,
  isActive,
  onCardBlur,
  onCardKeyDown,
  onDeleteCard,
  onUpdateCard,
  onUpdateCardTitle,
}: {
  card: Card;
  isActive: boolean;
  onCardBlur: () => void;
  onCardKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    cardId: string
  ) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, updatedCard: Partial<Card>) => void;
  onUpdateCardTitle: (cardId: string, cardTitle: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingCard, setEditingCard] = useState<Card>(card);
  const [newCommentText, setNewCommentText] = useState("");
  const kanbanBoardCardReference = useRef<HTMLButtonElement>(null);
  const previousIsActiveReference = useRef(isActive);
  const wasCancelledReference = useRef(false);

  useEffect(() => {
    setEditingCard(card);
  }, [card]);

  useEffect(() => {
    if (isActive && !isEditingTitle) {
      kanbanBoardCardReference.current?.focus();
    }

    if (
      !isActive &&
      previousIsActiveReference.current &&
      wasCancelledReference.current
    ) {
      kanbanBoardCardReference.current?.focus();
      wasCancelledReference.current = false;
    }

    previousIsActiveReference.current = isActive;
  }, [isActive, isEditingTitle]);

  const getPriorityColor = (priority?: CardPriority) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)} days overdue`,
        variant: "destructive" as const,
      };
    } else if (diffDays === 0) {
      return { text: "Due today", variant: "destructive" as const };
    } else if (diffDays === 1) {
      return { text: "Due tomorrow", variant: "secondary" as const };
    } else {
      return { text: `Due in ${diffDays} days`, variant: "outline" as const };
    }
  };

  function handleCardClick() {
    if (!isActive) {
      setIsModalOpen(true);
    }
  }

  function handleSaveCard() {
    onUpdateCard(card.id, editingCard);
    setIsModalOpen(false);
    setNewCommentText("");
    toast.success("Card updated successfully!");
  }

  function handleAddComment() {
    if (newCommentText.trim()) {
      const newComment: Comment = {
        id: createId(),
        text: newCommentText.trim(),
        author: "Current User", // In a real app, this would come from authentication
        createdAt: new Date().toISOString(),
      };

      setEditingCard({
        ...editingCard,
        comments: [...(editingCard.comments || []), newComment],
      });
      setNewCommentText("");
    }
  }

  function handleTitleEdit() {
    setIsEditingTitle(true);
    setIsModalOpen(false);
  }

  function handleBlur() {
    flushSync(() => {
      setIsEditingTitle(false);
    });
    kanbanBoardCardReference.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const cardTitle = formData.get("cardTitle") as string;
    onUpdateCardTitle(card.id, cardTitle);
    handleBlur();
  }

  const dueDateInfo = formatDueDate(card.dueDate);

  return (
    <>
      {isEditingTitle ? (
        <form onBlur={handleBlur} onSubmit={handleSubmit}>
          <KanbanBoardCardTextarea
            aria-label="Edit card title"
            autoFocus
            defaultValue={card.title}
            name="cardTitle"
            onFocus={(event) => event.target.select()}
            onInput={(event) => {
              const input = event.currentTarget as HTMLTextAreaElement;
              if (/\S/.test(input.value)) {
                input.setCustomValidity("");
              } else {
                input.setCustomValidity(
                  "Card content cannot be empty or just whitespace."
                );
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
              if (event.key === "Escape") {
                handleBlur();
              }
            }}
            placeholder="Edit card title ..."
            required
          />
        </form>
      ) : (
        <>
          <KanbanBoardCard
            data={card}
            isActive={isActive}
            onBlur={onCardBlur}
            onClick={handleCardClick}
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.preventDefault();
              }
              if (event.key === "Escape") {
                wasCancelledReference.current = true;
              }
              onCardKeyDown(event, card.id);
            }}
            ref={kanbanBoardCardReference}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium leading-tight pr-2">
                  {card.title}
                </h3>
                <KanbanBoardCardButtonGroup disabled={isActive}>
                  <KanbanBoardCardButton
                    onClick={handleTitleEdit}
                    tooltip="Quick edit title"
                  >
                    <EditIcon className="h-3 w-3" />
                    <span className="sr-only">Edit title</span>
                  </KanbanBoardCardButton>
                  <KanbanBoardCardButton
                    className="text-destructive"
                    onClick={() => onDeleteCard(card.id)}
                    tooltip="Delete card"
                  >
                    <Trash2Icon className="h-3 w-3" />
                    <span className="sr-only">Delete card</span>
                  </KanbanBoardCardButton>
                </KanbanBoardCardButtonGroup>
              </div>

              {card.description && (
                <p
                  className="text-xs text-muted-foreground overflow-hidden text-ellipsis line-clamp-2"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {card.description}
                </p>
              )}

              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-1 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {card.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{card.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  {card.priority && (
                    <Badge
                      variant={getPriorityColor(card.priority)}
                      className="text-xs px-1 py-0"
                    >
                      {card.priority}
                    </Badge>
                  )}

                  {dueDateInfo && (
                    <Badge
                      variant={dueDateInfo.variant}
                      className="text-xs px-1 py-0 flex items-center gap-1"
                    >
                      <ClockIcon className="h-2.5 w-2.5" />
                      {dueDateInfo.text}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {card.assignee && (
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      <span className="truncate max-w-16" title={card.assignee}>
                        {card.assignee.split(" ")[0]}
                      </span>
                    </div>
                  )}

                  {card.comments && card.comments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquareIcon className="h-3 w-3" />
                      <span>{card.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </KanbanBoardCard>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] p-0">
              <ScrollArea className="max-h-[90vh] w-full p-6 ">
                <DialogHeader className="mb-4">
                  <DialogTitle>Edit Card</DialogTitle>
                  <DialogDescription>
                    Update the card details and properties.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingCard.title}
                      onChange={(e) =>
                        setEditingCard({
                          ...editingCard,
                          title: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingCard.description || ""}
                      onChange={(e) =>
                        setEditingCard({
                          ...editingCard,
                          description: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={3}
                      placeholder="Add a description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={editingCard.priority || ""}
                        onChange={(e) =>
                          setEditingCard({
                            ...editingCard,
                            priority: e.target.value as CardPriority,
                          })
                        }
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">No priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={editingCard.dueDate || ""}
                        onChange={(e) =>
                          setEditingCard({
                            ...editingCard,
                            dueDate: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assignee">Assignee</Label>
                    <Input
                      id="assignee"
                      value={editingCard.assignee || ""}
                      onChange={(e) =>
                        setEditingCard({
                          ...editingCard,
                          assignee: e.target.value,
                        })
                      }
                      className="mt-1"
                      placeholder="Enter assignee name..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editingCard.tags?.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-2 py-1 flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => {
                                const newTags = editingCard.tags?.filter(
                                  (_, i) => i !== index
                                );
                                setEditingCard({
                                  ...editingCard,
                                  tags: newTags,
                                });
                              }}
                              className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-sm w-3 h-3 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        id="tags"
                        placeholder="Type a tag and press Enter..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Tab") {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (value && !editingCard.tags?.includes(value)) {
                              setEditingCard({
                                ...editingCard,
                                tags: [...(editingCard.tags || []), value],
                              });
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>
                      Comments ({editingCard.comments?.length || 0})
                    </Label>
                    <div className="mt-1 space-y-3 max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/20">
                      {editingCard.comments &&
                      editingCard.comments.length > 0 ? (
                        editingCard.comments.map((comment) => (
                          <div key={comment.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {comment.author}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}{" "}
                                {new Date(comment.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No comments yet
                        </p>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        rows={2}
                      />
                      <Button
                        onClick={handleAddComment}
                        size="sm"
                        disabled={!newCommentText.trim()}
                        className="w-full"
                      >
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCard}>Save Changes</Button>
                </DialogFooter>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

function MyNewKanbanBoardCard({
  column,
  onAddCard,
  scrollList,
}: {
  column: Column;
  onAddCard: (columnId: string, cardContent: string) => void;
  scrollList: () => void;
}) {
  const [cardContent, setCardContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState<Partial<Card>>({
    title: "",
    description: "",
    tags: [],
    priority: undefined,
    dueDate: "",
    assignee: "",
    comments: [],
  });
  const newCardButtonReference = useRef<HTMLButtonElement>(null);
  const submitButtonReference = useRef<HTMLButtonElement>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  function handleAddCardClick() {
    setIsModalOpen(true);
  }

  function handleQuickAddClick() {
    flushSync(() => {
      setShowNewCardForm(true);
    });
    scrollList();
  }

  function handleCancelClick() {
    flushSync(() => {
      setShowNewCardForm(false);
      setCardContent("");
    });
    newCardButtonReference.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setCardContent(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    flushSync(() => {
      onAddCard(column.id, cardContent.trim());
      setCardContent("");
    });
    scrollList();
  }

  function handleSaveNewCard() {
    if (newCard.title?.trim()) {
      // For now, just create a simple card - the full implementation would require updating the parent component
      onAddCard(column.id, newCard.title.trim());

      // Reset form
      setNewCard({
        title: "",
        description: "",
        tags: [],
        priority: undefined,
        dueDate: "",
        assignee: "",
        comments: [],
      });
      setIsModalOpen(false);
      scrollList();
    }
  }

  return showNewCardForm ? (
    <>
      <form
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            handleCancelClick();
          }
        }}
        onSubmit={handleSubmit}
      >
        <div className={kanbanBoardColumnListItemClassNames}>
          <KanbanBoardCardTextarea
            aria-label="New card content"
            autoFocus
            name="cardContent"
            onChange={handleInputChange}
            onInput={(event) => {
              const input = event.currentTarget as HTMLTextAreaElement;
              if (/\S/.test(input.value)) {
                input.setCustomValidity("");
              } else {
                input.setCustomValidity(
                  "Card content cannot be empty or just whitespace."
                );
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitButtonReference.current?.click();
              }
              if (event.key === "Escape") {
                handleCancelClick();
              }
            }}
            placeholder="New card title ..."
            required
            value={cardContent}
          />
        </div>

        <KanbanBoardColumnFooter>
          <Button ref={submitButtonReference} size="sm" type="submit">
            Add
          </Button>
          <Button
            onClick={handleCancelClick}
            size="sm"
            variant="outline"
            type="button"
          >
            Cancel
          </Button>
        </KanbanBoardColumnFooter>
      </form>
    </>
  ) : (
    <>
      <KanbanBoardColumnFooter>
        <div className="flex gap-2 w-full">
          <KanbanBoardColumnButton
            onClick={handleQuickAddClick}
            ref={newCardButtonReference}
            className="flex-1"
          >
            <PlusIcon />
            <span>Quick Add</span>
            <span className="sr-only">Add new card to {column.title}</span>
          </KanbanBoardColumnButton>

          <Button
            onClick={handleAddCardClick}
            size="sm"
            variant="outline"
            className="px-2"
          >
            <PenIcon className="h-4 w-4" />
            <span className="sr-only">Add detailed card to {column.title}</span>
          </Button>
        </div>
      </KanbanBoardColumnFooter>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>
              Add a new card with detailed information to {column.title}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="new-title">Title *</Label>
              <Input
                id="new-title"
                value={newCard.title || ""}
                onChange={(e) =>
                  setNewCard({ ...newCard, title: e.target.value })
                }
                className="mt-1"
                placeholder="Enter card title..."
              />
            </div>

            <div>
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newCard.description || ""}
                onChange={(e) =>
                  setNewCard({ ...newCard, description: e.target.value })
                }
                className="mt-1"
                rows={3}
                placeholder="Add a description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-priority">Priority</Label>
                <select
                  id="new-priority"
                  value={newCard.priority || ""}
                  onChange={(e) =>
                    setNewCard({
                      ...newCard,
                      priority: e.target.value as CardPriority,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <Label htmlFor="new-dueDate">Due Date</Label>
                <Input
                  id="new-dueDate"
                  type="date"
                  value={newCard.dueDate || ""}
                  onChange={(e) =>
                    setNewCard({ ...newCard, dueDate: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="new-assignee">Assignee</Label>
              <Input
                id="new-assignee"
                value={newCard.assignee || ""}
                onChange={(e) =>
                  setNewCard({ ...newCard, assignee: e.target.value })
                }
                className="mt-1"
                placeholder="Enter assignee name..."
              />
            </div>

            <div>
              <Label htmlFor="new-tags">Tags</Label>
              <div className="mt-1">
                <div className="flex flex-wrap gap-1 mb-2">
                  {newCard.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs px-2 py-1 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = newCard.tags?.filter(
                            (_, i) => i !== index
                          );
                          setNewCard({ ...newCard, tags: newTags });
                        }}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-sm w-3 h-3 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  id="new-tags"
                  placeholder="Type a tag and press Enter..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Tab") {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value && !newCard.tags?.includes(value)) {
                        setNewCard({
                          ...newCard,
                          tags: [...(newCard.tags || []), value],
                        });
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewCard}
              disabled={!newCard.title?.trim()}
            >
              Create Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MyNewKanbanBoardColumn({
  onAddColumn,
}: {
  onAddColumn: (columnTitle?: string) => void;
}) {
  const [showEditor, setShowEditor] = useState(false);
  const newColumnButtonReference = useRef<HTMLButtonElement>(null);
  const inputReference = useRef<HTMLInputElement>(null);

  function handleAddColumnClick() {
    flushSync(() => {
      setShowEditor(true);
    });

    onAddColumn();
  }

  function handleCancelClick() {
    flushSync(() => {
      setShowEditor(false);
    });

    newColumnButtonReference.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const columnTitle = formData.get("columnTitle") as string;
    onAddColumn(columnTitle);
    if (inputReference.current) {
      inputReference.current.value = "";
    }
  }

  return showEditor ? (
    <form
      className={kanbanBoardColumnClassNames}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          handleCancelClick();
        }
      }}
      onSubmit={handleSubmit}
    >
      <KanbanBoardColumnHeader>
        <Input
          aria-label="Column title"
          autoFocus
          name="columnTitle"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              handleCancelClick();
            }
          }}
          placeholder="New column title ..."
          ref={inputReference}
          required
        />
      </KanbanBoardColumnHeader>

      <KanbanBoardColumnFooter>
        <Button size="sm" type="submit">
          Add
        </Button>

        <Button
          onClick={handleCancelClick}
          size="sm"
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
      </KanbanBoardColumnFooter>
    </form>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleAddColumnClick}
          ref={newColumnButtonReference}
          variant="outline"
        >
          <PlusIcon />

          <span className="sr-only">Add column</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent>Add a new column to the board</TooltipContent>
    </Tooltip>
  );
}
