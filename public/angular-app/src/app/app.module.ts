import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { AppRouter } from './app.routes';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumComponent } from './album/album.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AddingAlbumComponent } from './adding-album/adding-album.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AddSongComponent } from './add-song/add-song.component';
import { EditAlbumComponent } from './edit-album/edit-album.component';
import { EditSongComponent } from './edit-song/edit-song.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    AlbumsComponent,
    AlbumComponent,
    ErrorPageComponent,
    AddingAlbumComponent,
    RegisterComponent,
    LoginComponent,
    AddSongComponent,
    EditAlbumComponent,
    EditSongComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRouter),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
