// app/new/page.tsx

// Re-export the default export from the edit route
import {Suspense} from "react";
import EditPlaylistPage from "@/app/playlists/edit/[playlistId]/page";

export default function NewPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <EditPlaylistPage />
        </Suspense>
    )
}