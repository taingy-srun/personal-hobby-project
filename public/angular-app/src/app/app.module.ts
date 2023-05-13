import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

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
import { ReactiveFormsModule } from '@angular/forms';

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
    AddingAlbumComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRouter),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
