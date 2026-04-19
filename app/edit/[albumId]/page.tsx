// app/edit/[albumId]/page.tsx
"use client";

import { Album, Track } from "@/lib/types";
import {get} from  "@/lib/apiClient";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {useState, useEffect, Suspense} from "react";
export default function EditAlbumPage() {
    const router = useRouter();
    // Next.js params hook replaces useParams from react-router
const params = useParams();
const searchParams = useSearchParams();
const albumId = params?.albumId;
 const readOnly = searchParams?.get("readOnly") === "true"
// undefined under /new
const defaultAlbum: Album = {
    id: 0,
    title: "",
    artist: "",
    description: "",
    year: "0",
    image: "",
    tracks: [] as Track[],
};

// Type safe use of defaultAlbum to initialize state
// Rather than the ad hoc album object used previously, this ensures correct typing and calms TypeScript
    const [album, setAlbum] = useState(defaultAlbum);

// Load album only when editing
    useEffect(() => {
        if (!albumId) return; // creation mode

        (async () => {
            try {
                const url = `/albums?albumId=${albumId}`;
                console.log("Fetching URL:", `/api${url}`);
                const res = await get<Album[]>(`/albums?albumId=${albumId}`);
                console.log("API response:", res);
                if (res.length >0) {setAlbum(res[0]);}
            }catch (err){
                console.log ("Failed to fetch album", err)
            }
        })();
    }, [albumId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = albumId ? "PUT" : "POST";
        const url = albumId ? `/api/albums/${albumId}` : `/api/albums`;

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({...album, albumId}),
        });

        router.push("/");
    };

    const onChange =
        (key: string) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setAlbum((prev) => ({ ...prev, [key]: e.target.value }));

    return (
        <Suspense fallback={<p>Loading...</p>}>
        <main style={{ padding: "1rem" }}>
            <h1>{readOnly ? "View Album" : albumId ? "Edit Album" : "Create Album"}</h1>
            <form onSubmit={handleSubmit}>
                <input placeholder="Title" value={album.title} onChange={onChange("title")}/>
                <input placeholder="Artist" value={album.artist} onChange={onChange("artist")}/>
                <input placeholder="Year" value={album.year} onChange={onChange("year")}/>
                <textarea placeholder="Description" value={album.description} onChange={onChange("description")}/>
                <input placeholder="Image URL" value={album.image} onChange={onChange("image")}/>

                {readOnly ? (
                    <button type="button" onClick={() => router.push("/")}> Home </button>
                        ):(
                    <button type="submit">{albumId ? "Update" : "Save"}</button>

                )}

            </form>
        </main>
        </Suspense>
    );
}