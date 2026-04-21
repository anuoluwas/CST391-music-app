import {getPool} from "@/lib/db";
import {Track} from "@/lib/types";


export async function findAllAlbums() {
    const pool = getPool();
    const albumsRes = await pool.query(
        'SELECT * FROM albums',
    );
    return albumsRes.rows;
}

export async function findAlbumsByArtist( artistName: string) {
    const pool = getPool();
    const albumsRes = await pool.query(
        'SELECT * FROM albums WHERE LOWER(artist) = LOWER($1)',
        [artistName]
    );
    return albumsRes.rows;
}

export async function findAlbumsByDescription( description: string) {
    const pool = getPool();
    const albumsRes = await pool.query(
        `SELECT * FROM albums WHERE description ILIKE $1`,
        [ `%${description}%` ]
    );
    return albumsRes.rows;
}

export async function findTracksByAlbumIds( albumIds:number []) {
    const pool = getPool();
    const tracksRes = await pool.query(
        'SELECT * FROM tracks WHERE album_id = ANY($1) ORDER BY number',
        [albumIds]
    );
   return tracksRes.rows;
}
export async function findAlbumsByID( idNum: number) {
        const pool = getPool();
        const albumsRes = await pool.query('SELECT * FROM albums WHERE id = $1', [idNum]);
        return albumsRes.rows;
}

export async function deleteAlbumById (id: number){
    const pool = getPool();
    const del = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);
    return del.rowCount;
}

export async function updateAlbum(albumId: number, albumData: {title:string, artist:string, description?:string,
    year?:number, image?:string}, tracks: Track[]){
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(
            `UPDATE albums
             SET title=$1,
                 artist=$2,
                 description=$3,
                 year=$4,
                 image=$5
             WHERE id = $6`,
            [albumData.title, albumData.artist, albumData.description ?? null, albumData.year, albumData.image ?? null, albumId]
        );

        if (Array.isArray(tracks)) {
            for (const t of tracks as Track[]) {
                if (t.id == null) continue;
                await client.query(
                    `UPDATE tracks
                     SET number=$1,
                         title=$2,
                         lyrics=$3,
                         video_url=$4
                     WHERE id = $5
                       AND album_id = $6`,
                    [t.number, t.title, t.lyrics ?? null, t.video ?? null, t.id, albumId]
                );
            }
        }

        await client.query('COMMIT');
        return
    }catch (err) {
        await client.query('ROLLBACK');
        console.error('PUT /api/albums transaction error:', err);
        throw err;
    } finally {
        client.release();
    }
}


export async function createAlbum(albumData: {title:string, artist:string, description?:string,
    year?:number, image?:string}, tracks: Track[]){
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const albumRes = await client.query(
            `INSERT INTO albums (title, artist, description, year, image)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [albumData.title, albumData.artist, albumData.description ?? null, albumData.year, albumData.image ?? null]
        );
        const albumId: number = albumRes.rows[0].id;


            for (const t of tracks as Track[]) {
                if (t.title == null || t.number == null) continue;
                await client.query(
                    `INSERT INTO tracks (album_id, title, number, lyrics, video_url)
             VALUES ($1, $2, $3, $4, $5)`,
                    [albumId, t.title, t.number, t.lyrics ?? null, t.video ?? null]
                );
            }


        await client.query('COMMIT');
        return albumId;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('POST /api/albums transaction error:', err);
       throw err
    } finally {
        client.release();
    }
}