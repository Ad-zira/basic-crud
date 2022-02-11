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
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const logger = require('../logs');
const { Pool } = require('pg');
const pool = new Pool({
    user: process_1.env.DB_USER || 'postgres',
    password: process_1.env.DB_PASSWORD || 'password_apa_aja',
    database: process_1.env.DB_NAME || 'food_delivery_microservices_shopsts',
    port: process_1.env.DB_PORT || '5432',
    host: process_1.env.DB_HOST || 'localhost'
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = yield pool.connect();
    try {
        yield client.query('BEGIN');
        const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id';
        const res = yield client.query(queryText, ['brianc']);
        // const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
        // const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
        // await client.query(insertPhotoText, insertPhotoValues)
        yield client.query('COMMIT');
        logger.info('Querying...');
    }
    catch (e) {
        yield client.query('ROLLBACK');
        logger.error('The Commit is not successful, rolling back', e);
    }
    finally {
        logger.info('');
        client.release();
    }
}));
// ().catch(e => logger.error(e.stack))
logger.on('finish', function (info) {
    // All info log messages has now benn logged
});
logger.on('error', function (err) {
    return `This has to be repaired immediately!`;
});
logger.end();
