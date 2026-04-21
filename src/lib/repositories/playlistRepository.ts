
import {getPool} from "@/lib/db";
import {NextResponse} from "next/server";

export async function findPlaylistsByID(idNum: number) {
    const pool = getPool();
    const playlistRes = await pool.query('SELECT * FROM playlists WHERE id = $1', [idNum]);
    return playlistRes.rows;
}

export async function findPlaylistsByUserID(idNum: number) {
    const pool = getPool();
    const playlistRes = await pool.query('SELECT * FROM playlists WHERE user_id = $1', [idNum]);
    return playlistRes.rows;
}

export async function findAllPlaylists() {
    const pool = getPool();
    const playlistRes = await pool.query(
        'SELECT * FROM playlists',
    );
    return playlistRes.rows;
}

export async function findTracksByPlaylistIds( playlistIds:number []) {
    const pool = getPool();
    const playlistTrackRes= await pool.query ('SELECT * FROM playlist_tracks WHERE playlist_id = ANY($1)'
        , [playlistIds]);
    return playlistTrackRes.rows;
}

export async function createPlaylist(playlistData: {title: string; user_id?: number}, tracks: number[]){
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const playlistRes = await client.query(
            `INSERT INTO playlists (title, user_id) VALUES ($1, $2) RETURNING id`,
            [playlistData.title, playlistData.user_id]
        );
        const playlistId: number = playlistRes.rows[0].id;

        const checkTracksRes = await client.query("SELECT id From tracks WHERE id = ANY($1)", [tracks]);
        const validTracksData: number[] = checkTracksRes.rows.map(r => r.id);

        for (const trackId of validTracksData) {
            await client.query('INSERT INTO playlist_tracks (playlist_id, track_id) VALUES ($1, $2)',
                [playlistId, trackId]);
        }
        await client.query('COMMIT');
        return playlistId;
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('POST /api/playlists transaction error:', err);
        return err;
    } finally {
        client.release();
    }
}

export async function updatePlaylist(playlistData: {playlistId: number, title: string}, tracks: number[]){
    const pool = getPool();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (playlistData.title) {
            await client.query(
                `UPDATE playlists
                     SET title = $1
                     WHERE id = $2`,
                [playlistData.title, playlistData.playlistId]
            );
        }

        if (tracks && tracks.length > 0) {
            const checkTracksRes = await client.query("SELECT id FROM tracks WHERE id = ANY ($1)", [tracks]);
            const validTracksData: number[] = checkTracksRes.rows.map(r => r.id);

            await client.query('DELETE FROM playlist_tracks WHERE playlist_id = $1', [playlistData.playlistId]);
            for (const trackId of validTracksData) {
                await client.query('INSERT INTO playlist_tracks (playlist_id, track_id) VALUES ($1, $2)',
                    [playlistData.playlistId, trackId]);
            }
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('PUT /api/playlists transaction error:', err);
        return err;
    } finally {
        client.release();
    }
}

export async function deletePlaylistById (idNum: number){
    const pool = getPool();
    return await pool.query('DELETE FROM playlists WHERE id = $1 RETURNING id', [idNum]);
}


