
// app\api\albums\[slug]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { Album, Track } from '@/lib/types';


export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug: artistName } = await context.params;

  try {
    const pool = getPool();
    const albumsRes = await pool.query(
      'SELECT * FROM albums WHERE LOWER(artist) = LOWER($1)',
      [artistName]
    );
    const albumsData = albumsRes.rows;
    if (albumsData.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const albumIds = albumsData.map(a => a.id);
    const tracksRes = await pool.query(
      'SELECT * FROM tracks WHERE album_id = ANY($1) ORDER BY number',
      [albumIds]
    );
    const tracksData = tracksRes.rows;

    const tracksByAlbum: Record<number, Track[]> = {};
    for (const track of tracksData) {
      (tracksByAlbum[track.album_id!] ||= []).push({
        id: track.id,
        number: track.number,
        title: track.title,
        lyrics: track.lyrics,
        video: track.video_url,
      });
    }

    const result: Album[] = albumsData.map(album => ({
      id: album.id,
      title: album.title,
      artist: album.artist,
      year: album.year,
      image: album.image,
      description: album.description,
      tracks: tracksByAlbum[album.id!] || [],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(`GET /api/albums/${artistName} error:`, error);
    return NextResponse.json({ error: 'Failed to fetch albums by artist' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const id = parseInt(slug, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
  }
  try {
    const pool = getPool();
    const del = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);
    if (del.rowCount === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Album ${id} deleted` });
  } catch (error) {
    console.error(`DELETE /api/albums/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest,
                          context: { params: Promise<{ slug: string }> }) {
  {
    const {slug} =  await context.params;
    const albumId = parseInt(slug);
    if (albumId == null) {
      return NextResponse.json({error: 'Invalid albumId'}, {status: 400});
    }

    try {
      const body = await request.json();
      const {title, artist, year, description, image, tracks} = body;

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
            [title, artist, description ?? null, year, image ?? null, albumId]
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
        return NextResponse.json({message: 'Album updated successfully'});
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('PUT /api/albums transaction error:', err);
        return NextResponse.json({error: 'Error updating album'}, {status: 500});
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('PUT /api/albums parse error:', error);
      return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
    }
  }
}

