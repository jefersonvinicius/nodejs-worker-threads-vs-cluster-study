import path from 'path';
import { isMainThread, Worker } from 'worker_threads';
import { generateResultTable, waitForKeyPress, WorkerMessage } from './utils';

const values: Map<string, WorkerMessage> = new Map();

const NUMBER_OF_WORKERS = 4;
let numberOfWorkersFinished = 0;

async function main() {
  if (!isMainThread) return;

  console.log(`Process with pid: ${process.pid}`);

  for (let i = 0; i < NUMBER_OF_WORKERS; i++) {
    const workerPath = path.resolve(__dirname, 'fibonacci-thread.js');
    const fibN = 44 + i;
    const worker = new Worker(workerPath, {
      workerData: { fibN },
    });

    worker.once('message', async (message: WorkerMessage) => {
      console.log(`Received result "${message.value}" from worker ${worker.threadId} with param ${message.fibN}`);
      values.set(`worker_${worker.threadId}`, message);

      numberOfWorkersFinished++;

      if (numberOfWorkersFinished === NUMBER_OF_WORKERS) {
        console.table(generateResultTable(values));
        await waitForKeyPress();
        process.exit();
      }
    });
  }
}

main();
