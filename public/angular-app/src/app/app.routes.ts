import { AddingAlbumComponent } from "./adding-album/adding-album.component";
import { AlbumComponent } from "./album/album.component";
import { AlbumsComponent } from "./albums/albums.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { HomeComponent } from "./home/home.component";

export const AppRouter = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "albums",
        component: AlbumsComponent
    },
    {
        path: "albums/:albumId",
        component: AlbumComponent
    },
    {
        path: "newAlbum",
        component: AddingAlbumComponent
    },
    {
        path: "**",
        component: ErrorPageComponent
    }
];