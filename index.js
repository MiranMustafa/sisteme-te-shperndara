const express = require('express');
const { Pool, Client } = require('pg')
const http = require('http');

const app = express();
 const server = http.Server(app);
const PORT = parseInt(process.env.PORT) || 5000;

server.listen(PORT, function(){
    console.log('Listening');
});

app.get('', async (req,res)=>{
  res.send({
    'status' : 'OK'
  }
  )
})


// pools will use environment variables
// for connection information
// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// app.get('/db', async (req, res) => {
//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM test_table');
//       const results = { 'results': (result) ? result.rows : null};
//       res.render('pages/db', results );
//       client.release();
//     } catch (err) {
//       console.error(err);
//       res.send("Error " + err);
//     }
//   })
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'mydb',
//     password: 'admin',
//     port: 5432,
//   });

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