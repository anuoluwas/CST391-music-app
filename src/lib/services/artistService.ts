import * as artistRepo from "@/src/lib/repositories/artistRepository";
import {Album} from "@/lib/types";

export async function getArtists(){
    const rows = await artistRepo.findArtists();
    return rows.map((r: Album) => r.artist);
}