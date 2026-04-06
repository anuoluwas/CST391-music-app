// app/new/page.tsx

// Re-export the default export from the edit route
import {Suspense} from "react";
import EditAlbumPage from "@/app/edit/[albumId]/page";

export default function NewPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <EditAlbumPage />
        </Suspense>
    )
}