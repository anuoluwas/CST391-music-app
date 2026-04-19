"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Album} from "@/lib/types";
import {get} from "@/lib/apiClient";
import AlbumCard from "@/components/AlbumCard";
import AlbumList from "@/components/AlbumList";
import SearchAlbum from "@/components/SearchAlbum";


export default function Page() {
    const [searchPhrase, setSearchPhrase] = useState("");
    const [albumList, setAlbumList] = useState<Album[]>([]);
    const [error, setError] = useState<string | null>(null);
    //const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);

    let router = useRouter();

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
        //console.log("Update Single Album = ", albumId);
        //const indexNumber = albumList.findIndex((a) => a.id === albumId);
        // setCurrentlySelectedAlbumId(indexNumber);
        //const path = `${uri}${indexNumber}`;
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
            <h1>Anuoluwa Album List(without debug view)</h1>
            {/*      <p>This JSON data is rendered directly from the API response</p>*/}
            {/*      {error ? (*/}
            {/*          <p style={{color: "red"}}>Error: {error}</p>*/}
            {/*      ) : (*/}
            {/*          <>*/}
            {/*      <pre*/}
            {/*          style={{*/}
            {/*              backgroundColor: "#f4f4f4",*/}
            {/*              padding: "1rem",*/}
            {/*              borderRadius: "8px",*/}
            {/*              overflow: "auto",*/}
            {/*              color: "#111",*/}
            {/*              fontSize: "0.9rem",*/}
            {/*              lineHeight: "1.4",*/}
            {/*          }}*/}
            {/*      >*/}
            {/*  {albumList.length > 0 && JSON.stringify(albumList, null, 2)}{" "}*/}
            {/*</pre>*/}
            {albumList.length === 0 && <p>Loading albums...</p>}
            {albumList.length > 0 && (<SearchAlbum albumList={renderedList}
                                                   updateSearchResults={updateSearchResults}
                                                   updateSingleAlbum={updateSingleAlbum}
            />)}


        </main>);
}

