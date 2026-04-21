import {Playlist} from "@/lib/types";
import * as playlistRepo from "@/src/lib/repositories/playlistRepository";
import * as albumRepo from "@/src/lib/repositories/albumRepository";

export async function getAllPlaylists(): Promise<Playlist[]> {
    const playlistData = await playlistRepo.findAllPlaylists();
    if (playlistData.length === 0) {
        return [];
    }

    const playlistIds = playlistData.map(p => p.id);
    const playlistsTracksData = await playlistRepo.findTracksByPlaylistIds(playlistIds)

   return playlistData.map (playlist => ({
        id: playlist.id,
        user_id: playlist.user_id,
        title: playlist.title,
        tracks: playlistsTracksData
            .filter(pt => pt.playlist_id === playlist.id)
            .map(pt => pt.track_id)
    }));
}


export async function getPlaylistsById(id:number): Promise<Playlist[]> {
    const playlistData = await playlistRepo.findPlaylistsByID(id);
    if (playlistData.length === 0) {
        return [];
    }

    const playlistIds = playlistData.map(p => p.id);
    const playlistsTracksData = await playlistRepo.findTracksByPlaylistIds(playlistIds)

    return playlistData.map (playlist => ({
        id: playlist.id,
        user_id: playlist.user_id,
        title: playlist.title,
        tracks: playlistsTracksData
            .filter(pt => pt.playlist_id === playlist.id)
            .map(pt => pt.track_id)
    }));
}


export async function getPlaylistsByUserId(id:number): Promise<Playlist[]> {
    const playlistData = await playlistRepo.findPlaylistsByUserID(id);
    if (playlistData.length === 0) {
        return [];
    }

    const playlistIds = playlistData.map(p => p.id);
    const playlistsTracksData = await playlistRepo.findTracksByPlaylistIds(playlistIds)

    return playlistData.map (playlist => ({
        id: playlist.id,
        user_id: playlist.user_id,
        title: playlist.title,
        tracks: playlistsTracksData
            .filter(pt => pt.playlist_id === playlist.id)
            .map(pt => pt.track_id)
    }));
}

export async function createPlaylist(
    playlistData: {title: string; user_id?: number}, tracks: number[]
) {
    return playlistRepo.createPlaylist(playlistData, tracks);
}


export async function updatePlaylist(
    playlistData: {playlistId: number, title: string; user_id?: number}, tracks: number[]
) {
    return playlistRepo.updatePlaylist(playlistData, tracks);
}

export async function deletePlaylistById(id: number) {
    return await playlistRepo.deletePlaylistById(id);
}