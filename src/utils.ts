export function waitForKeyPress() {
  console.log('Press any key to finish...');
  return new Promise<void>((resolve) => {
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    });
  });
}

export type WorkerMessage = { value: number; fibN: number; time: number };

type ResultTable = { worker: string; value: number; fibN: number; time: string }[];

export function generateResultTable(values: Map<string, WorkerMessage>) {
  return Array.from(values.entries()).reduce((list, entry) => {
    const [id, data] = entry;
    const time = `${(data.time / 1000).toFixed(2)}s`;
    return list.concat({ worker: id, ...data, time });
  }, [] as ResultTable);
}
