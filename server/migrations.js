const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function migrate() {
  await pool.query(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`);
  const { rows } = await pool.query(`SELECT 1 FROM settings WHERE key = 'pin_hash'`);
  if (rows.length === 0) {
    const pin = process.env.APP_PIN;
    if (!pin) { console.error('FATAL: APP_PIN must be set on first boot to seed the family passcode'); process.exit(1); }
    const hash = bcrypt.hashSync(pin, 10);
    await pool.query(`INSERT INTO settings (key, value) VALUES ('pin_hash', $1)`, [hash]);
    console.log('Seeded family passcode from APP_PIN (first boot).');
  }
}
module.exports = { migrate };
