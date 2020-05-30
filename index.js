const express = require('express');
const { Pool, Client } = require('pg')
const http = require('http');
const bodyParser = require('body-parser');
const extension = '/api/v1';

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
const server = http.Server(app);
const PORT = parseInt(process.env.PORT) || 5000;

server.listen(PORT, function () {
  console.log('Listening');
});

app.post(`${extension}/login`, async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).send({
      success: 'false',
      message: 'email is required'
    });
  }
  if (!password) {
    return res.status(400).send({
      success: 'false',
      message: 'password is required'
    });
  }
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
  if (result.rowCount == 0) {
    return res.status(404).send({
      success: 'false',
      message: 'authentication failed'
    });
  }

  return res.status(200).send({
    success: 'true',
    message: 'authenticated',
    user: {
      id : result.rows[0].id,
      name : result.rows[0].name,
      surname : result.rows[0].surname,
      username: result.rows[0].username,
      email : result.rows[0].email
    }
  });
});

app.post(`${extension}/register`, async (req, res) => {
  console.log(req.body);
  const { email, password, name, surname, username } = req;
  if (!email) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  }
  if (!password) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  }
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
  if (result == null) {
    return res.status(404).send({
      success: 'false',
      message: 'title is required'
    });
  }

  return res.status(200).send({
    success: 'true',
    message: 'authenticated'
  });
});


// pools will use environment variables
// for connection information
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'mylocaldb',
//   password: 'admin',
//   port: 5432,
// });

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
// you can also use async/await
// const res = await pool.query('SELECT NOW()');
// await pool.end();
// clients will also use environment variables
// for connection information
// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'mydb',
//     password: 'admin',
//     port: 5432,
//   });


// await client.connect();
// const res = await client.query('SELECT NOW()');
// await client.end();

// //get all todos
// app.get('/api/v1/todos', (req, res) => {
//   res.status(200).send({
//     success: 'true',
//     message: 'todos retrieved successfully',
//     todos: db
//   })
// });