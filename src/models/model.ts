import { pool } from './pool';
import pg from 'pg';

class Model {
  readonly pool: pg.Pool;

  constructor() {
    this.pool = pool;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }
}

export default Model;