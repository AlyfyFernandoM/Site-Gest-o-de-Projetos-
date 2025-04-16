const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar projetos
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM projetos');
  res.json(rows);
});

// Criar projeto
router.post('/', async (req, res) => {
  const { nome } = req.body;
  const [result] = await db.query('INSERT INTO projetos (nome) VALUES (?)', [nome]);
  res.json({ id: result.insertId, nome });
});

// Deletar projeto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM projetos WHERE id = ?', [id]);
  res.sendStatus(204);
});

module.exports = router;
