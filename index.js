const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json(),cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '********',
    database: 'contacto_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión a MySQL establecida');
});
app.post('/enviar-mensaje', (req, res) => {
    const { nombre, email, motivo, mensaje } = req.body;

    const sql = 'INSERT INTO mensajes_contacto (nombre, email, motivo, mensaje) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nombre, email, motivo, mensaje], (err, result) => {
        if (err) {
            console.error('Error al guardar el mensaje:', err);
            res.status(500).send('Error al enviar el mensaje.');
        } else {
            res.send('Mensaje enviado exitosamente.');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
