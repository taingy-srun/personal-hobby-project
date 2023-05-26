import { AddSongComponent } from "./add-song/add-song.component";
import { AddingAlbumComponent } from "./add-album/add-album.component";
import { AlbumComponent } from "./album/album.component";
import { AlbumsComponent } from "./albums/albums.component";
import { EditAlbumComponent } from "./edit-album/edit-album.component";
import { EditSongComponent } from "./edit-song/edit-song.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";

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
        path: "albums/:albumId/newSong",
        component: AddSongComponent
    },
    {
        path: "albums/:albumId/edit",
        component: EditAlbumComponent
    },
    {
        path: "newAlbum",
        component: AddingAlbumComponent
    },
    {
        path: "albums/:albumId/songs/:songId/edit",
        component: EditSongComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "profile",
        component: ProfileComponent
    },
    {
        path: "**",
        component: ErrorPageComponent
    }
];