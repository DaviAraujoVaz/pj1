const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send('Nome e senha são obrigatórios');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (name, password_hash) VALUES (?, ?)', [name, hashedPassword], (err, result) => {
            if (err) {
                console.log('Erro ao criar usuário', err);
                return res.status(500).send('Erro ao criar usuário');
            }
            res.status(201).send('Usuário criado com sucesso');
        });
    } catch (err) {
        console.log('Erro ao hashear a senha', err);
        res.status(500).send('Erro ao criar usuário');
    }
}

exports.getUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.log('Erro ao buscar usuários', err);
            res.status(500).send('Erro ao buscar usuários');
            return;
        }
        res.status(200).send(result);
    });
}

exports.updateUser = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).send('ID e senha são obrigatórios');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, id], (err, result) => {
            if (err) {
                console.log('Erro ao atualizar usuário', err);
                return res.status(500).send('Erro ao atualizar usuário');
            }
            res.status(200).send('Usuário atualizado com sucesso');
        });
    } catch (err) {
        console.log('Erro ao hashear a senha', err);
        res.status(500).send('Erro ao atualizar usuário');
    }
}