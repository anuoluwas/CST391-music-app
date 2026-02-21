import {Pool} from 'pg'

let pool: Pool|undefined;

export function getPool(): Pool {
    if(!pool) {
        const URL = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
        if(!URL) throw new Error('POSTGRES_URL (or DATABASE_URL) not set');

        pool = new Pool({
            connectionString: URL,
            //TLS is required by many hosted PGS; harmless locally when undefined
            ssl: process.env.NODE_EVV === 'production' ? { rejectUnauthorized: false} : undefined,
            max: 5, //Small pool suits serverless
        });
    }
    return pool;
}
