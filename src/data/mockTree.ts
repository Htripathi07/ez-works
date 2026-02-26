import type { TreeNode } from "../components/tree/types";

export const initTree: TreeNode[] = [
  {
    id: "1",
    name: "Full Stack Development",
    loaded: true,
    expanded: true,
    children: [
      { id: "1-1", name: "Frontend", loaded: false, expanded: false, children: [] },
      { id: "1-2", name: "Backend", loaded: false, expanded: false, children: [] },
    ],
  },
];

export async function fetchChildren(id: string): Promise<TreeNode[]> {
  await new Promise((r) => setTimeout(r, 500));

  if (id === "1-1") {
    return [
      { id: "1-1-1", name: "React", loaded: true, children: [] },
      { id: "1-1-2", name: "TypeScript", loaded: true, children: [] },
    ];
  }

  if (id === "1-2") {
    return [
      { id: "1-2-1", name: "Node.js", loaded: true, children: [] },
      { id: "1-2-2", name: "Database", loaded: true, children: [] },
    ];
  }

  return [];
}