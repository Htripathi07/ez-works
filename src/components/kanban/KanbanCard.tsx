import { useState, useRef, useEffect } from "react";
import type { Card } from "./types";

interface Props {
  card: Card;
  colId: string;
  accentColor: string;
  onDelete: (colId: string, cardId: string) => void;
  onRename: (colId: string, cardId: string, title: string) => void;
  onDragStart: (e: React.DragEvent, colId: string, cardId: string) => void;
  onDrop: (e: React.DragEvent, colId: string, cardId: string) => void;
}

export default function KanbanCard({
  card,
  colId,
  accentColor,
  onDelete,
  onRename,
  onDragStart,
  onDrop,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(card.title);
  const [hovered, setHovered] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    if (value.trim()) {
      onRename(colId, card.id, value.trim());
    } else {
      setValue(card.title);
    }
    setEditing(false);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, colId, card.id)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.stopPropagation();
        setDragOver(false);
        onDrop(e, colId, card.id);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1px solid ${dragOver ? accentColor : "#E8EDF2"}`,
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: 10,
        padding: "10px 12px",
        cursor: "grab",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        boxShadow: hovered
          ? "0 6px 20px rgba(0,0,0,0.10)"
          : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 0.2s",
        transform: dragOver
          ? "scale(1.02)"
          : hovered
          ? "translateY(-1px)"
          : "none",
      }}
    >
      <div style={{ flex: 1 }}>
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setValue(card.title);
                setEditing(false);
              }
            }}
            style={{
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
            }}
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#1F2937",
            }}
          >
            {card.title}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(colId, card.id)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: "#FEE2E2",
          border: "none",
          cursor: "pointer",
          fontSize: 10,
          color: "#EF4444",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        ✕
      </button>
    </div>
  );
}