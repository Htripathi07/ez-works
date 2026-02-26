export interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  loaded?: boolean;
  expanded?: boolean;
  isLoading?: boolean;
}