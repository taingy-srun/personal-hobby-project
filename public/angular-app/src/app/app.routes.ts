import { AlbumComponent } from "./album/album.component";
import { AlbumsComponent } from "./albums/albums.component";
import { HomeComponent } from "./home/home.component";

export const AppRouter = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "ablums",
        component: AlbumsComponent
    },
    {
        path: "ablums/:albumId",
        component: AlbumComponent
    }
];