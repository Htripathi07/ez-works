import { useState, useRef, useEffect } from "react";
import { initColumns } from "../../data/mockKanban";
import type { Column } from "./types";
import { uid } from "../../utils/uid";

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initColumns);
  const [addingColId, setAddingColId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [hoverColId, setHoverColId] = useState<string | null>(null);

  const dragRef = useRef<{ colId: string; cardId: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingColId) inputRef.current?.focus();
  }, [addingColId]);

  // Add card
  const addCard = (colId: string, title: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === colId
          ? { ...col, cards: [...col.cards, { id: uid(), title }] }
          : col
      )
    );
  };

  const commit = () => {
    if (addingColId && newTitle.trim()) {
      addCard(addingColId, newTitle.trim());
    }
    setNewTitle("");
    setAddingColId(null);
  };

  // Drag start
  const handleDragStart = (
    e: React.DragEvent,
    colId: string,
    cardId: string
  ) => {
    dragRef.current = { colId, cardId };
    setDraggingCardId(cardId);
    e.dataTransfer.effectAllowed = "move";
  };

  // Drop logic
  const handleDrop = (
    e: React.DragEvent,
    targetColId: string,
    targetCardId?: string
  ) => {
    e.preventDefault();
    if (!dragRef.current) return;

    const { colId: sourceColId, cardId: sourceCardId } = dragRef.current;

    setColumns((cols) => {
      let draggedCard;

      // Remove from source
      const updatedCols = cols.map((col) => {
        if (col.id === sourceColId) {
          draggedCard = col.cards.find((c) => c.id === sourceCardId);
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== sourceCardId),
          };
        }
        return col;
      });

      if (!draggedCard) return cols;

      // Add to target
      return updatedCols.map((col) => {
        if (col.id !== targetColId) return col;

        if (targetCardId) {
          const index = col.cards.findIndex((c) => c.id === targetCardId);
          const newCards = [...col.cards];
          newCards.splice(index, 0, draggedCard!);
          return { ...col, cards: newCards };
        }

        return { ...col, cards: [...col.cards, draggedCard!] };
      });
    });

    setDraggingCardId(null);
    setHoverColId(null);
    dragRef.current = null;
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      {columns.map((col) => (
        <div
          key={col.id}
          style={{
            flex: "1 1 0",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            minWidth: 260,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: col.color,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {col.title}
              </span>

              <span
                style={{
                  background: "rgba(255,255,255,0.3)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: "1px 8px",
                }}
              >
                {col.cards.length}
              </span>
            </div>

            <button
              onClick={() => setAddingColId(col.id)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              ＋
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              background: "#F4F6F9",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 200,
              transition: "all 0.2s",
              outline:
                hoverColId === col.id
                  ? `2px dashed ${col.color}`
                  : "2px dashed transparent",
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setHoverColId(col.id);
            }}
            onDragLeave={() => setHoverColId(null)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Add Input */}
            {addingColId === col.id && (
              <input
                ref={inputRef}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") {
                    setAddingColId(null);
                    setNewTitle("");
                  }
                }}
                placeholder="Enter task title..."
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid #CBD5E1",
                  outline: "none",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            )}

            {col.cards.map((card) => {
              const isDragging = draggingCardId === card.id;

              return (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, col.id, card.id)
                  }
                  onDragEnd={() => setDraggingCardId(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    handleDrop(e, col.id, card.id)
                  }
                  style={{
                    background: "#fff",
                    borderLeft: `4px solid ${col.color}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#1F2937",
                    cursor: isDragging ? "grabbing" : "grab",
                    transition: "all 0.2s ease",
                    transform: isDragging
                      ? "rotate(2deg) scale(1.05)"
                      : "none",
                    boxShadow: isDragging
                      ? "0 15px 35px rgba(0,0,0,0.25)"
                      : "0 1px 4px rgba(0,0,0,0.05)",
                    opacity: isDragging ? 0.85 : 1,
                  }}
                >
                  {card.title}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}