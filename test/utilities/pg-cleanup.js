const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();
//USER_EMAIL
const connectionString = `${process.env.PG_DBWRITER_CONNECTION_STR}`
const qryString1 = `delete from sds.my_audience_studies where my_audience_id in (select my_audience_id from sds.my_audiences where account_id=1 and ((my_audience_name like 'qe perf testing%') or (create_by='${process.env.USER_EMAIL}')));`;
const qryString2 = `delete from sds.my_audiences where account_id=1 and ((my_audience_name like 'qe perf testing%') or (create_by='${process.env.USER_EMAIL}'));`;


const pgCleanup = async () => {
    console.log('calling pg cleanup')
    await query(qryString1, connectionString);
    await query(qryString2, connectionString);
}

const query = async (qryString, connectionString, retries = 0) => {
    try {
        const client = new pg.Client(connectionString);
        client.connect();
        let response = await client.query(qryString)
        client.end();
        return {
            rowCount: response.rowCount,
            rows: response.rows
        };
    } catch (err) {
        console.log('error => ',err)
        if (retries < RETRIES){
            retries++;
            return await query(qryString, retries)
        } 
        throw err;
    }
}
module.exports = pgCleanup;

// pgCleanup();