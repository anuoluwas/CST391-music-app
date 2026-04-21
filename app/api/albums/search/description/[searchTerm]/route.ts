import { NextRequest, NextResponse } from 'next/server';
import * as albumService from "@/src/lib/services/albumService";


export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ searchTerm: string }> }
) {
  const { searchTerm } = await context.params;
  try {

    const result = await albumService.getAlbumsByDescription(searchTerm);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`GET /api/albums/search/description/${searchTerm} error:`, error);
    return NextResponse.json({ error: 'Failed to search albums by description' }, { status: 500 });
  }
}
