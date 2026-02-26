import type { TreeNode } from "./types";

export function updateNode(
  nodes: TreeNode[],
  id: string,
  fn: (n: TreeNode) => TreeNode
): TreeNode[] {
  return nodes.map((n) =>
    n.id === id
      ? fn(n)
      : { ...n, children: updateNode(n.children, id, fn) }
  );
}

export function deleteNode(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({
      ...n,
      children: deleteNode(n.children, id),
    }));
}

export function addChild(
  nodes: TreeNode[],
  parentId: string,
  child: TreeNode
): TreeNode[] {
  return nodes.map((n) =>
    n.id === parentId
      ? { ...n, children: [...n.children, child], expanded: true }
      : { ...n, children: addChild(n.children, parentId, child) }
  );
}