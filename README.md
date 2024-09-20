# Trayson Kelii solution

## Implementation

Decided to go with a min-heap (priority queue) which will hold the earliest entry at the top of the heap. Popping and traversing down with the print function allows for keeping memory usage to a minimum while also getting the earliest log entry printed (keeping integrity of synchronous timestamps). The implementation will be the following:

1. Initialize the heap
2. Merge (print) the logs

## Space complexity

O(k) where k is the number of log sources (heap holds one entry per source)

## Time complexity

O(n log k) where n is the number of log entries and log k is the cost of a heap operation
