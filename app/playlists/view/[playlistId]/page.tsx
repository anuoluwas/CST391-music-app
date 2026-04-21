"use client";

import {Album, Playlist} from "@/lib/types";
import {get} from "@/lib/apiClient";
import {useParams, useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import {useSession} from "next-auth/react";
export default function ViewPlaylistPage() {
    const router = useRouter();
    const params = useParams();
    const playlistId = params?.playlistId;
    const[playlist, setPlaylist] = useState<Playlist>();
    const[albums, setAlbums] = useState<Album[]>([]);

    const {data: session} = useSession()

    useEffect(() => {
        if (session===null) {
            router.push("/")
        }
    }, [session]);


    useEffect(() => {
        if (!session) return;
        (async () => {
            try {

               const[playlist, albums] = await Promise.all([
                   get<Playlist[]>(`/playlists?playlistId=${playlistId}`),
                   get<Album[]>('/albums/')
               ]);

               if (session.user.role === 'admin' || playlist[0].user_id == session.user.id){
               setPlaylist(playlist[0]);
               setAlbums(albums);}
            }catch (err){
                console.log ("Failed to fetch playlist", err)
            }
        })();
    }, [playlistId]);

    if (!playlist) return <p>Loading...</p>
    const allTracks = albums.flatMap(album => album.tracks);

    return (
        <main style={{padding: "1rem"}}>
            <div className="card" style={{width: '18rem'}}>
                <div className="card-body">
                    <h2 className="card-title">{playlist.title}</h2>
                    <p className="card-text">Tracks:</p>
                    <ul>
                        {playlist.tracks.map(id => {
                            const track = allTracks.find(track => track.id === id);
                            return <li key={id}>{track?.title}</li>
                        })}
                    </ul>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push("/playlists")}
                    >
                        Back
                    </button>
                </div>
            </div>
        </main>
    );
}