// A component to display individual playlist info
// app/components/Playlist.tsx

import {Playlist} from "@/lib/types";
import {useSession} from "next-auth/react";
import {del} from "@/lib/apiClient";


interface PlaylistProps {

    playlist: Playlist;
    onClick: (playlist: Playlist, uri: string) => void;
    onDelete: (id: number) => void
    deletingId: number| null;
}

export default function PlaylistCard({ playlist, onClick, onDelete, deletingId }: PlaylistProps) {
    const { data: session } = useSession();
    const isLoggedIn = session?.user?.role === "user" || session?.user?.role === "admin"
    const isAdmin = session?.user?.role === "admin";

    const handleDelete = async () => {
        await del(`/playlists?playlistId=${playlist.id}`);
        onDelete(playlist.id)
    };
    return(
        <div className="card" style={{width: '18rem'}}>
            <div className="card-body">
                <h5 className="card-title">{playlist.title}</h5>
                <p className="card-text">Number of tracks: {playlist.tracks.length}</p>
                {isLoggedIn ?
                    <button
                        className="btn btn-primary"
                        onClick={() => onClick(playlist, `/playlists/view/${playlist.id}`)}
                    >
                        View
                    </button> : null}
                {isLoggedIn ?
                    <button
                        className="btn btn-secondary"
                        onClick={() => onClick(playlist, `playlists/edit/${playlist.id}`)}
                    >
                        Edit
                    </button> : null}
                {isAdmin ?
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                        disabled={deletingId === playlist.id}
                    >
                        Delete
                    </button> : null}
            </div>
        </div>
    )
}