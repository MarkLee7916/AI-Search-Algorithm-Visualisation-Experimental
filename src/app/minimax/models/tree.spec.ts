import {
  areObjectsEqualDisregardingRefs,
  sequenceBetween,
} from 'src/app/shared/genericUtils';
import {
  buildBinaryTree,
  flattenTreeToInorderList,
  genDefaultNode,
  isLeafNode,
  LEAF_COUNT,
} from './tree';

describe('Tree model', () => {
  describe('genDefaultNode', () => {
    it('returns correct node', () => {
      const node = genDefaultNode('rlr', 2);

      expect(node.id).toBe('rlr');
      expect(node.depth).toBe(2);
      expect(node.hasBeenConsidered).toBe(false);
      expect(node.alpha).toBe(null);
      expect(node.beta).toBe(null);
      expect(node.val).toBe(null);
      expect(node.leftChild).toBe(null);
      expect(node.rightChild).toBe(null);
      expect(node.chosenChild).toBe(null);
    });
  });

  describe('flattenTreeToInorderList and buildBinaryTree', () => {
    it('returns correct items in correct order when composing them', () => {
      const rootNode = buildBinaryTree(sequenceBetween(1, LEAF_COUNT + 1));
      const nodeList = flattenTreeToInorderList(rootNode);

      expect(nodeList.map((node) => node.val)).toEqual([
        1,
        null,
        2,
        null,
        3,
        null,
        4,
        null,
        5,
        null,
        6,
        null,
        7,
        null,
        8,
        null,
        9,
        null,
        10,
        null,
        11,
        null,
        12,
        null,
        13,
        null,
        14,
        null,
        15,
        null,
        16,
      ]);
    });

    it('throws an exception when list is too small for buildBinaryTree()', () => {
      expect(() => buildBinaryTree([])).toThrowError('Argument is undefined!');
    });
  });

  describe('isLeafNode', () => {
    it('returns true when node is a leaf', () => {
      expect(isLeafNode(genDefaultNode('', 0))).toBeTrue();
    });

    it('returns false when node is not a leaf', () => {
      expect(isLeafNode(buildBinaryTree(sequenceBetween(0, 100)))).toBeFalse();
    });
  });
});
