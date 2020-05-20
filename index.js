const app = express();

const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'admin',
    port: 5432,
  });

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
// you can also use async/await
const res = await pool.query('SELECT NOW()');
await pool.end();
// clients will also use environment variables
// for connection information
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'admin',
    port: 5432,
  });


await client.connect();
const res = await client.query('SELECT NOW()');
await client.end();

//get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});