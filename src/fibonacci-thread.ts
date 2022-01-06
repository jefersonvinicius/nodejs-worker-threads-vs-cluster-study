import { performance } from 'perf_hooks';
import { threadId, workerData, parentPort } from 'worker_threads';
import { fibonacci } from './fibonacci';

const startTime = performance.now();
console.log(`Worker ${threadId} started`);
const result = fibonacci(workerData.fibN);
const endTime = performance.now();
parentPort?.postMessage({ value: result, fibN: workerData.fibN, time: endTime - startTime });
