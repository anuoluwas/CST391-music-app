// components/AlbumList.tsx
import { useRouter } from "next/navigation";
import AlbumCard from "@/components/AlbumCard";
import { Album } from "@/lib/types";

interface AlbumListProps {
    albumList: Album[];
    onClick?: (album: Album, uri: string) => void;
}

export default function AlbumList({ albumList, onClick }: AlbumListProps) {
    const router = useRouter();

    const handleClick = (album: Album, uri: string) => {
        console.log("Selected album:", album);
        if (onClick){
            onClick(album, uri);
        } else {
            router.push(uri);
        }

    };

    const albums = albumList.map((album) => (
        <AlbumCard
            key={album.id}
            album={album}
            onClick={handleClick}
        />
    ));

    return <div className="container">{albums}</div>;
}