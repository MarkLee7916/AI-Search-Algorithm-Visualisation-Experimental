import { assertDefined, sequenceBetween } from 'src/app/shared/genericUtils';

export const TREE_DEPTH = 4;

export const LEAF_COUNT = Math.pow(2, TREE_DEPTH);

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

export function flattenTreeToInorderList(node: Node): Node[] {
  return flattenTreeToInorderListRecurse(node, []);
}

export function buildBinaryTree(leafValues: number[]): Node {
  return buildBinaryTreeRecurse(0, [...leafValues], '');
}

export function isLeafNode(node: Node): boolean {
  return node.leftChild === null && node.rightChild === null;
}

export function isRootNode(node: Node): boolean {
  return node.depth === 0;
}

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
