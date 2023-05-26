import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

import { AuthenticationService } from '../authentication.service';
import { Album } from './data/album-model';
import { AlbumsDataService } from './data/albums-data.service';


@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent {

  labelTitle = environment.label_title;
  labelReleasedDate = environment.label_released_date;
  labelActions = environment.label_actions;
  labelBtnBack = environment.label_btn_back;
  labelBtnEdit = environment.label_btn_edit;
  labelBtnDelete = environment.label_btn_delete;
  labelAddNewAlbum = environment.label_add_new_album;
  labelListOfAlbum = environment.label_album_list;
  labelBtnPrevious = environment.label_btn_previous;
  labelBtnNext = environment.label_btn_next;
  labelSearch = environment.label_search;

  offset: number = environment.offset;
  count: number = environment.count;

  albums!: Album[];

  searchForm!: FormGroup;
  title: string = "";

  constructor(private _albumService: AlbumsDataService, private _authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.initFrom();
    this.getAlbums();
  }

  public getAlbums() {
    this._albumService.getAll(this.offset, this.count, this.title).subscribe({
      next: (albums) => {
        this.albums = albums;
      },
      error: (err) => {
        console.log(err);
      }
  });
  }

  public getNextPage() {
    this.setNextPageValue();
    this.getAlbums();
  }

  public getPreviousPage() {
    this.setPreviousPageValue();
    this.getAlbums();
  }

  private setNextPageValue() {
    this.offset += this.count;
  }

  private setPreviousPageValue() {   
    if (this.offset > 0) {
      this.offset -= this.count;
    } else {
      this.offset = 0;
    }

    if (this.offset < 0) {
      this.offset = 0;
    }
  }

  public disablePreviousButton():boolean {
      return this.offset == 0;
  }

  public disableNextButton():boolean {
    if (!this.albums) {
      return false;
    }
    return this.albums.length < this.count;
  }

  public delete(id: string) {
    this._albumService.deleteOne(id).subscribe({
      next: (deleted) => {
        this.ngOnInit();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private initFrom() {
    this.searchForm = new FormGroup({
      title: new FormControl()
    });
  }

  public search(){
    this.title = this.searchForm.value.title;
    this.getAlbums();
  }

  public isLoggedIn() {
    return this._authenticationService.isLoggedIn();
  }
}
