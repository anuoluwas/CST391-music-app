import {getPool} from "@/lib/db";

export async function findArtists (){
    const pool = getPool();
    const res = await pool.query('SELECT DISTINCT artist FROM albums ORDER BY artist');
    return res.rows;
}