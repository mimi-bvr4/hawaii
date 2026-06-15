const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const { migrate } = require('./migrations');
const auth = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', auth.router);
app.use('/api', auth.requireAuth, dataRoutes);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
migrate()
  .then(() => app.listen(PORT, () => console.log('Hawaii ʻOhana app listening on ' + PORT)))
  .catch(err => { console.error('Startup failed:', err); process.exit(1); });
