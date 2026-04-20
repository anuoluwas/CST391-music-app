// components/SearchPlaylist.tsx
import SearchForm from "@/components/SearchForm";
import Playlists from "@/components/Playlists";
import {Playlist} from "@/lib/types";

interface SearchPlaylistProps {
    playlists: Playlist[];
    updateSearchResults: (searchTerm: string) => void;
    updateSinglePlaylist: (playlist: Playlist, uri: string) => void;
    onDelete: (id:number) => void
}

export default function SearchPlaylist({ playlists, updateSearchResults, updateSinglePlaylist, onDelete }: SearchPlaylistProps) {
    console.log("props with update single playlist", { playlists: playlists });

    return (
        <div className="container">
            <SearchForm onSubmit={updateSearchResults} />
            <Playlists playlists={playlists} onClick={updateSinglePlaylist} onDelete={onDelete}/>
        </div>
    );
}