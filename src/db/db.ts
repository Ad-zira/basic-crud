const logger = require('../logs')
const { Pool } = require('pg')
const pool = new Pool()
;(async () => {
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id'
    const res = await client.query(queryText, ['brianc'])
    // const insertPhotoText = 'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)'
    // const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo']
    // await client.query(insertPhotoText, insertPhotoValues)
    await client.query('COMMIT')
    logger.info('Querying...')
  } catch (e) {
    await client.query('ROLLBACK')
    logger.error('The Commit is not successful, rolling back', e)
  } finally {
    logger.info('')
    client.release()
  }
})
// ().catch(e => logger.error(e.stack))