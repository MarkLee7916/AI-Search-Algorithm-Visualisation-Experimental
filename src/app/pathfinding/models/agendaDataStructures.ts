import { Cmp } from '../algos/cmps';

// Data structures that can hold the not-yet expanded nodes in a pathfinding algo
export interface Agenda<T> {
  add: (item: T) => void;
  remove: () => T;
  isEmpty: () => boolean;
}

// Adapter pattern implementation of a stack
export class Stack<T> implements Agenda<T> {
  private readonly stack: T[];

  constructor() {
    this.stack = [];
  }

  public add(item: T): void {
    this.stack.push(item);
  }

  public remove(): T {
    if (this.isEmpty()) {
      throw new Error('Can not remove from empty stack');
    }

    return this.stack.pop() as T;
  }

  public isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

// Adapter pattern implementation of a priority queue
// This could be made more efficient by using a heap, but performance is sufficient for how fast pathfinding algos are computed
export class PriorityQueue<T> implements Agenda<T> {
  private readonly queue: T[];

  private readonly cmp: Cmp<T>;

  constructor(cmp: Cmp<T>) {
    this.cmp = cmp;
    this.queue = [];
  }

  public add(elem: T): void {
    this.queue.push(elem);
  }

  public remove(): T {
    if (this.isEmpty()) {
      throw new Error('Can not remove from empty queue');
    }

    this.queue.sort(this.cmp);

    return this.queue.shift() as T;
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// Adapter pattern implementation of a queue
// This could be made more efficient by using a linked list, but performance is sufficient for how fast algorithms are computed
export class Queue<T> implements Agenda<T> {
  private readonly queue: T[];

  constructor() {
    this.queue = [];
  }

  public add(item: T): void {
    this.queue.push(item);
  }

  public remove(): T {
    if (this.isEmpty()) {
      throw new Error('Can not remove from empty queue');
    }

    return this.queue.shift() as T;
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
