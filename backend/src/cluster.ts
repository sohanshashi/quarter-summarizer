import recluster from 'recluster';
import { cpus } from 'os';
import path from 'path';

const cores = cpus().length;
const noOfWorkers =
  process.env.NODE_ENV === 'production'
    ? Math.max(Math.ceil((cores * 40) / 100), 2)
    : 1;

console.log(
  `Available cores: ${cores}. Application starting with: ${noOfWorkers} workers`,
);

const cluster = recluster(path.join(__dirname, 'main.js'), {
  workers: noOfWorkers,
  timeout: 60,
});

cluster.run();
