import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { of, Observable } from 'rxjs';
import {Diary} from './users';

const LINK = "https://dear-diary-angular.herokuapp.com"

@Injectable({
  providedIn: 'root'
})
export class DiaryService implements OnInit {

  diaries : Diary[] = [];
  pageSize =0;
  currentPage = 0;

  private diaryUpdate = new Subject<Diary[]>();


  diaryObservableListener(currentPage: number, pageSize: number) {

    console.log("Listener called from client");

    let query = "";

    if(currentPage == -1) {
     query = LINK;
    }

    else{

      this.pageSize = pageSize;
      this.currentPage = currentPage;

      query = LINK+`/?pageSize=${pageSize}&currentPage=${currentPage}`;
    }

    console.log("Query : ",query)

    this.http.get<Diary[]>(query)
    .subscribe(data => {
      console.log("Observed data : ", data)

      this.diaries = [];

      data.forEach(data=> {

        let creator = "-1";
        if(data.creator){
            creator = data.creator;
        }

        this.diaries.push({
          _id: data._id,
          title: data.title,
          description: data.description,
          imagePath: data.imagePath,
          creator: creator
        });
      })
      this.diaryUpdate.next([...this.diaries]);


    });
    return this.diaryUpdate.asObservable();
  }


  getDiarySize(): any {
    const query = LINK;

    return this.http.get<Diary[]>(query)

}

   diaryObservable = of(this.diaries);


  addDiary(title: string, description: string, image: File) {

    console.log("Request to add diary...");

    const diaryData = new FormData();

    diaryData.append("title", title);
    diaryData.append("description", description);
    diaryData.append("image", image, title);



      // let diary = {
      //   id: this.diaries.length+1,
      //   title: title,
      //   description: description
      // };

      //Sending a post request!
      this.http.post<{message:string, diaries: Diary}>(LINK+'/diary', diaryData)
          .subscribe(data => {
            console.log(
                "Recieved data from server : ",data
            );
              this.router.navigate(['/display'])
            // this.diaries.push({
            //   _id: data.diaries._id,
            //   title: title,
            //   description: description
            // })

            // this.diaryUpdate.next([...this.diaries]);
          });



      console.log("culprit", this.diaries);

  }

   getDiaries():  Diary[] {



    return [...this.diaries];


   }

   //http://localhost:3000/diary:id (delete)
   deleteDiary(id: string) {
      this.http.get(LINK+'/diary/'+id )
          .subscribe(data => {
            console.log("Successfully deleted data" + data);

            this.diaries = this.diaries.filter(data => data._id !== id)

            console.log("updated: ",this.diaries);
            // this.diaries = updatedDiary;
            this.diaryUpdate.next([...this.diaries]);

          })
   }

   updateDiary(id : string, title: string, description: string, image : File | string) {
      //http://localhost:3000/diary:id
      console.log("Updating diary...");

      const diaryData = new FormData();
      diaryData.append("id", id);
      diaryData.append("title", title);
      diaryData.append("description", description);
      diaryData.append("image", image, title);

      this.http.post(LINK+'/diary/'+id, diaryData).subscribe(data => {
        console.log(data);
        this.router.navigate(['/display'])
      })

   }

  constructor(private http: HttpClient, private router: Router) {

  }
  ngOnInit(): void {
    this.diaryUpdate.next([...this.diaries]);
  }
}
