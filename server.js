const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // arquivo de chave de conta de serviço do Firebase

const storage = multer.memoryStorage(); // armazenamento em memória

const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 4000;

// Inicializa o SDK do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Obtém uma referência ao Firestore
const db = admin.firestore();

app.use(express.static(path.join(__dirname, 'build')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/upload', upload.array('file'), async function (req, res, next) {
  // Verifica se há arquivos enviados
  if (!req.files) {
    res.status(400).send('Nenhum arquivo enviado!');
    return;
  }

  try {
    // Cria uma nova coleção 'uploads' no Firestore, se ela ainda não existir
    await db.collection('uploads').doc().set({});

    // Para cada arquivo enviado, cria um novo documento no Firestore com as informações do arquivo
    req.files.forEach(async file => {
      const now = new Date();
      const fileName = `${now.toISOString()}_${file.originalname}`;
      const filePath = `uploads/${fileName}`;
      const fileRef = db.collection('uploads').doc().collection('files').doc();
      await fileRef.set({
        name: file.originalname,
        path: filePath,
        timestamp: admin.firestore.Timestamp.now()
      });
    });

    res.send('Arquivos enviados com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao enviar arquivos!');
  }
});

// Remove pastas mais antigas do que 1 dia
setInterval(() => {
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const uploadDir = path.join(__dirname, 'uploads');
  fs.readdir(uploadDir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && stat.mtime < oneDayAgo) {
        console.log(`Removendo pasta antiga: ${filePath}`);
        fs.removeSync(filePath);
      }
    });
  });
}, 24 * 60 * 60 * 1000); // Executa a cada 24 horas

app.listen(port, '0.0.0.0', function () {
  console.log(`Servidor rodando na porta ${port}!`);
});
