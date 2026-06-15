const express = require('express');
const { getAllTabs } = require('../sheets');
const router = express.Router();

router.get('/data', async (req, res) => {
  try { res.json(await getAllTabs()); }
  catch (e) { res.status(502).json({ error: 'Could not read the Sheet', detail: e.message }); }
});

module.exports = router;
