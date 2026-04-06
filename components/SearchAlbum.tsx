// components/SearchAlbum.tsx
import SearchForm from "@/components/SearchForm";
import AlbumList from "@/components/AlbumList";
import { Album } from "@/lib/types";

interface SearchAlbumProps {
    albumList: Album[];
    updateSearchResults: (searchTerm: string) => void;
    updateSingleAlbum: (album: Album, uri: string) => void;
}

export default function SearchAlbum({ albumList, updateSearchResults, updateSingleAlbum }: SearchAlbumProps) {
    console.log("props with update single album", { albumList });

    return (
        <div className="container">
            <SearchForm onSubmit={updateSearchResults} />
            <AlbumList albumList={albumList} onClick={updateSingleAlbum} />
        </div>
    );
}