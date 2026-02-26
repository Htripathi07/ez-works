import { useState } from "react";
import TreeView from "./components/tree/TreeView";
import KanbanBoard from "./components/kanban/KanbanBoard";

export default function App() {
  const [tab, setTab] = useState<"tree" | "kanban">("kanban");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 100%)",
        padding: "24px 16px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1E293B",
                margin: 0,
              }}
            >
              Task Management UI
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#94A3B8",
                margin: "2px 0 0",
              }}
            >
              React · TypeScript · HTML5 Drag & Drop
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "#fff",
              padding: 4,
              borderRadius: 12,
              boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
            }}
          >
            {(["kanban", "tree"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 9,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: tab === t ? "#1E293B" : "transparent",
                  color: tab === t ? "#fff" : "#64748B",
                  transition: "all 0.2s",
                }}
              >
                {t === "kanban" ? "🗂 Kanban" : "🌳 Tree View"}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div key={tab} style={{ animation: "slideDown 0.25s ease" }}>
          {tab === "kanban" ? <KanbanBoard /> : <TreeView />}
        </div>
      </div>
    </div>
  );
}