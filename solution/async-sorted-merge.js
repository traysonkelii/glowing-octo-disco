// "use strict";

// const MinHeap = require("../lib/min-heap");

// // module.exports = async (logSources, printer) => {
// //   const heap = new MinHeap((a, b) => a.log.date - b.log.date);
// //   const initialPromises = [];

// //   // Initialize the heap with the first log from each source
// //   logSources.forEach((source, index) => {
// //     const promise = source.popAsync().then((log) => {
// //       if (log) {
// //         heap.push({ log, sourceIndex: index });
// //       }
// //     });
// //     initialPromises.push(promise);
// //   });

// //   // Wait for all initial logs to be fetched
// //   await Promise.all(initialPromises);

// //   // Merge logs
// //   while (!heap.isEmpty()) {
// //     const { log, sourceIndex } = heap.pop();
// //     printer.print(log);

// //     const nextLog = await logSources[sourceIndex].popAsync();
// //     if (nextLog) {
// //       heap.push({ log: nextLog, sourceIndex });
// //     }
// //   }

// //   printer.done();
// //   return console.log("Async sort complete.");
// // };

// const FastPriorityQueue = require("fastpriorityqueue");

// module.exports = async (logSources, printer) => {
//   const heap = new FastPriorityQueue((a, b) => a.log.date < b.log.date);

//   // Fetch the first log from each source and push into the heap
//   await Promise.all(
//     logSources.map(async (source, index) => {
//       const log = await source.popAsync();
//       if (log) {
//         heap.add({ log, index, source });
//       }
//     })
//   );

//   while (!heap.isEmpty()) {
//     // Pop the earliest log
//     const { log, index, source } = heap.poll();

//     // Start fetching the next log from the same source
//     const nextLogPromise = source.popAsync();

//     // Print the current log
//     printer.print(log);

//     // Fetch and process the next log
//     const nextLog = await nextLogPromise;
//     if (nextLog) {
//       heap.add({ log: nextLog, index, source });
//     }
//   }

//   printer.done();
//   console.log("Async sort complete.");
// };

const FastPriorityQueue = require("fastpriorityqueue");
const pLimit = require("p-limit");

module.exports = async (logSources, printer) => {
  const heap = new FastPriorityQueue((a, b) => a.log.date < b.log.date);
  const concurrencyLimit = 10; // Adjust based on system capacity
  const limit = pLimit(concurrencyLimit);

  const activeFetches = new Set();

  // Function to fetch the next log from a source
  const fetchNextLog = (source, index) =>
    limit(async () => {
      try {
        activeFetches.add(index);
        const log = await source.popAsync();
        if (log) {
          heap.add({ log, source, index });
        }
      } catch (error) {
        console.error(`Error fetching log from source ${index}:`, error);
      } finally {
        activeFetches.delete(index);
      }
    });

  // Start fetching the initial logs
  await Promise.all(
    logSources.map((source, index) => fetchNextLog(source, index))
  );

  while (!heap.isEmpty() || activeFetches.size > 0) {
    while (!heap.isEmpty()) {
      const { log, source, index } = heap.poll();
      printer.print(log);

      // Fetch the next log without awaiting
      fetchNextLog(source, index).catch((error) => {
        console.error(`Error fetching log from source ${index}:`, error);
      });
    }

    // Wait for any fetches to complete
    if (activeFetches.size > 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  printer.done();
  console.log("Async merge complete.");
};
