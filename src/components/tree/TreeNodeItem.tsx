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

  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const childInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (addingChild) childInputRef.current?.focus();
  }, [addingChild]);

  const INDENT = 28;

  const commitRename = () => {
    if (value.trim()) {
      onRename(node.id, value.trim());
    }
    setEditing(false);
  };

  const commitAddChild = () => {
    if (!newChildName.trim()) {
      setError("Node name cannot be empty");
      return;
    }

    onAdd(node.id, newChildName.trim());
    setNewChildName("");
    setAddingChild(false);
    setError("");
  };

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: depth * INDENT,
          gap: 8,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Expand / Collapse Toggle */}
        <button
          onClick={() => onToggle(node.id)}
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            border: "none",
            background: "#E2E8F0",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          {node.expanded ? "−" : "+"}
        </button>

        {/* Node Card */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 10,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: hovered
              ? "0 6px 20px rgba(0,0,0,0.08)"
              : "0 2px 6px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
          }}
        >
          {editing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setEditing(false);
              }}
              style={{
                border: "1px solid #CBD5E1",
                borderRadius: 6,
                padding: "4px 8px",
                outline: "none",
                flex: 1,
                fontSize: 14,
              }}
            />
          ) : (
            <span
              onDoubleClick={() => setEditing(true)}
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: 500,
                cursor: "text",
              }}
            >
              {node.name}
            </span>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 6,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            <button
              onClick={() => setAddingChild(true)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                background: "#DBEAFE",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              + Add
            </button>

            <button
              onClick={() => onDelete(node.id)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                background: "#FEE2E2",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Child Input UI Improved */}
      {addingChild && (
        <div
          style={{
            marginLeft: (depth + 1) * INDENT,
            marginTop: 8,
            background: "#F8FAFC",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxWidth: 320,
          }}
        >
          <input
            ref={childInputRef}
            value={newChildName}
            onChange={(e) => {
              setNewChildName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitAddChild();
              if (e.key === "Escape") {
                setAddingChild(false);
                setError("");
              }
            }}
            placeholder="Enter child node name..."
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: error
                ? "1px solid #EF4444"
                : "1px solid #CBD5E1",
              outline: "none",
              fontSize: 13,
            }}
          />

          {error && (
            <span style={{ color: "#EF4444", fontSize: 11 }}>
              {error}
            </span>
          )}

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={commitAddChild}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                background: "#4A90D9",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Add
            </button>

            <button
              onClick={() => setAddingChild(false)}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: "none",
                background: "#E2E8F0",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

{node.expanded && node.children.length > 0 && (
  <div
    style={{
      marginTop: 12, 
      display: "flex",
      flexDirection: "column",
      gap: 8,   
    }}
  >
    {node.children.map((child) => (
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
)}
    </div>
  );
}