import {Album, Track} from "@/lib/types";
import * as albumRepo from "@/src/lib/repositories/albumRepository";


export async function getAllAlbums(): Promise<Album[]> {
    const albumsData = await albumRepo.findAllAlbums();
    if (albumsData.length === 0) {
        return [];
    }

    const albumIds = albumsData.map(a => a.id);
    const tracksData = await albumRepo.findTracksByAlbumIds(albumIds)

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

    return albumsData.map(album => ({
        id: album.id,
        title: album.title,
        artist: album.artist,
        year: album.year,
        image: album.image,
        description: album.description,
        tracks: tracksByAlbum[album.id!] || [],
    }));
}
export async function getAlbumsByArtist(artistName: string): Promise<Album[]> {
    const albumsData = await albumRepo.findAlbumsByArtist(artistName);
    if (albumsData.length === 0) {
        return [];
    }

    const albumIds = albumsData.map(a => a.id);
    const tracksData = await albumRepo.findTracksByAlbumIds(albumIds)

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

    return albumsData.map(album => ({
        id: album.id,
        title: album.title,
        artist: album.artist,
        year: album.year,
        image: album.image,
        description: album.description,
        tracks: tracksByAlbum[album.id!] || [],
    }));
}
export async function getAlbumsByDescription(description: string): Promise<Album[]> {
    const albumsData = await albumRepo.findAlbumsByDescription(description);
    if (albumsData.length === 0) {
        return [];
    }

    const albumIds = albumsData.map(a => a.id);
    const tracksData = await albumRepo.findTracksByAlbumIds(albumIds)

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

    return albumsData.map(album => ({
        id: album.id,
        title: album.title,
        artist: album.artist,
        year: album.year,
        image: album.image,
        description: album.description,
        tracks: tracksByAlbum[album.id!] || [],
    }));
}

export async function getAlbumsById(id: number): Promise<Album[]> {
    const albumsData = await albumRepo.findAlbumsByID(id);
    if (albumsData.length === 0) {
        return [];
    }

    const albumIds = albumsData.map(a => a.id);
    const tracksData = await albumRepo.findTracksByAlbumIds(albumIds)

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

    return albumsData.map(album => ({
        id: album.id,
        title: album.title,
        artist: album.artist,
        year: album.year,
        image: album.image,
        description: album.description,
        tracks: tracksByAlbum[album.id!] || [],
    }));
}

export async function deleteAlbumById(id: number): Promise<void> {
    const rowCount = await albumRepo.deleteAlbumById(id);
    if (rowCount === 0) {
        throw new Error('Album not found');
    }
}

export async function updateAlbum (albumId: number, albumData: {title:string, artist:string, description?:string,
    year?:number, image?:string}, tracks: Track[]){
    await albumRepo.updateAlbum(albumId,albumData, tracks);
}


export async function createAlbum (albumData: {title:string, artist:string, description?:string,
    year?:number, image?:string}, tracks: Track[]){
    if (!albumData.title || !albumData.artist || albumData.year == null) {
        throw new Error ('Missing required album fields');
    }

   return albumRepo.createAlbum(albumData, Array.isArray(tracks) ? tracks: []);
}

