"use client";

import {Playlist} from "@/lib/types";
import {get} from  "@/lib/apiClient";
import {useParams, useRouter} from "next/navigation";
import {useState, useEffect, Suspense} from "react";
import {useSession} from "next-auth/react";
export default function EditPlaylistPage() {
    const router = useRouter();
    const params = useParams();
    const playlistId = params?.playlistId;

    const defaultPlaylist: Playlist = {
        id: 0,
        user_id: 0,
        title: "",
        tracks: [],
    };

    const [playlist, setPlaylist] = useState(defaultPlaylist);
    const [trackInput, setTrackInput] = useState("");
    const {data: session} = useSession()

    useEffect(() => {
        if (session===null) {
            router.push("/playlists")
        }
    }, [session]);

    useEffect(() => {
        if (!playlistId) return;

        (async () => {
            try {
                const res = await get<Playlist[]>(`/playlists?playlistId=${playlistId}`);
                console.log("API response:", res);
                if (res.length >0) {
                    setPlaylist(res[0]);
                    setTrackInput(res[0].tracks.join(","))
                }
            }catch (err){
                console.log ("Failed to fetch playlist", err)
            }
        })();
    }, [playlistId]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = playlistId ? "PUT" : "POST";
        const tracks = trackInput.split(",").map(id => parseInt(id.trim())).filter(id => id > 0);
        await fetch('/api/playlists', {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...playlist, tracks, playlistId, user_id: session?.user?.id}),
        });

        router.push("/playlists");
    };

    const onChange =
        (key: string) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setPlaylist((prev) => ({ ...prev, [key]: e.target.value }));

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <main style={{ padding: "1rem" }}>
                <h1>{playlistId ? "Edit Playlist" : "Create Playlist"}</h1>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Title" value={playlist.title} onChange={onChange("title")}/>
                    <input size={50} placeholder="Track IDs seperated by comma"
                           value={trackInput}
                           onChange={e => setTrackInput(e.target.value)}
                    />
                    <button type="submit">{playlistId ? "Update" : "Save"}</button>
                    <button type="button" onClick={() => router.push("/playlists")}> Cancel</button>

                </form>
            </main>
        </Suspense>
    );
}