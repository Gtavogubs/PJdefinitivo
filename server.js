const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('Página Inicial')); // Serve seu index.html e CSS [cite: 532]

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Sua senha do MySQL aqui [cite: 644]
    database: "alpha_gym"
});

// CREATE: Registro de novo usuário
app.post("/usuarios", (req, res) => {
    const { nome, email, senha } = req.body;
    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao cadastrar. E-mail já existe?" });
        res.json({ message: "Conta criada!", id: result.insertId });
    });
});

// READ: Verificação de Login
app.post("/login", (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) res.json({ message: "Sucesso!", user: results[0] });
        else res.status(401).json({ message: "Dados incorretos." });
    });
});

app.listen(3001, () => console.log("Servidor Alpha Gym rodando na porta 3001"));