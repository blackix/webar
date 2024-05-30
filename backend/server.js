const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/3dmodels', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const modelSchema = new mongoose.Schema({
  name: String,
  path: String,
});

const Model = mongoose.model('Model', modelSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('model'), async (req, res) => {
  const model = new Model({
    name: req.file.filename,
    path: req.file.path,
  });
  await model.save();
  res.send('Model uploaded');
});

app.get('/models', async (req, res) => {
  const models = await Model.find();
  res.json(models);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

