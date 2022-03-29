import { Node } from './tree';

// Specifies which piece of data on a node should be hidden
export const enum DataHiddenForUserGuess {
  None,
  Alpha,
  Beta,
  Val,
}

// An animation frame for a tree, including SVG data
export type SVGTreeAnimationFrame = {
  tree: SVGTree;
  currNodeId: string | null;
  optimalPathIds: string[];
  commentary: string;
};

export type SVGTree = {
  nodes: SVGNode[];
  edges: SVGEdge[];
};

export type SVGEdge = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export type SVGNode = {
  centerX: number;
  centerY: number;
  internalNode: Node;
  dataHiddenForUserGuess: DataHiddenForUserGuess;
};

export type TreeAnimationFrame = {
  rootNode: Node;
  currNodeId: string | null;
  optimalPathIds: string[];
  commentary: string;
};

export const SVG_HEIGHT = 300;

export const SVG_WIDTH = 1200;

export const SVG_NODE_RADIUS = 5;

export const SVG_TRANSFORM_SCALE = window.innerHeight / 700;

const SVG_INITIAL_X_STEP = 280;

const SVG_Y_STEP = 60;

export function treeAnimationFrameToSVGAnimationframe({
  rootNode,
  currNodeId,
  optimalPathIds,
  commentary,
}: TreeAnimationFrame): SVGTreeAnimationFrame {
  return {
    tree: treeToTreeSVG(rootNode, SVG_WIDTH, SVG_INITIAL_X_STEP, SVG_Y_STEP),
    currNodeId,
    optimalPathIds,
    commentary,
  };
}

export function treeToTreeSVG(
  rootNode: Node,
  width: number,
  xStep: number,
  yStep: number
): SVGTree {
  const treeSVG = {
    edges: [],
    nodes: [],
  };

  genTreeSVGFromTreeRecurse(
    rootNode,
    width / 2,
    yStep / 5,
    xStep,
    yStep,
    treeSVG
  );

  return treeSVG;
}

export function genTreeAnimationFrame(
  rootNode: Node,
  currNodeId: string | null,
  commentary: string
): TreeAnimationFrame {
  return {
    rootNode,
    currNodeId,
    optimalPathIds: genNodeIdListFromOptimalPath(rootNode),
    commentary,
  };
}

function genNodeIdListFromOptimalPath(rootNode: Node): string[] {
  const ids = [rootNode.id];

  let currNode = rootNode;

  while (currNode.chosenChild !== null) {
    currNode = currNode.chosenChild;
    ids.push(currNode.id);
  }

  return ids;
}

function genTreeSVGFromTreeRecurse(
  node: Node,
  xPos: number,
  yPos: number,
  xStep: number,
  yStep: number,
  treeSVG: SVGTree
): void {
  if (node.leftChild !== null) {
    treeSVG.edges.push({
      startX: xPos,
      startY: yPos,
      endX: xPos - xStep,
      endY: yPos + yStep,
    });

    genTreeSVGFromTreeRecurse(
      node.leftChild,
      xPos - xStep,
      yPos + yStep,
      xStep / 2,
      yStep,
      treeSVG
    );
  }

  if (node.rightChild !== null) {
    treeSVG.edges.push({
      startX: xPos,
      startY: yPos,
      endX: xPos + xStep,
      endY: yPos + yStep,
    });

    genTreeSVGFromTreeRecurse(
      node.rightChild,
      xPos + xStep,
      yPos + yStep,
      xStep / 2,
      yStep,
      treeSVG
    );
  }

  treeSVG.nodes.push({
    centerX: xPos,
    centerY: yPos,
    internalNode: node,
    dataHiddenForUserGuess: DataHiddenForUserGuess.None,
  });
}
