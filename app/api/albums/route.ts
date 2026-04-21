import { NextRequest, NextResponse } from 'next/server';
import { Album } from '@/lib/types';
import * as albumService from "@/src/lib/services/albumService";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const albumIdParam = url.searchParams.get('albumId');
    let albumsData: Album[];

    if (albumIdParam) {
      const idNum = parseInt(albumIdParam, 10);
      if (isNaN(idNum)) {
        return NextResponse.json({ error: 'Invalid albumId parameter' }, { status: 400 });
      }

      albumsData = await albumService.getAlbumsById(idNum);
    } else {
       albumsData = await albumService.getAllAlbums();
    }
    return NextResponse.json(albumsData);
  } catch (error) {
    console.error('GET /api/albums error:', error);
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, artist, year, description, image, tracks } = body;
    if (!title || !artist || year == null) {
      return NextResponse.json({ error: 'Missing required album fields' }, { status: 400 });
    }

    try {
      const albumId = await albumService.createAlbum({title, artist, description, year, image}, tracks)
      return NextResponse.json({ id: albumId }, { status: 201 });
    } catch (err) {
      console.error('POST /api/albums transaction error:', err);
      return NextResponse.json({ error: 'Error creating album' }, { status: 500 });
    }
  } catch (error) {
    console.error('POST /api/albums parse error:', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error('PUT /api/albums parse error:', error);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try{
    const { albumId, title, artist, year, description, image, tracks } = body;
    if (albumId == null) {
      return NextResponse.json({ error: 'Missing albumId for update' }, { status: 400 });
    }
    await albumService.updateAlbum(albumId, {title, artist, description, year, image}, tracks)
    return NextResponse.json({ message: 'Album updated successfully' });
  } catch (error) {
    console.error('PUT /api/albums transaction error:', error);
    return NextResponse.json({ error: 'Error updating album' }, { status: 500 });
  }
}
