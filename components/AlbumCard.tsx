// A component to display individual album info, not included in Next.js routing
// app/components/AlbumCard.tsx
// Define the shape of props expected by the AlbumCard component.
// This interface acts as a contract, ensuring that any use of AlbumCard

import { Album } from "@/lib/types";
import {JSX} from "react";
import {useSession} from "next-auth/react";

// must provide exactly these props with the correct types.
interface AlbumCardProps {

    album: Album;

    onClick: (album: Album, uri: string) => void;
}

export default function AlbumCard({ album, onClick }: AlbumCardProps) {
    const { data: session } = useSession();
    const isLoggedIn = session?.user?.role === "user" || session?.user?.role === "admin"
    const isAdmin = session?.user?.role === "admin";
    return(
    <div className="card" style={{width: '18rem'}}>
        <img src={album.image} className="card-img-top" alt={album.title}/>
        <div className="card-body">
            <h5 className="card-title">{album.title}</h5>
            <p className="card-text">{album.description}</p>
            {isLoggedIn ?
            <button
                className="btn btn-primary"
                onClick={() => onClick(album, `/edit/${album.id}?readOnly=true`)}
            >
                View
            </button> : null}
            {isLoggedIn && isAdmin ?
            <button
                className="btn btn-secondary"
                onClick={() => onClick(album, `/edit/${album.id}`)}
            >
                Edit
            </button> : null}
        </div>
    </div>
    )
}