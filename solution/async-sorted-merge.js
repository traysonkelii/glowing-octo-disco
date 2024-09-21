"use strict";

const FastPriorityQueue = require("fastpriorityqueue");

module.exports = async (logSources, printer) => {
  const heap = new FastPriorityQueue((a, b) => a.log.date < b.log.date);
  const promiseQueue = {};
  let currentSource = null;

  // Helper function to get next log
  async function fetchNextLog(index) {
    const log = await logSources[index].popAsync();
    if (log) {
      // Places next log in proper location on the stack
      heap.add({ log, index });
    }
    // Updates the queue of promises
    if (log && index !== currentSource) {
      if (!promiseQueue[index]) {
        promiseQueue[index] = [fetchNextLog(index)];
      } else {
        promiseQueue[index].push(fetchNextLog(index));
      }
    }
  }

  // Fetch the first log from each source and push into the heap
  await Promise.all(logSources.map(async (_, index) => fetchNextLog(index)));

  while (!heap.isEmpty()) {
    // Pop the earliest log and print
    const { log, index } = heap.poll();
    printer.print(log);

    // Update the index of the current source
    currentSource = index;

    // Wait for all pending fetches from the current source before proceeding
    await Promise.all(promiseQueue[index]);
    currentSource = null;

    // Dynamically update the queue by adding the next log fetch promise
    promiseQueue[index] = [fetchNextLog(index)];
  }

  printer.done();
  console.log("Async sort complete.");
};
