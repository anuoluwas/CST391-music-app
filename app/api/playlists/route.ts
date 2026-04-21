import {NextRequest, NextResponse} from 'next/server';
import {getPool} from '@/lib/db';
import {Playlist} from '@/lib/types';
import * as playlistService from "@/src/lib/services/playlistService";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {

        const url = new URL(request.url);
        const userIdParam = url.searchParams.get('userId');
        const playlistIdParam = url.searchParams.get('playlistId');
        let playlistData: Playlist[];

        if (playlistIdParam) {
            const idNum = parseInt(playlistIdParam, 10);
            playlistData = await playlistService.getPlaylistsById(idNum);
        } else if (userIdParam) {
            const idNum = parseInt(userIdParam, 10);
            if (isNaN(idNum)) {
                return NextResponse.json({error: 'Invalid userId parameter'}, {status: 400});
            }
            playlistData = await playlistService.getPlaylistsByUserId(idNum);
        } else {
            playlistData = await playlistService.getAllPlaylists();
        }
        return NextResponse.json(playlistData);
    } catch (error) {
        console.error('GET /api/playlists error:', error);
        return NextResponse.json({error: 'Failed to fetch playlists'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {title, tracks, user_id} = body;
        if (!title || !tracks == null) {
            return NextResponse.json({error: 'Missing required playlist fields'}, {status: 400});
        }

        try {
            const playlistId = await playlistService.createPlaylist({title, user_id}, tracks)
            return NextResponse.json({id: playlistId}, {status: 201});
        } catch (err) {
            console.error('POST /api/playlists transaction error:', err);
            return NextResponse.json({error: 'Error creating playlist'}, {status: 500});
        }
    } catch (error) {
        console.error('POST /api/playlists parse error:', error);
        return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
    }
}

export async function PUT(request: NextRequest) {
    let body;
    try {
        body = await request.json();
    } catch (error) {
        console.error('PUT /api/playlists parse error:', error);
        return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
    }

    try {
        const {playlistId, title, tracks} = body;
        if (playlistId == null) {
            return NextResponse.json({error: 'Missing playlistId for update'}, {status: 400});
        }
        await playlistService.updatePlaylist({playlistId, title}, tracks)
        return NextResponse.json({message: 'Playlist updated successfully'});
    } catch (err) {

        console.error('PUT /api/playlists transaction error:', err);
        return NextResponse.json({error: 'Error updating playlist'}, {status: 500});

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
        } else {
            return NextResponse.json({error: 'Missing required playlistId'}, {status: 400});
        }

        const result = await playlistService.deletePlaylistById(idNum);

        if (result.rowCount === 0) {
            return NextResponse.json({error: 'Playlist not found'}, {status: 404});
        }
        return NextResponse.json({message: `Playlist ${idNum} was deleted`});
    } catch (error) {
        console.error(`DELETE /api/playlists/${request.url} error:`, error);
        return NextResponse.json({error: 'Failed to delete playlist'}, {status: 500});
    }
}


