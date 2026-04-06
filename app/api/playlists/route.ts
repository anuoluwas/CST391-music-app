import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import {Playlist, PlaylistTracks, Track} from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const pool = getPool();
        const url = new URL(request.url);
        const userIdParam = url.searchParams.get('userId');
        let playlistData: Playlist[];

        if (userIdParam) {
            const idNum = parseInt(userIdParam, 10);
            if (isNaN(idNum)) {
                return NextResponse.json({ error: 'Invalid userId parameter' }, { status: 400 });
            }
            const playlistRes = await pool.query('SELECT * FROM playlists WHERE user_id = $1', [idNum]);
            playlistData = playlistRes.rows;
        } else {
            const playlistRes = await pool.query('SELECT * FROM playlists');
            playlistData = playlistRes.rows;
        }

        if (playlistData.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const playlistIds = playlistData.map(p => p.id);
        const playlistTrackRes= await pool.query ('SELECT * FROM playlist_tracks WHERE playlist_id = ANY($1)'
            , [playlistIds]);
        const playlistsTracksData:PlaylistTracks[] = playlistTrackRes.rows;

        const playlistsWithTracks : Playlist[] = playlistData.map (playlist => ({
            id: playlist.id,
            user_id: playlist.user_id,
            title: playlist.title,
            tracks: playlistsTracksData
                .filter(pt => pt.playlist_id === playlist.id)
                .map(pt => pt.track_id)
        }));
        return NextResponse.json(playlistsWithTracks);
    }
    catch (error) {
        console.error('GET /api/playlists error:', error);
        return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, tracks} = body;
        if (!title || !tracks == null) {
            return NextResponse.json({ error: 'Missing required playlist fields' }, { status: 400 });
        }

        const pool = getPool();
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const userId = 1; //hardcoded user ID (admin)
            const playlistRes = await client.query(
                `INSERT INTO playlists (title, user_id) VALUES ($1, $2) RETURNING id`,
                [title, userId]
            );
            const playlistId: number = playlistRes.rows[0].id;

           const checkTracksRes = await client.query("SELECT id From tracks WHERE id = ANY($1)", [tracks]);
           const validTracksData: number[] = checkTracksRes.rows.map(r => r.id);

            for (const trackId of validTracksData) {
                await client.query('INSERT INTO playlist_tracks (playlist_id, track_id) VALUES ($1, $2)',
                    [playlistId, trackId]);
            }

            await client.query('COMMIT');
            return NextResponse.json({ id: playlistId }, { status: 201 });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('POST /api/playlists transaction error:', err);
            return NextResponse.json({ error: 'Error creating playlist' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('POST /api/playlists parse error:', error);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { playlistId, title, tracks } = body;
        if (playlistId == null) {
            return NextResponse.json({ error: 'Missing playlistId for update' }, { status: 400 });
        }

        const pool = getPool();
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            if (title) {
                await client.query(
                    `UPDATE playlists
                     SET title = $1
                     WHERE id = $2`,
                    [title, playlistId]
                );
            }

            if (tracks && tracks.length > 0) {
                const checkTracksRes = await client.query("SELECT id FROM tracks WHERE id = ANY ($1)", [tracks]);
                const validTracksData: number[] = checkTracksRes.rows.map(r => r.id);

                await client.query('DELETE FROM playlist_tracks WHERE playlist_id = $1', [playlistId]);
                for (const trackId of validTracksData) {
                    await client.query('INSERT INTO playlist_tracks (playlist_id, track_id) VALUES ($1, $2)',
                        [playlistId, trackId]);
                }
            }

            await client.query('COMMIT');
            return NextResponse.json({ message: 'Playlist updated successfully' });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('PUT /api/playlists transaction error:', err);
            return NextResponse.json({ error: 'Error updating playlist' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('PUT /api/playlists parse error:', error);
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const pool = getPool();
        const url = new URL(request.url);
        const playlistIdParam = url.searchParams.get('playlistId');
        let idNum: number;

        if (playlistIdParam) {
            idNum = parseInt(playlistIdParam, 10);
            if (isNaN(idNum)) {
                return NextResponse.json({error: 'Invalid playlistID parameter'}, {status: 400});
            }
        }
        else {
            return NextResponse.json({error: 'Missing required playlistId'}, {status: 400});
        }

        const result = await pool.query('DELETE FROM playlists WHERE id = $1 RETURNING id', [idNum]);

        if (result.rowCount === 0) {
            return NextResponse.json({error: 'Playlist not found'}, {status: 404});
        }
        return NextResponse.json({ message: `Playlist ${idNum} was deleted`});
    }  catch (error) {
        console.error(`DELETE /api/playlists/${request.url} error:`, error);
        return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
    }
}


