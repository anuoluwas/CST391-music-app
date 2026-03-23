export interface Track {
    id: number;
    title: string;
    number: string;
    video: string;
    lyrics: string;
}


export interface Album {
    id: number,
    title: string,
    artist: string,
    description: string
    year: string,
    image: string,
    tracks: Track[]
}

export interface Artist{
    artist: string;
}

export interface Playlist {
    id: number;
    user_id: number;
    title: string;
    tracks: number[]
}

export interface PlaylistTracks{
    id: number;
    playlist_id:number,
    track_id: number
}



