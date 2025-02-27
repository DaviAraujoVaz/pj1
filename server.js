require('dotenv').config();
const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())

// Usando as rotas de autenticação
app.use('/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
