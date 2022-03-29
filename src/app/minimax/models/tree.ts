import { assertDefined, sequenceBetween } from 'src/app/shared/genericUtils';

// The depth of the tree
export const TREE_DEPTH = 4;

// The number of leaves of the tree
export const LEAF_COUNT = Math.pow(2, TREE_DEPTH);

// A node worked on by the internal minimax algorithm
export type Node = {
  alpha: number | null;
  beta: number | null;
  val: number | null;
  hasBeenConsidered: boolean;
  leftChild: Node | null;
  rightChild: Node | null;
  chosenChild: Node | null;
  depth: number;
  id: string;
};

// Wrapper to generate Node objects
export function genDefaultNode(id: string, depth: number): Node {
  return {
    alpha: null,
    beta: null,
    val: null,
    hasBeenConsidered: false,
    leftChild: null,
    rightChild: null,
    chosenChild: null,
    depth,
    id,
  };
}

// Convert a tree to an inorder list, preserving its structure, useful for testing
export function flattenTreeToInorderList(node: Node): Node[] {
  return flattenTreeToInorderListRecurse(node, []);
}

// Build a full binary tree from a list of leaf values
export function buildBinaryTree(leafValues: number[]): Node {
  return buildBinaryTreeRecurse(0, [...leafValues], '');
}

// Return true if a node has no children
export function isLeafNode(node: Node): boolean {
  return node.leftChild === null && node.rightChild === null;
}

// Return true if a node has no parents
export function isRootNode(node: Node): boolean {
  return node.depth === 0;
}

// Recursive implementation of flattenTreeToInorderList()
function flattenTreeToInorderListRecurse(node: Node, list: Node[]): Node[] {
  if (node.leftChild !== null) {
    flattenTreeToInorderListRecurse(node.leftChild, list);
  }

  list.push(node);

  if (node.rightChild !== null) {
    flattenTreeToInorderListRecurse(node.rightChild, list);
  }

  return list;
}

// Recursive implementation of buildBinaryTree()
function buildBinaryTreeRecurse(
  depth: number,
  leafValues: number[],
  id: string
): Node {
  const node = genDefaultNode(id, depth);

  if (depth === TREE_DEPTH) {
    node.val = assertDefined(leafValues.shift());
  } else {
    node.leftChild = buildBinaryTreeRecurse(depth + 1, leafValues, id + 'l');
    node.rightChild = buildBinaryTreeRecurse(depth + 1, leafValues, id + 'r');
  }

  return node;
}
