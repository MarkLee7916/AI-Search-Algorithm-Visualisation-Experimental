import {
  areObjectsEqualDisregardingRefs,
  sequenceBetween,
} from 'src/app/shared/genericUtils';
import { flattenTreeToInorderList, LEAF_COUNT } from '../models/tree';
import { minimax } from './minimax';

describe('Minimax', () => {
  describe('without alpha beta pruning', () => {
    it('produces the correct tree and finds the right path for [1..LEAF_COUNT]', () => {
      const input = sequenceBetween(1, LEAF_COUNT + 1);
      const output = minimax(input, false);
      const finalOutput = output[output.length - 1];

      const flattenedTreeAsInorderList = flattenTreeToInorderList(
        finalOutput.rootNode
      );

      const expectedValuesAsInorderList = [
        1, 1, 2, 3, 3, 3, 4, 3, 5, 5, 6, 7, 7, 7, 8, 11, 9, 9, 10, 11, 11, 11,
        12, 11, 13, 13, 14, 15, 15, 15, 16,
      ];

      expect(flattenedTreeAsInorderList.map((node) => node.val)).toEqual(
        expectedValuesAsInorderList
      );

      expect(
        flattenedTreeAsInorderList.map((node) => node.hasBeenConsidered)
      ).toEqual(Array(LEAF_COUNT * 2 - 1).fill(true));

      expect(finalOutput.optimalPathIds).toContain('');
      expect(finalOutput.optimalPathIds).toContain('r');
      expect(finalOutput.optimalPathIds).toContain('rl');
      expect(finalOutput.optimalPathIds).toContain('rlr');
      expect(finalOutput.optimalPathIds).toContain('rlrl');
    });

    it('produces the correct tree and finds the right path for [LEAF_COUNT, LEAF_COUNT - 1..1]', () => {
      const input = sequenceBetween(1, LEAF_COUNT + 1).reverse();
      const output = minimax(input, false);
      const finalOutput = output[output.length - 1];

      const flattenedTreeAsInorderList = flattenTreeToInorderList(
        finalOutput.rootNode
      );

      const expectedValuesAsInorderList = [
        16, 15, 15, 15, 14, 13, 13, 11, 12, 11, 11, 11, 10, 9, 9, 11, 8, 7, 7,
        7, 6, 5, 5, 3, 4, 3, 3, 3, 2, 1, 1,
      ];

      expect(flattenedTreeAsInorderList.map((node) => node.val)).toEqual(
        expectedValuesAsInorderList
      );

      expect(
        flattenedTreeAsInorderList.map((node) => node.hasBeenConsidered)
      ).toEqual(Array(LEAF_COUNT * 2 - 1).fill(true));

      expect(finalOutput.optimalPathIds).toContain('');
      expect(finalOutput.optimalPathIds).toContain('l');
      expect(finalOutput.optimalPathIds).toContain('lr');
      expect(finalOutput.optimalPathIds).toContain('lrl');
      expect(finalOutput.optimalPathIds).toContain('lrlr');
    });

    it('trims leaf value list inputs that are too large', () => {
      const correctSizeInput = sequenceBetween(1, LEAF_COUNT + 1);
      const correctSizeOutput = minimax(correctSizeInput, false);

      const incorrectSizeInput = sequenceBetween(1, LEAF_COUNT + 100);
      const incorrectSizeOutput = minimax(incorrectSizeInput, false);

      const flattenedCorrectSizeOutput = flattenTreeToInorderList(
        correctSizeOutput[correctSizeOutput.length - 1].rootNode
      );

      const flattenedIncorrectSizeOutput = flattenTreeToInorderList(
        incorrectSizeOutput[incorrectSizeOutput.length - 1].rootNode
      );

      expect(flattenedCorrectSizeOutput.length).toEqual(
        flattenedIncorrectSizeOutput.length
      );

      expect(
        flattenedCorrectSizeOutput.every((_, i) =>
          areObjectsEqualDisregardingRefs(
            flattenedCorrectSizeOutput[i],
            flattenedIncorrectSizeOutput[i]
          )
        )
      ).toBeTrue();
    });
  });

  describe('with alpha beta pruning', () => {
    it('produces the correct tree and finds the right path for [1..LEAF_COUNT]', () => {
      const input = sequenceBetween(1, LEAF_COUNT + 1);
      const output = minimax(input, true);
      const finalOutput = output[output.length - 1];

      const flattenedTreeAsInorderList = flattenTreeToInorderList(
        finalOutput.rootNode
      );

      const expectedValuesAsInorderList = [
        1,
        1,
        2,
        3,
        3,
        3,
        4,
        3,
        5,
        5,
        6,
        5,
        7,
        null,
        8,
        11,
        9,
        9,
        10,
        11,
        11,
        11,
        12,
        11,
        13,
        13,
        14,
        13,
        15,
        null,
        16,
      ];

      expect(flattenedTreeAsInorderList.map((node) => node.val)).toEqual(
        expectedValuesAsInorderList
      );

      expect(finalOutput.optimalPathIds).toContain('');
      expect(finalOutput.optimalPathIds).toContain('r');
      expect(finalOutput.optimalPathIds).toContain('rl');
      expect(finalOutput.optimalPathIds).toContain('rlr');
      expect(finalOutput.optimalPathIds).toContain('rlrl');
    });

    it('produces the correct tree and finds the right path for [LEAF_COUNT, LEAF_COUNT - 1..1]', () => {
      const input = sequenceBetween(1, LEAF_COUNT + 1).reverse();
      const output = minimax(input, true);
      const finalOutput = output[output.length - 1];

      const flattenedTreeAsInorderList = flattenTreeToInorderList(
        finalOutput.rootNode
      );

      const expectedValuesAsInorderList = [
        16,
        15,
        15,
        15,
        14,
        14,
        13,
        11,
        12,
        11,
        11,
        11,
        10,
        10,
        9,
        11,
        8,
        8,
        7,
        8,
        6,
        6,
        5,
        8,
        4,
        null,
        3,
        null,
        2,
        null,
        1,
      ];

      expect(flattenedTreeAsInorderList.map((node) => node.val)).toEqual(
        expectedValuesAsInorderList
      );

      expect(finalOutput.optimalPathIds).toContain('');
      expect(finalOutput.optimalPathIds).toContain('l');
      expect(finalOutput.optimalPathIds).toContain('lr');
      expect(finalOutput.optimalPathIds).toContain('lrl');
      expect(finalOutput.optimalPathIds).toContain('lrlr');
    });
  });
});
