import { useState } from "react";
import { initTree, fetchChildren } from "../../data/mockTree";
import type { TreeNode  } from "./types";
import TreeNodeItem from "./TreeNodeItem";
import { addChild, deleteNode, updateNode } from "./treeHelpers";
import { uid } from "../../utils/uid";

export default function TreeView() {
  const [nodes, setNodes] = useState<TreeNode[]>(initTree);

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

  return (
  <div
    style={{
      background: "#F8FAFC",
      borderRadius: 16,
      border: "1px solid #E2E8F0",
      padding: 24,
      maxWidth: 520,
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      transition: "all 0.2s ease",
    }}
  >
    {/* Header / Info */}
    <p
      style={{
        fontSize: 12,
        color: "#94A3B8",
        marginBottom: 20,
      }}
    >
      💡 Click badge to expand · Double-click name to rename
    </p>

    {/* Tree Nodes */}
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

    {/* Add Root Button */}
    <button
      onClick={() =>
        setNodes((ns) => [
          ...ns,
          { id: uid(), name: "New Node", children: [], loaded: true },
        ])
      }
      style={{
        marginTop: 8,
        fontSize: 13,
        color: "#64748B",
        background: "none",
        border: "2px dashed #CBD5E1",
        borderRadius: 10,
        padding: "8px 16px",
        cursor: "pointer",
        width: "100%",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.borderColor = "#4A90D9";
        (e.target as HTMLElement).style.color = "#4A90D9";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.borderColor = "#CBD5E1";
        (e.target as HTMLElement).style.color = "#64748B";
      }}
    >
      ＋ Add root node
    </button>
  </div>
);
}