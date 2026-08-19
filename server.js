const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.sqlite');

/// Tables ///
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            semestre INT,
            name TEXT NOT NULL UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER,
            score REAL,
            FOREIGN KEY(subject_id) REFERENCES subjects(id)
        )
    `);
});

/// Grades ///
app.get('/grades', (req, res) => {
    db.all(`
        SELECT grades.id, score, subject_id, subjects.semestre AS semestre, subjects.name AS subject
        FROM grades
        LEFT JOIN subjects ON subjects.id = grades.subject_id
    `, [], (err, rows) => {
        res.json(rows);
    });
});

app.post('/grades', (req, res) => {
    const { subject_id, score } = req.body;

    db.run(
        'INSERT INTO grades (subject_id, score) VALUES (?, ?)',
        [subject_id, score > 6 ? 6 : score],
        function (err) {
            if (err) {
                console.error("DB ERROR:", err.message);
                return res.status(500).json({ error: err.message });
            }

            res.json({ id: this.lastID });
        }
    );
});

app.put('/grades/:id', (req, res) => {
    const { subject_id, score } = req.body;

    db.run(
        `UPDATE grades 
         subject_id = ?, score = ?
         WHERE id = ?`,
        [subject_id, score, req.params.id],
        () => res.json({ success: true })
    );
});

app.delete('/grades/:id', (req, res) => {
    db.run('DELETE FROM grades WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

/// Subjects ///
app.get('/subjects', (req, res) => {
    db.all('SELECT * FROM subjects', [], (err, rows) => {
        res.json(rows);
    });
});

app.post('/subjects', (req, res) => {
    const { name, semestre } = req.body;

    db.run(
        'INSERT INTO subjects (name, semestre) VALUES (?, ?)',
        [name, semestre],
        function () {
            res.json({ id: this.lastID });
        }
    );
});

app.put('/subjects/:id', (req, res) => {
    const { name } = req.body;

    db.run(
        'UPDATE subjects SET name = ? WHERE id = ?',
        [name, req.params.id],
        () => res.json({ success: true })
    );
});

app.delete('/subjects/:id', (req, res) => {
    db.run('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
});

/// Start app ///
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});