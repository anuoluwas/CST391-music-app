"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Album} from "@/lib/types";
import {get} from "@/lib/apiClient";
import SearchAlbum from "@/components/SearchAlbum";
import {useSession} from "next-auth/react";


export default function Page() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [albumList, setAlbumList] = useState<Album[]>([]);
    const [error, setError] = useState<string | null>(null);
    let router = useRouter();

    const {data: session} = useSession()

    useEffect(() => {
        if (session===null) {
            router.push("/")
        }
    }, [session]);

    const loadAlbums = async () => {
        try {
            const response = await get<Album[]>(`/albums/`);
            //const data = await response.json();
            console.log("Fetched albums:", response);
            setAlbumList(response);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    //Setup initialization callback
    useEffect(() => {
        //Update album list
        loadAlbums();
    }, []);

    const updateSearchResults = (phrase: string) => {
        console.log("phrase is " + phrase);
        setSearchPhrase(phrase);
    };

    const updateSingleAlbum = (album: Album, uri: string) => {
        console.log("updating single album", album);
        router.push(uri);
    };

    const renderedList = albumList.filter((album) => {
        if ((album.description ?? "")
            .toLowerCase()
            .includes(searchPhrase.toLowerCase()) || searchPhrase === "") {
            return true;
        }
        return false;
    });

    const onEditAlbum = () => {
        loadAlbums();
        router.push("/");
    };

    return (<main>
            <h1>Album List (without debug view)</h1>
            {albumList.length === 0 && <p>Loading albums...</p>}
            {albumList.length > 0 && (<SearchAlbum albumList={renderedList}
                                                   updateSearchResults={updateSearchResults}
                                                   updateSingleAlbum={updateSingleAlbum}
            />)}


        </main>);
}

