import {
  areObjectsEqualDisregardingRefs,
  sequenceBetween,
} from 'src/app/shared/genericUtils';
import { treeToTreeSVG } from './animation';
import { buildBinaryTree, flattenTreeToInorderList, LEAF_COUNT } from './tree';

describe('Animation', () => {
  describe('treeToTreeSVG', () => {
    it('Mirrors the original trees data and structure for [0..LEAF_COUNT - 1]', () => {
      const root = buildBinaryTree(sequenceBetween(0, LEAF_COUNT));
      const svgTree = treeToTreeSVG(root, 100, 100, 100);

      const flattenedTree = flattenTreeToInorderList(root).sort(
        (node1, node2) => node1.id.localeCompare(node2.id)
      );

      const internalNodesFromSVGTree = svgTree.nodes
        .map((node) => node.internalNode)
        .sort((node1, node2) => node1.id.localeCompare(node2.id));

      expect(flattenedTree.length).toEqual(internalNodesFromSVGTree.length);

      expect(
        flattenedTree.every((_, i) =>
          areObjectsEqualDisregardingRefs(
            flattenedTree[i],
            internalNodesFromSVGTree[i]
          )
        )
      ).toBeTrue();
    });

    it('Mirrors the original trees data and structure for [1..1]', () => {
      const root = buildBinaryTree(Array(LEAF_COUNT).fill(1));
      const svgTree = treeToTreeSVG(root, 100, 100, 100);

      const flattenedTree = flattenTreeToInorderList(root).sort(
        (node1, node2) => node1.id.localeCompare(node2.id)
      );

      const internalNodesFromSVGTree = svgTree.nodes
        .map((node) => node.internalNode)
        .sort((node1, node2) => node1.id.localeCompare(node2.id));

      expect(flattenedTree.length).toEqual(internalNodesFromSVGTree.length);

      expect(
        flattenedTree.every((_, i) =>
          areObjectsEqualDisregardingRefs(
            flattenedTree[i],
            internalNodesFromSVGTree[i]
          )
        )
      ).toBeTrue();
    });
  });
});
