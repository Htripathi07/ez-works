import { useState, useRef, useEffect } from "react";
import type { Column } from "./types";
import KanbanCard from "./KanbanCard";

interface Props {
  col: Column;
  onAddCard: (colId: string, title: string) => void;
  onDeleteCard: (colId: string, cardId: string) => void;
  onRenameCard: (colId: string, cardId: string, title: string) => void;
  onDragStart: (e: React.DragEvent, colId: string, cardId: string) => void;
  onDrop: (e: React.DragEvent, colId: string, cardId?: string) => void;
}

export default function KanbanColumn({
  col,
  onAddCard,
  onDeleteCard,
  onRenameCard,
  onDragStart,
  onDrop,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const commit = () => {
    if (newTitle.trim()) {
      onAddCard(col.id, newTitle.trim());
      setNewTitle("");
    }
    setAdding(false);
  };

  return (
    <div
      style={{
        flex: "1 1 0",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        minWidth: 260,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, col.id)}
    >
      {/* Header */}
      <div
        style={{
          background: col.color,
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontWeight: 700, color: "#fff" }}>
            {col.title}
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.3)",
              padding: "1px 8px",
              borderRadius: 6,
              color: "#fff",
              fontSize: 12,
            }}
          >
            {col.cards.length}
          </span>
        </div>

        <button
          onClick={() => setAdding(true)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(255,255,255,0.25)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
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
        }}
      >
        {adding && (
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Enter card title..."
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #CBD5E1",
              outline: "none",
            }}
          />
        )}

        {col.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            colId={col.id}
            accentColor={col.color}
            onDelete={onDeleteCard}
            onRename={onRenameCard}
            onDragStart={onDragStart}
            onDrop={(e, cid, cardId) =>
              onDrop(e, cid, cardId)
            }
          />
        ))}
      </div>
    </div>
  );
}