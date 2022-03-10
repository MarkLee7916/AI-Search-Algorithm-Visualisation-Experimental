import cloneDeep from 'clone-deep';
import { assertNonNull } from 'src/app/shared/genericUtils';
import { genTreeAnimationFrame, TreeAnimationFrame } from '../models/animation';
import { Node, buildBinaryTree, TREE_DEPTH, isLeafNode } from '../models/tree';

export function minimax(
  leafValues: number[],
  useAlphaBetaPruning: boolean
): TreeAnimationFrame[] {
  const rootNode = buildBinaryTree(leafValues);
  const treeAnimationFrames = [
    genTreeAnimationFrame(
      cloneDeep(rootNode),
      null,
      'Nothing has happened yet!'
    ),
  ];

  max(
    rootNode,
    rootNode,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    0,
    useAlphaBetaPruning,
    treeAnimationFrames
  );

  treeAnimationFrames.push(
    genTreeAnimationFrame(
      cloneDeep(rootNode),
      null,
      'Final path through tree found!'
    )
  );

  return treeAnimationFrames;
}

function max(
  rootNode: Node,
  currNode: Node,
  alpha: number,
  beta: number,
  depth: number,
  useAlphaBetaPruning: boolean,
  treeAnimationFrames: TreeAnimationFrame[]
): number {
  currNode.alpha = alpha;
  currNode.beta = beta;
  currNode.hasBeenConsidered = true;

  if (
    currNode.id !== rootNode.id &&
    !isLeafNode(currNode) &&
    useAlphaBetaPruning
  ) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        currNode.id,
        `Set alpha and beta values to parent values ... alpha = ${currNode.alpha} and beta = ${currNode.beta}`
      )
    );
  } else if (!isLeafNode(currNode) && useAlphaBetaPruning) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        currNode.id,
        `Initialise alpha to ${Number.NEGATIVE_INFINITY} and beta to ${Number.POSITIVE_INFINITY}`
      )
    );
  }

  if (depth === TREE_DEPTH) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        currNode.id,
        `Leaf node reached, return default value of ${currNode.val}`
      )
    );

    return assertNonNull(currNode.val);
  }

  currNode.val = Number.NEGATIVE_INFINITY;

  treeAnimationFrames.push(
    genTreeAnimationFrame(
      cloneDeep(rootNode),
      currNode.id,
      `Since this is a MAX node, we want to initialise the value such that any value a child returns will be greater than it ... initialise value to ${currNode.val}`
    )
  );
  for (const childNode of [currNode.leftChild, currNode.rightChild]) {
    if (childNode !== null) {
      treeAnimationFrames.push(
        genTreeAnimationFrame(
          cloneDeep(rootNode),
          currNode.id,
          'Exploring next child...'
        )
      );

      const childResult = min(
        rootNode,
        childNode,
        currNode.alpha,
        currNode.beta,
        depth + 1,
        useAlphaBetaPruning,
        treeAnimationFrames
      );

      treeAnimationFrames.push(
        genTreeAnimationFrame(
          cloneDeep(rootNode),
          currNode.id,
          `Computed result of child ... ${childResult}`
        )
      );

      if (childResult > currNode.val) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Child result of ${childResult} is higher than current value of ${currNode.val}, so update current value to ${childResult} `
          )
        );
        currNode.val = childResult;
        currNode.chosenChild = childNode;
      } else {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Child result of ${childResult} isn't higher than current value of ${currNode.val}, so don't update current value`
          )
        );
      }

      if (currNode.val > currNode.alpha && useAlphaBetaPruning) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Current value of ${currNode.val} is higher than alpha value of ${currNode.alpha}, so update alpha value to ${currNode.val}`
          )
        );

        currNode.alpha = currNode.val;
      } else if (useAlphaBetaPruning) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Current value of ${currNode.val} isn't higher than alpha value of ${currNode.alpha}, so don't update alpha value`
          )
        );
      }

      if (currNode.alpha >= currNode.beta && useAlphaBetaPruning) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Alpha value is ${currNode.alpha} and beta value is ${currNode.beta}, so a child node can only be part of final path if it returns a value greater than  ${currNode.alpha} and less than ${currNode.beta}. This isn't possible, so don't consider any more children`
          )
        );

        break;
      } else if (
        childNode.id !== assertNonNull(currNode.rightChild).id &&
        useAlphaBetaPruning
      ) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Alpha value is ${currNode.alpha} and beta value is ${currNode.beta}, so a child node can only be part of final path if it returns a value greater than  ${currNode.alpha} and less than ${currNode.beta}. This is still possible, so consider next child`
          )
        );
      }
    }
  }

  if (currNode.id !== rootNode.id) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        currNode.id,
        `Done exploring children, return current value to parent ... ${currNode.val}`
      )
    );
  }

  return currNode.val;
}

function min(
  rootNode: Node,
  currNode: Node,
  alpha: number,
  beta: number,
  depth: number,
  useAlphaBetaPruning: boolean,
  treeAnimationFrames: TreeAnimationFrame[]
): number {
  currNode.alpha = alpha;
  currNode.beta = beta;
  currNode.hasBeenConsidered = true;

  if (
    currNode.id !== rootNode.id &&
    !isLeafNode(currNode) &&
    useAlphaBetaPruning
  ) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        currNode.id,
        `Set alpha and beta values to parent values ... alpha = ${currNode.alpha} and beta = ${currNode.beta}`
      )
    );
  } else if (!isLeafNode(currNode) && useAlphaBetaPruning) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        null,
        `Initialise alpha to ${Number.NEGATIVE_INFINITY} and beta to ${Number.POSITIVE_INFINITY}`
      )
    );
  }

  if (depth === TREE_DEPTH) {
    treeAnimationFrames.push(
      genTreeAnimationFrame(
        cloneDeep(rootNode),
        currNode.id,
        `Leaf node reached, return default value of ${currNode.val}`
      )
    );

    return assertNonNull(currNode.val);
  }

  currNode.val = Number.POSITIVE_INFINITY;

  treeAnimationFrames.push(
    genTreeAnimationFrame(
      cloneDeep(rootNode),
      currNode.id,
      `Since this is a MIN node, we want to initialise the value such that any value a child returns will be smaller than it ... initialise value to ${currNode.val}`
    )
  );

  for (const childNode of [currNode.leftChild, currNode.rightChild]) {
    if (childNode !== null) {
      treeAnimationFrames.push(
        genTreeAnimationFrame(
          cloneDeep(rootNode),
          currNode.id,
          'Exploring next child...'
        )
      );

      const childResult = max(
        rootNode,
        childNode,
        currNode.alpha,
        currNode.beta,
        depth + 1,
        useAlphaBetaPruning,
        treeAnimationFrames
      );

      treeAnimationFrames.push(
        genTreeAnimationFrame(
          cloneDeep(rootNode),
          currNode.id,
          `Computed result of child ... ${childResult}`
        )
      );

      if (childResult < currNode.val) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Child result of ${childResult} is lower than current value of ${currNode.val}, so update current value to ${childResult} `
          )
        );
        currNode.val = childResult;
        currNode.chosenChild = childNode;
      } else {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Child result of ${childResult} isn't lower than current value of ${currNode.val}, so don't update current value`
          )
        );
      }

      if (currNode.val < currNode.beta && useAlphaBetaPruning) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Current value of ${currNode.val} is lower than beta value of ${currNode.beta}, so update beta value to ${currNode.val}`
          )
        );

        currNode.beta = currNode.val;
      } else if (useAlphaBetaPruning) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Current value of ${currNode.val} isn't lower than beta value of ${currNode.beta}, so don't update beta value`
          )
        );
      }

      if (currNode.alpha >= currNode.beta && useAlphaBetaPruning) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Alpha value is ${currNode.alpha} and beta value is ${currNode.beta}, so a child node can only be part of final path if it returns a value greater than  ${currNode.alpha} and less than ${currNode.beta}. This isn't possible, so don't consider any more children`
          )
        );

        break;
      } else if (
        childNode.id !== assertNonNull(currNode.rightChild).id &&
        useAlphaBetaPruning
      ) {
        treeAnimationFrames.push(
          genTreeAnimationFrame(
            cloneDeep(rootNode),
            currNode.id,
            `Alpha value is ${currNode.alpha} and beta value is ${currNode.beta}, so a child node can only be part of final path if it returns a value greater than  ${currNode.alpha} and less than ${currNode.beta}. This is still possible, so consider next child`
          )
        );
      }
    }
  }

  treeAnimationFrames.push(
    genTreeAnimationFrame(
      cloneDeep(rootNode),
      currNode.id,
      `Done exploring children, return current value to parent ... ${currNode.val}`
    )
  );

  return currNode.val;
}
