"use strict";

module.exports = class MinHeap {
  constructor(compare) {
    this.heap = [];
    this.compare = compare || ((a, b) => a - b);
  }

  parentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  leftChildIndex(index) {
    return 2 * index + 1;
  }

  rightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  push(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  pop() {
    if (this.isEmpty()) return null;
    const root = this.heap[0];
    const lastItem = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = lastItem;
      this.heapifyDown();
    }
    return root;
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIdx = this.parentIndex(index);
      if (this.compare(this.heap[index], this.heap[parentIdx]) < 0) {
        this.swap(index, parentIdx);
        index = parentIdx;
      } else {
        break;
      }
    }
  }

  heapifyDown() {
    let index = 0;
    const length = this.heap.length;

    while (this.leftChildIndex(index) < length) {
      let smallestChildIdx = this.leftChildIndex(index);
      const rightChildIdx = this.rightChildIndex(index);

      if (
        rightChildIdx < length &&
        this.compare(this.heap[rightChildIdx], this.heap[smallestChildIdx]) < 0
      ) {
        smallestChildIdx = rightChildIdx;
      }

      if (this.compare(this.heap[smallestChildIdx], this.heap[index]) < 0) {
        this.swap(index, smallestChildIdx);
        index = smallestChildIdx;
      } else {
        break;
      }
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
};
