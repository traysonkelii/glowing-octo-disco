"use strict";

const FastPriorityQueue = require("fastpriorityqueue");

module.exports = async (logSources, printer) => {
  const heap = new FastPriorityQueue((a, b) => a.log.date < b.log.date);

  const promiseQueue = {}; // Keeps track of pending fetch promises for each source.
  let activeSource = -1; // Indicates the source currently being processed to avoid conflicts.

  // Helper function to get next log
  async function fetchNextLog(index) {
    const source = logSources[index];
    const log = await source.popAsync();
    if (log) {
      // Places next log in proper location on the stack
      heap.add({ log, index, source });
    }
    // Updates the queue of promises
    if (log && index !== activeSource) {
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
    const { log, index, source } = heap.poll();
    printer.print(log);

    // Update the index of the active source
    activeSource = index;

    // Empty out the current queue of promises, concurrency control
    await Promise.all(promiseQueue[index]);
    activeSource = -1;

    // Dynamically update the queue by adding the next log fetch promise
    promiseQueue[index] = [fetchNextLog(index)];
  }

  printer.done();
  console.log("Async sort complete.");
};
