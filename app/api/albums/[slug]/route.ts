// app\api\albums\[slug]\route.ts
import {NextRequest, NextResponse} from 'next/server';
import * as albumService from "@/src/lib/services/albumService";


export const runtime = 'nodejs';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const {slug: artistName} = await context.params;

    try {
        const result = await albumService.getAlbumsByArtist(artistName);
        return NextResponse.json(result);
    } catch (error) {
        console.error(`GET /api/albums/${artistName} error:`, error);
        return NextResponse.json({error: 'Failed to fetch albums by artist'}, {status: 500});
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    const {slug} = await context.params;
    const id = parseInt(slug, 10);
    if (isNaN(id)) {
        return NextResponse.json({error: 'Invalid album ID'}, {status: 400});
    }
    try {
        await albumService.deleteAlbumById(id)
        return NextResponse.json({message: `Album ${id} deleted`});
    } catch (error) {
        if (error instanceof Error && error.message === 'Album not found') {
            return NextResponse.json({error: 'Album not found'}, {status: 404});
        }
        console.error(`DELETE /api/albums/${id} error:`, error);
        return NextResponse.json({error: 'Failed to delete album'}, {status: 500});
    }
}

export async function PUT(request: NextRequest,
                          context: { params: Promise<{ slug: string }> }) {
    {
        const {slug} = await context.params;
        const albumId = parseInt(slug);
        if (albumId == null) {
            return NextResponse.json({error: 'Invalid albumId'}, {status: 400});
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
        }

        const {title, artist, year, description, image, tracks} = body;

        try {
            await albumService.updateAlbum(albumId, {title, artist, year, description, image}, tracks)
            return NextResponse.json({message: 'Album updated successfully'});
        } catch (error) {
            console.error('PUT /api/albums parse error:', error);
            return NextResponse.json({error: 'Error updating album'}, {status: 500});
        }
    }
}

