// min-heap.test.js
"use strict";

const MinHeap = require("../lib/min-heap");

describe("MinHeap", () => {
  test("should initialize an empty heap", () => {
    const heap = new MinHeap();
    expect(heap.isEmpty()).toBe(true);
  });

  test("should push elements and maintain heap property", () => {
    const heap = new MinHeap();
    heap.push(5);
    heap.push(3);
    heap.push(8);
    heap.push(1);

    expect(heap.heap).toEqual([1, 3, 8, 5]);
  });

  test("should pop elements in ascending order", () => {
    const heap = new MinHeap();
    const elements = [5, 3, 8, 1, 4, 7, 6, 2];
    elements.forEach((el) => heap.push(el));

    const result = [];
    while (!heap.isEmpty()) {
      result.push(heap.pop());
    }

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("should handle custom comparator for max heap", () => {
    const maxHeap = new MinHeap((a, b) => b - a);
    const elements = [5, 3, 8, 1, 4];
    elements.forEach((el) => maxHeap.push(el));

    const result = [];
    while (!maxHeap.isEmpty()) {
      result.push(maxHeap.pop());
    }

    expect(result).toEqual([8, 5, 4, 3, 1]);
  });

  test("should handle duplicate elements correctly", () => {
    const heap = new MinHeap();
    const elements = [5, 3, 5, 1, 3];
    elements.forEach((el) => heap.push(el));

    const result = [];
    while (!heap.isEmpty()) {
      result.push(heap.pop());
    }

    expect(result).toEqual([1, 3, 3, 5, 5]);
  });

  test("should return null when popping from an empty heap", () => {
    const heap = new MinHeap();
    expect(heap.pop()).toBeNull();
  });

  test("should maintain heap property after multiple push and pop operations", () => {
    const heap = new MinHeap();
    heap.push(10);
    heap.push(15);
    heap.push(20);
    heap.push(17);

    expect(heap.pop()).toBe(10);
    heap.push(8);
    expect(heap.pop()).toBe(8);
    expect(heap.pop()).toBe(15);
    heap.push(25);
    expect(heap.pop()).toBe(17);
    expect(heap.pop()).toBe(20);
    expect(heap.pop()).toBe(25);
    expect(heap.pop()).toBeNull();
  });

  test("stress test with large number of elements", () => {
    const heap = new MinHeap();
    const size = 10000;
    const elements = Array.from({ length: size }, () =>
      Math.floor(Math.random() * size)
    );
    elements.forEach((el) => heap.push(el));

    let prev = heap.pop();
    while (!heap.isEmpty()) {
      const current = heap.pop();
      expect(current).toBeGreaterThanOrEqual(prev);
      prev = current;
    }
  });
});
