// components/Playlists.tsx
import { useRouter } from "next/navigation";
import PlaylistCard from "@/components/PlaylistCard";
import {Playlist} from "@/lib/types";


interface PlaylistsProps {
    playlists: Playlist[];
    onClick?: (playlist: Playlist, uri: string) => void;
    onDelete: (id: number) => void
}

export default function Playlists({ playlists, onClick, onDelete }: PlaylistsProps) {
    const router = useRouter();


    const handleClick = (playlist: Playlist, uri: string) => {
        console.log("Selected playlist:", playlist);
        if (onClick){
            onClick(playlist, uri);
        } else {
            router.push(uri);
        }

    };


    const allPlaylists = playlists.map((playlist) => (
        <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={handleClick}
            onDelete={onDelete}
        />
    ));

    return <div className="data-grid">{allPlaylists}</div>;
}