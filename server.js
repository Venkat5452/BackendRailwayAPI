const express = require('express');
const sql = require('mssql'); 
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const server = express();
const PORT = 4567;

server.use(bodyParser.json());

const dbConfig = {
    server: '###',
    database: '##',
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustedConnection: true 
    }
};

sql.connect(dbConfig).then(pool => {
    console.log('Connected to SQL Server database!');
        server.post('/register', async (req, res) => {
        const { username, password, role } = req.body;
        try {
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, password)
                .input('role', sql.NVarChar, role)
                .query('INSERT INTO users (username, password, role) VALUES (@username, @password, @role)');
            res.status(201).send('User registered successfully!');
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    server.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, password)
                .query('SELECT * FROM users WHERE username = @username AND password = @password');
            if (result.recordset.length > 0) {
                const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' }); // Replace with your JWT secret
                res.json({ token });
            } else {
                res.status(401).send('Invalid credentials');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    server.post('/trains', async (req, res) => {
        const { train_name, source, destination, total_seats } = req.body;
        const apiKey = req.headers['12eferhuihbyuijjgftr5t67u8ijbvcfdrt']; 
        if (apiKey !== 'poiuytrewqasdfghjklkmnbvcxzaqwertgvcxsertyuikmnb') { 
            return res.status(403).send('Forbidden: Invalid API Key');
        }
        try {
            const result = await pool.request()
                .input('train_name', sql.NVarChar, train_name)
                .input('source', sql.NVarChar, source)
                .input('destination', sql.NVarChar, destination)
                .input('total_seats', sql.Int, total_seats)
                .input('available_seats', sql.Int, total_seats) // Initially, available seats are the same as total seats
                .query('INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES (@train_name, @source, @destination, @total_seats, @available_seats)');
            res.status(201).send('Train added successfully!');
        } catch (err) {
            console.error('Error adding train:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    server.get('/trains/availability', async (req, res) => {
        const { source, destination } = req.query;
        try {
            const result = await pool.request()
                .input('source', sql.NVarChar, source)
                .input('destination', sql.NVarChar, destination)
                .query('SELECT * FROM trains WHERE source = @source AND destination = @destination');
            res.json(result.recordset);
        } catch (err) {
            console.error('Error fetching availability:', err);
            res.status(500).send('Internal Server Error');
        }
    });
        server.post('/book', async (req, res) => {
        const { train_id } = req.body;
        const token = req.headers['authorization'];
        if (!token) return res.status(403).send('Forbidden: No token provided');
        try {
            const decoded = jwt.verify(token.split(' ')[1], 'your_jwt_secret'); // Replace with your JWT secret
            const username = decoded.username;
            const trainResult = await pool.request()
                .input('train_id', sql.Int, train_id)
                .query('SELECT available_seats FROM trains WHERE train_id = @train_id');
            
            if (trainResult.recordset.length === 0 || trainResult.recordset[0].available_seats <= 0) {
                return res.status(400).send('No available seats');
            }
            await pool.request()
                .input('train_id', sql.Int, train_id)
                .query('UPDATE trains SET available_seats = available_seats - 1 WHERE train_id = @train_id');

            await pool.request()
                .input('train_id', sql.Int, train_id)
                .input('username', sql.NVarChar, username)
                .query('INSERT INTO bookings (train_id, username) VALUES (@train_id, @username)');
            
            res.send('Seat booked successfully!');
        } catch (err) {
            console.error('Error booking seat:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    server.get('/bookings', async (req, res) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(403).send('Forbidden: No token provided');

        try {
            const decoded = jwt.verify(token.split(' ')[1], 'your_jwt_secret'); // Replace with your JWT secret
            const username = decoded.username;

            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM bookings WHERE username = @username');
            res.json(result.recordset);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            res.status(500).send('Internal Server Error');
        }
    });
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error('Database connection failed!', err);
});
