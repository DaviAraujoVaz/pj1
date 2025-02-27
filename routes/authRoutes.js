
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const crypto = require('node:crypto');
const db = require('../config/database');
const bcrypt = require('bcrypt');

const sessions = new Map();

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [bearer, sessionId] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !sessionId) {
        return res.status(401).json({ error: 'Formato de token inválido' });
    }

    const user = sessions.get(sessionId);

    console.log('Verificando sessão para ID:', sessionId);

    if (!user) {
        return res.status(401).json({ error: 'Sessão inválida ou expirada' });
    }

    console.log('Sessão encontrada para usuário:', user.username);
    req.user = user; // Anexa o usuário autenticado ao request
    next();
};

// Rotas
router.post('/users', authController.createUser);
router.get('/users', authMiddleware, authController.getUsers);
router.put('/users', authMiddleware, authController.updateUser);

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' });
    }

    // 1. Buscar usuário no banco
    db.query('SELECT * FROM users WHERE username = ?', [name], async (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário no banco:', err);
            return res.status(500).json({ error: 'Erro interno' });
        }

        if (results.length === 0) {
            return res.status(400).json({ error: 'Usuário ou senha incorretos' });
        }

        const user = results[0];

        // 2. Comparar hash da senha
        const senhaCorreta = await bcrypt.compare(password, user.password_hash);
        if (!senhaCorreta) {
            return res.status(400).json({ error: 'Usuário ou senha incorretos' });
        }

        // 3. Criar sessão e armazenar no Map
        const sessionId = crypto.randomUUID();
        sessions.set(sessionId, { id: user.id, username: user.username });

        console.log(`Sessão criada: ${sessionId} para ${user.username}`);

        res.json({ sessionId });
    });
});

module.exports = router;
