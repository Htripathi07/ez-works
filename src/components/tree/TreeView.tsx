import { useState, useRef, useEffect } from "react";
import { initTree, fetchChildren } from "../../data/mockTree";
import type { TreeNode } from "./types";
import TreeNodeItem from "./TreeNodeItem";
import { addChild, deleteNode, updateNode } from "./treeHelpers";
import { uid } from "../../utils/uid";

export default function TreeView() {
  const [nodes, setNodes] = useState<TreeNode[]>(initTree);
  const [addingRoot, setAddingRoot] = useState(false);
  const [rootName, setRootName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingRoot) inputRef.current?.focus();
  }, [addingRoot]);

  const toggleNode = async (id: string) => {
    const findNode = (nodes: TreeNode[]): TreeNode | undefined => {
      for (const n of nodes) {
        if (n.id === id) return n;
        const found = findNode(n.children);
        if (found) return found;
      }
      return undefined;
    };

    const target = findNode(nodes);
    if (!target) return;

    if (!target.loaded) {
      const children = await fetchChildren(id);
      setNodes((ns) =>
        updateNode(ns, id, (n) => ({
          ...n,
          children,
          loaded: true,
          expanded: true,
        }))
      );
    } else {
      setNodes((ns) =>
        updateNode(ns, id, (n) => ({
          ...n,
          expanded: !n.expanded,
        }))
      );
    }
  };

  const handleAdd = (pid: string, name: string) =>
    setNodes((ns) =>
      addChild(ns, pid, { id: uid(), name, children: [], loaded: true })
    );

  const handleDelete = (id: string) =>
    setNodes((ns) => deleteNode(ns, id));

  const handleRename = (id: string, name: string) =>
    setNodes((ns) => updateNode(ns, id, (n) => ({ ...n, name })));

  const commitRoot = () => {
    if (rootName.trim()) {
      setNodes((ns) => [
        ...ns,
        { id: uid(), name: rootName.trim(), children: [], loaded: true },
      ]);
    }
    setRootName("");
    setAddingRoot(false);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        padding: "clamp(16px, 4vw, 32px)",
        background: "#F8FAFC",
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <p
        style={{
          fontSize: 13,
          color: "#94A3B8",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        💡 Click badge to expand · Double-click name to rename
      </p>

      {/* Tree Nodes */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        {nodes.map((node) => (
          <TreeNodeItem
            key={node.id}
            node={node}
            depth={0}
            onToggle={toggleNode}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>

      {/* Root Input / Button */}
      {addingRoot ? (
        <input
          ref={inputRef}
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          onBlur={commitRoot}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRoot();
            if (e.key === "Escape") {
              setAddingRoot(false);
              setRootName("");
            }
          }}
          placeholder="Enter root node name..."
          style={{
            marginTop: 24,
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #CBD5E1",
            outline: "none",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
      ) : (
        <button
          onClick={() => setAddingRoot(true)}
          style={{
            marginTop: 24,
            fontSize: 14,
            color: "#64748B",
            background: "none",
            border: "2px dashed #CBD5E1",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "#4A90D9";
            el.style.color = "#4A90D9";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "#CBD5E1";
            el.style.color = "#64748B";
          }}
        >
          ＋ Add root node
        </button>
      )}
    </div>
  );
}