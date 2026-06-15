const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const router = express.Router();

const COOKIE = 'hohana_session';
function secret() {
  if (!process.env.JWT_SECRET) { console.error('FATAL: JWT_SECRET is not set'); process.exit(1); }
  return process.env.JWT_SECRET;
}

router.post('/login', async (req, res) => {
  const pin = (req.body && req.body.pin || '').toString();
  if (!pin) return res.status(400).json({ error: 'Passcode required' });
  const { rows } = await pool.query(`SELECT value FROM settings WHERE key = 'pin_hash'`);
  if (rows.length === 0) return res.status(500).json({ error: 'Not configured' });
  if (!bcrypt.compareSync(pin, rows[0].value)) return res.status(401).json({ error: 'Wrong passcode' });
  const token = jwt.sign({ ok: true }, secret(), { expiresIn: '30d' });
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: true, maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ ok: true });
});

router.post('/logout', (req, res) => { res.clearCookie(COOKIE); res.json({ ok: true }); });

function requireAuth(req, res, next) {
  const t = req.cookies && req.cookies[COOKIE];
  if (!t) return res.status(401).json({ error: 'Auth required' });
  try { jwt.verify(t, secret()); next(); }
  catch { return res.status(401).json({ error: 'Auth required' }); }
}

module.exports = { router, requireAuth };
