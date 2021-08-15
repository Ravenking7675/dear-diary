import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { FetchService } from 'src/app/fetch.service';
import { PostService } from '../post.service';
import {Post} from '../posts.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DiaryService } from 'src/app/diary.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  filePath: string = null;
  isEdit = false;
  isReal = true;
  isLoading = false;
  showImage = false;
  id = "";

  diaryForm!: FormGroup;

  onSubmit() {

    if(this.isEdit){
      console.log("We are going to update the value now!", this.diaryForm.value.description);
      this.diaryService.updateDiary(this.id, this.diaryForm.value.title, this.diaryForm.value.description, this.diaryForm.value.image );

    }
    else{

          console.log("Save Diary button Clicked!");
          // console.log(this.diaryForm.value.title);
          this.diaryService.addDiary(this.diaryForm.value.title,this.diaryForm.value.description, this.diaryForm.value.image )

          this.diaryForm.reset();


    }

  }

  constructor(private fb: FormBuilder, private diaryService : DiaryService,  private route: ActivatedRoute) {


  }

  checkId(id: string) {
    this.isLoading = true;
    this.isReal = false;

    this.diaryService.diaryObservableListener(-1,-1)
          .subscribe((data)=>{

            // console.log("I am checking the id now : ",data);
            let k = false;
            data.forEach(diary => {
            console.log(diary);

            if(diary._id == id){
              k = true;

            }
      })

            if(!k) {
              console.log("Page not found!");
              this.isReal = false;
              this.isLoading = false;
            }
            if(k) {
              this.isLoading = false;
              console.log("Page found!");
              this.isReal = true;

              let editT = (data.filter(data=> data._id === id))[0].title;
              let editD = (data.filter(data=> data._id === id))[0].description;
              let editI = (data.filter(data=> data._id === id))[0].imagePath;

              this.diaryForm.get('title').setValue(editT);
              this.diaryForm.get('description').setValue(editD);
              this.diaryForm.get('image').setValue(editI);
              this.showImage = true;
              this.filePath = editI;
              // console.log((data.filter(data=> data._id === id))[0].title);


            }

    })
  }

  ngOnInit(): void {


    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id == null) {
      this.isEdit = false;
      console.log("We are in create mode.");


    }
    else{
      this.isEdit = true;
      console.log("We are in the edit mode.");
      this.checkId(this.id);
    }



    // this.checkId(id);

    this.diaryForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(4)
      ]
      ],
      description: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      image: [null]
    });

  }

  imagePreview(e : Event) {
    const file = (e.target as HTMLInputElement).files[0];

    this.diaryForm.patchValue({
      image: file
    });

    this.diaryForm.get('image').updateValueAndValidity()

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
      this.showImage = true;
    }
    reader.readAsDataURL(file)

    console.log("File : ", file.name);

  }

  get title() { return this.diaryForm.get('title'); }
  get description() { return this.diaryForm.get('title'); }
  get image() { return this.diaryForm.get('image'); }

}
