"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { env } = require("process");
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const pool = new Pool({
    // connectionString: process.env.DATABASE_URL
    user: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || 'mala1k4t_m1k41l',
    database: env.DB_NAME || 'employees',
    port: env.DB_PORT || '5432',
    host: env.DB_HOST || 'localhost'
});
// pool.query(
//   `CREATE DOMAIN national_id AS INTEGER CHECK(VALUE ~* '^\\d{6}([04][1-9]|[1256][0-9]|[37][01])(0[1-9]|1[0-2])\d{2}\d{4}$'); CREATE DOMAIN nationalid CREATE TABLE IF NOT EXISTS employees (id SERIAL PRIMARY KEY, national_id INTEGER, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), "phoneNo" VARCHAR(255), "userId" NUMERIC)`,
// )
function query(queryText) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN');
            const res = yield client.query(queryText);
            yield client.query('COMMIT');
            return res;
        }
        catch (err) {
            yield client.query('ROLLBACK');
        }
        finally {
            client.release();
        }
    });
}
module.exports = pool;
