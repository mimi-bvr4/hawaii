const { Pool } = require('pg');
if (!process.env.DATABASE_URL) { console.error('FATAL: DATABASE_URL is not set'); process.exit(1); }
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway.internal') ? false : { rejectUnauthorized: false }
});
module.exports = { pool };
