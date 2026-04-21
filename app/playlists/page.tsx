"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Playlist} from "@/lib/types";
import SearchPlaylist from "@/components/SearchPlaylist";
import {get, del} from "@/lib/apiClient";
import {useSession} from "next-auth/react";

export default function Page() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null);
    const {data: session} = useSession();

    let router = useRouter();

    useEffect(() => {
        if (session===null) {
            router.push("/")
        }
    }, [session]);

    const loadPlaylists = async () => {
        try {
           const url = session?.user?.role === "admin"
            ? '/playlists' :
               `/playlists?userId=${session?.user?.id}`;

           const response = await get<Playlist[]>(url);
           setPlaylists(response);

        } catch (err) {
            setError((err as Error).message);
        }
    };

    //Setup initialization callback
    useEffect(() => {
        if (!session){ return;}
        //Update playlist
        loadPlaylists();
    }, []);

    const updateSearchResults = (phrase: string) => {
        console.log("phrase is " + phrase);
        setSearchPhrase(phrase);
    };

    const updateSinglePlaylist = (playlist: Playlist, uri: string) => {
        console.log("updating single playlist", playlist);
        router.push(uri);
    };

    const renderedList = playlists.filter((playlist) => {
        if ((playlist.title ?? "")
            .toLowerCase()
            .includes(searchPhrase.toLowerCase()) || searchPhrase === "") {
            return true;
        }
        return false;
    });

    const handleDelete = async  (id: number) => {
        if (deletingId) return;
        setDeletingId(id);
        try{
        await del(`/playlists?playlistId=${id}`);
        setPlaylists(prev => prev.filter(p=>p.id != id));
        }catch(error){
            console.error('Error deleting playlist', error)
        }finally {
            setDeletingId(null);
        }
    }

    return (<main>
        <h1>Playlists</h1>
        {playlists.length === 0 && <p>Loading playlists...</p>}
        {playlists.length > 0 && (<SearchPlaylist playlists={renderedList}
                                                  updateSearchResults={updateSearchResults}
                                                  updateSinglePlaylist={updateSinglePlaylist}
                                                  onDelete={handleDelete}
        />)}
    </main>);
}