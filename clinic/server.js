import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const dataFile = path.join(__dirname, 'data.json');

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
  const data = readData();
  res.render('index', data);
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.post('/admin', (req, res) => {
  const { type, content } = req.body;
  const data = readData();
  if (data[type]) {
    data[type].unshift(content);
    writeData(data);
  }
  res.redirect('/');
});

const PORT = process.env.CLINIC_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Clinic website running on port ${PORT}`);
});
