import { Input, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/auth-service.service';
import { DiaryService } from 'src/app/diary.service';
import { Diary } from 'src/app/users';
import { PostService } from '../post.service';
import {Post} from '../posts.model';

@Component({
  selector: 'app-post-display',
  templateUrl: './post-display.component.html',
  styleUrls: ['./post-display.component.scss']
})
export class PostDisplayComponent implements OnInit, OnDestroy {

  tokenListener : Subscription;
  isTokenized = false;
  diaries : Diary[] = [];
  page = 1;
  isLoading = false;
  pageSize = 3;
  diarySize =0;
  userId = "";

  constructor(public diaryService: DiaryService, public authService : AuthServiceService) {
  }

  ngOnInit(): void {
      console.log("Calling listener...");

      this.userId = this.authService.getUserId();

      // this.diaries = this.diaryService.getDiaries();
      this.isLoading = true;
      this.diaryService.diaryObservableListener(this.page, this.pageSize)
          .subscribe((data)=>{
              console.log("Called from the component",data);
              this.isLoading = false;
              this.diaries = this.diaryService.getDiaries();
          })
      this.diaryService.getDiarySize()
                        .subscribe(data => {

                            this.diarySize = data.length;

      });

      this.tokenListener = this.authService.tokenListener()
      .subscribe(tokenObsv => {
          this.isTokenized = tokenObsv;
          console.log("is Tokenized? : ",this.isTokenized);
          this.userId = this.authService.getUserId();

      })

      this.isTokenized = this.authService.getTokenStatus();




  }

  ngOnDestroy(): void {
    this.tokenListener.unsubscribe();
  }

  onPageChange(event: number) {
    this.page=event;

    console.log("Changed to page : ",event);
    this.ngOnInit();

  }

  onDelete(id : string) {
    //Call service delete method here
    console.log("Calling delete service!");
    this.diaryService.deleteDiary(id);

  }

  onEdit(id: string) {
    //Change the route
    //Call onEdit() service
  }

}
