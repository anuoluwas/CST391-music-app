import { NextRequest, NextResponse } from 'next/server';
import * as artistService from "@/src/lib/services/artistService";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const artists = await artistService.getArtists();
    return NextResponse.json(artists);
  } catch (error) {
    console.error('GET /api/artists error:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}
