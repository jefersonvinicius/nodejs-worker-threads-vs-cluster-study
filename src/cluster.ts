import cluster from 'cluster';
import os from 'os';
import { generateResultTable, waitForKeyPress, WorkerMessage } from './utils';

const values: Map<string, WorkerMessage> = new Map();
let numberOfWorkersFinished = 0;

if (cluster.isPrimary) {
  const numberOfCpus = os.cpus().length;

  for (let i = 0; i < numberOfCpus; i++) {
    const worker = cluster.fork();
    const fibN = 44 + i;

    worker.once('message', async (message: WorkerMessage) => {
      console.log(`Received result "${message.value}" from worker ${worker.id} with param ${message.fibN}`);
      values.set(`worker_${worker.id}`, message);
    });

    worker.on('exit', async (code) => {
      numberOfWorkersFinished++;

      if (numberOfWorkersFinished === numberOfCpus) {
        console.table(generateResultTable(values));
        await waitForKeyPress();
        process.exit();
      }
    });
    worker.send({ fibN });
  }
} else {
  import('./fibonacci-cluster');
}
