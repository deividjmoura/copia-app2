const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const now = new Date(); // Obtem a hora atual
    const folderName = `uploads/${now.getTime()}/`; // Cria um nome de pasta com base na hora atual em milissegundos
    fs.ensureDirSync(folderName); // Cria a pasta se ela não existir
    req.uploadFolder = folderName; // Armazena o nome da pasta criada no objeto req para ser usado posteriormente
    cb(null, folderName); // Esse é o diretório onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    const folderName = path.basename(req.uploadFolder); // Extrai o nome da pasta criada na função 'destination'
    cb(null, `${folderName}-${file.originalname}`); // Usa o nome da pasta e o nome original do arquivo para criar um nome de arquivo único
  }
});


const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 4000;

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

app.post('/upload', upload.array('file'), function (req, res, next) {
  const folderName = req.uploadFolder; // Recupera o nome da pasta criada na função 'destination'
  res.send('Arquivos enviados com sucesso!');
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
  
