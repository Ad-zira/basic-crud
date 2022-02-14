const { env } = require("process");
const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config();

const pool = new Pool({
  // connectionString: process.env.DATABASE_URL
  user: env.DB_USER || 'postgres',
  password: env.DB_PASSWORD || 'mala1k4t_m1k41l',
  database: env.DB_NAME || 'employees',
  port: env.DB_PORT || '5432',
  host: env.DB_HOST || 'localhost'
  
})

// pool.query(
//   `CREATE DOMAIN national_id AS INTEGER CHECK(VALUE ~* '^\\d{6}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$'); CREATE DOMAIN nationalid CREATE TABLE IF NOT EXISTS employees (id SERIAL PRIMARY KEY, national_id INTEGER, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), "phoneNo" VARCHAR(255), "userId" NUMERIC)`,
// )

async function query(queryText: String){
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const res = await client.query(queryText)
    await client.query('COMMIT')
    return res;
  } catch (err) {
    await client.query('ROLLBACK')
  } finally {
    client.release();
  }
  
}

module.exports = pool;