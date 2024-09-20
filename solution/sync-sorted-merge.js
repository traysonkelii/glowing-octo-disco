// sync-sorted-merge.js
"use strict";

const MinHeap = require("../lib/min-heap");

module.exports = (logSources, printer) => {
  const heap = new MinHeap((a, b) => a.log.date - b.log.date);

  // Initialize the heap with the first log from each source
  logSources.forEach((source, index) => {
    const log = source.pop();
    if (log) {
      heap.push({ log, sourceIndex: index });
    }
  });

  // Merge logs
  while (!heap.isEmpty()) {
    const { log, sourceIndex } = heap.pop();
    printer.print(log);

    const nextLog = logSources[sourceIndex].pop();
    if (nextLog) {
      heap.push({ log: nextLog, sourceIndex });
    }
  }

  printer.done();
  return console.log("Sync sort complete.");
};
