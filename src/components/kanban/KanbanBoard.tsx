import { useState } from "react";
import { initColumns } from "../../data/mockKanban";
import type { Column } from "./types";
import { uid } from "../../utils/uid";

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initColumns);

  const addCard = (colId: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === colId
          ? {
              ...col,
              cards: [...col.cards, { id: uid(), title: "New Task" }],
            }
          : col
      )
    );
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
          {/* Column Header */}
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
              onClick={() => addCard(col.id)}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ＋
            </button>
          </div>

          {/* Column Body */}
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
            {col.cards.map((card) => (
              <div
                key={card.id}
                style={{
                  background: "#fff",
                  borderLeft: `4px solid ${col.color}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1F2937",
                }}
              >
                {card.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}