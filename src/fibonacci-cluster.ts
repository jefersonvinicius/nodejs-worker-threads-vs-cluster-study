import { fibonacci } from './fibonacci';

console.log(`Cluster ${process.pid} started`);
process.on('message', (message: { fibN: number }) => {
  const startTime = performance.now();
  const result = fibonacci(message.fibN);
  const endTime = performance.now();
  process?.send?.({ value: result, fibN: message.fibN, time: endTime - startTime });
  process.exit();
});
