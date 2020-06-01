const express = require('express');
const { Pool, Client } = require('pg')
const http = require('http');
const bodyParser = require('body-parser');
const extension = '/api/v1';


const crypto = require('crypto');

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

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
      success: false,
      message: 'email is required'
    });
  }
  if (!password) {
    return res.status(400).send({
      success: false,
      message: 'password is required'
    });
  }
  const client = await pool.connect();
  let result = await client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, getHashedPassword(password)]);
  if (result.rowCount == 0) {
    return res.status(404).send({
      success: false,
      message: 'authentication failed'
    });
  }

  return res.status(200).send({
    success: true,
    message: 'authenticated',
    user: {
      id: result.rows[0].id,
      name: result.rows[0].name,
      surname: result.rows[0].surname,
      username: result.rows[0].username,
      email: result.rows[0].email,
      role: result.rows[0].role
    }
  });
});


app.post(`${extension}/register`, async (req, res) => {
  // console.log(req.body);
  const { email, password, name, surname, username, role } = req.body;
  if (!email) {
    return res.status(400).send({
      success: false,
      message: 'email is required'
    });
  }
  if (!password) {
    return res.status(400).send({
      success: false,
      message: 'password is required'
    });
  }
  if (!name) {
    return res.status(400).send({
      success: false,
      message: 'name is required'
    });
  }
  if (!surname) {
    return res.status(400).send({
      success: false,
      message: 'surname is required'
    });
  }
  if (!username) {
    return res.status(400).send({
      success: false,
      message: 'username is required'
    });
  }

  if (!role) {
    return res.status(400).send({
      success: false,
      message: 'role is required'
    });
  }

  const client = await pool.connect();
  let result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rowCount > 0) {
    return res.status(409).send({
      success: false,
      message: 'email taken'
    });
  }

  result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

  if (result.rowCount > 0) {
    return res.status(409).send({
      success: false,
      message: 'username taken'
    });
  }

  const text = 'INSERT INTO users( name, surname, password, username, email, role) VALUES ( $1, $2, $3, $4, $5, $6);'
  const values = [name, surname, getHashedPassword(password), username, email, role];

  try {
    result = await client.query(text, values)
    console.log('aaaaa');
    return res.status(200).send({
      success: true,
      message: 'registred'
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).send({
      success: false,
      message: 'failed'
    })
  }
});

app.get(`${extension}/getAdresses`, async (req, res) => {
    console.log(req.query);
    const client = await pool.connect();
    let result = await client.query(
    'SELECT address.id , address.neighborhood, address.latitude, address.longitude, region.name as region_name, '+
    'street.country as street_country, street.code as street_code, street.type as street_type, '+ 
    'object.type as object_type, object.number_of_floors as object_number_of_floors, object.number_of_entrances as object_number_of_entrances, '+ 
    'municipality.name as municipality_name, municipality.postal_code as municipality_postal_code ' + 
    'FROM address INNER JOIN region on region.id = address.region_id ' + 
    'INNER JOIN street on street.id = address.street_id INNER JOIN object on object.id = address.object_id '+ 
    'INNER JOIN municipality on municipality.id = address.municipality_id ; ');
    res.status(200).send(
      result.rows
    );
});

//use for hosted db
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//use for local db
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mylocaldb',
  password: 'admin',
  port: 5432,
});