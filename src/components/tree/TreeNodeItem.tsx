import { useState, useRef, useEffect } from "react";
import type { TreeNode } from "./types";

interface Props {
  node: TreeNode;
  depth: number;
  onToggle: (id: string) => void;
  onAdd: (pid: string, name: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

const LEVEL_COLORS = [
  { bg: "#4A90D9", letter: "A" },
  { bg: "#7ED957", letter: "B" },
  { bg: "#F5A623", letter: "C" },
  { bg: "#BD10E0", letter: "D" },
  { bg: "#E74C3C", letter: "E" },
];

export default function TreeNodeItem({
  node,
  depth,
  onToggle,
  onAdd,
  onDelete,
  onRename,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(node.name);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const lvl = LEVEL_COLORS[Math.min(depth, LEVEL_COLORS.length - 1)];
  const INDENT = 52;

  const commit = () => {
    if (value.trim()) onRename(node.id, value.trim());
    setEditing(false);
  };

  return (
    <div style={{ position: "relative", marginBottom: 10 }}>
      {/* connector lines */}
      {depth > 0 && (
        <>
          <div
            style={{
              position: "absolute",
              left: -INDENT + 20,
              top: 0,
              width: 1,
              height: "100%",
              borderLeft: "2px dashed #CBD5E1",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -INDENT + 20,
              top: 27,
              width: INDENT - 20,
              height: 1,
              borderTop: "2px dashed #CBD5E1",
            }}
          />
        </>
      )}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: depth * INDENT,
          transition: "all 0.2s ease",
        }}
      >
        {/* badge circle */}
        <div
          onClick={() => onToggle(node.id)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: lvl.bg,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: `0 3px 10px ${lvl.bg}66`,
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          {node.isLoading ? "..." : lvl.letter}
        </div>

        {/* card */}
        <div
          style={{
            marginLeft: 10,
            background: "#fff",
            border: "1px solid #E8EDF2",
            borderLeft: `3px solid ${lvl.bg}`,
            borderRadius: 10,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: hovered
              ? "0 4px 16px rgba(0,0,0,0.10)"
              : "0 1px 4px rgba(0,0,0,0.06)",
            flex: 1,
            minWidth: 0,
            transition: "all 0.2s ease",
          }}
        >
          {editing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              style={{
                fontSize: 14,
                outline: "none",
                border: "none",
                flex: 1,
                fontWeight: 500,
              }}
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              style={{
                fontSize: 14,
                color: "#1F2937",
                flex: 1,
                fontWeight: 500,
                cursor: "text",
                userSelect: "none",
              }}
            >
              {node.name}
            </span>
          )}

          {/* action buttons */}
          <div
            style={{
              display: "flex",
              gap: 4,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <button
              onClick={() => onAdd(node.id, "New Node")}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: `${lvl.bg}22`,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: lvl.bg,
                fontWeight: 700,
              }}
            >
              ＋
            </button>

            <button
              onClick={() => onDelete(node.id)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#FEE2E2",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                color: "#EF4444",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* children */}
      {node.expanded &&
        node.children.map((child) => (
          <TreeNodeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            onToggle={onToggle}
            onAdd={onAdd}
            onDelete={onDelete}
            onRename={onRename}
          />
        ))}
    </div>
  );
}