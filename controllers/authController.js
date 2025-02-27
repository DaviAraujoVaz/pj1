const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.createUser =
    async (req, res) => {
        const { name, password } = req.body;
        console.log(req.body)

        if (!name || !password || name.trim().length < 1 ||
            String(password).trim().length < 1) {
            return res.status(400).send('Nome e senha são obrigatórios');
        }
        // status codes http
        // 200 ok
        // 204 empty response
        // 302 redirect
        // 304 not modified
        // 401/403 not authorized/not allowed
        // 404 not found
        // 400/422 bad request
        // 500 internal error

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            db.query(
                'INSERT INTO users (username, password_hash) VALUES (?, ?)',
                [name, hashedPassword], (err, result) => {
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

exports.getUsers =
    (req, res) => {
        db.query('SELECT * FROM users', (err, result) => {
            if (err) {
                console.log('Erro ao buscar usuários', err);
                res.status(500).send('Erro ao buscar usuários');
                return;
            }
            res.status(200).send(result);
        });
    }

    exports.getSpecificUser =
    (req, res) => {
        db.query('SELECT * FROM users WHERE id = ?', (err, result) => {
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

    if (!name || !password || String(password).trim().length < 1) {
        return res.status(400).send('ID e senha são obrigatórios');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hashedPassword, id], (err, result) => {
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