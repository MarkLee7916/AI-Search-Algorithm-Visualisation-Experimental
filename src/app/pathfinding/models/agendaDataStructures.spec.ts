import { sequence } from '@angular/animations';
import { sequenceBetween } from 'src/app/shared/genericUtils';
import { PriorityQueue, Queue, Stack } from './agendaDataStructures';

describe('Agenda data structures', () => {
  describe('stack', () => {
    it('holds items and returns in correct order', () => {
      const stack = new Stack<number>();

      for (let i = 0; i <= 9; i++) {
        stack.add(i);
      }

      for (let i = 9; i >= 0; i--) {
        expect(stack.remove()).toBe(i);
      }

      expect(stack.isEmpty()).toBeTrue();
    });
  });

  describe('queue', () => {
    it('holds items and returns in correct order', () => {
      const queue = new Queue<number>();

      for (let i = 0; i <= 9; i++) {
        queue.add(i);
      }

      for (let i = 0; i <= 9; i++) {
        expect(queue.remove()).toBe(i);
      }

      expect(queue.isEmpty()).toBeTrue();
    });
  });

  describe('priority queue', () => {
    it('holds items and returns in correct order', () => {
      const priorityQueue = new PriorityQueue<number>((x, y) => x - y);
      const itemsToAdd = sequenceBetween(1, 10).sort(
        (x, y) => Math.random() - 0.5
      );

      itemsToAdd.forEach((item) => {
        priorityQueue.add(item);
      });

      for (let i = 1; i <= 9; i++) {
        expect(priorityQueue.remove()).toBe(i);
      }

      expect(priorityQueue.isEmpty()).toBeTrue();
    });
  });
});
