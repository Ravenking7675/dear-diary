import {Post} from './posts.model'
import {Injectable, OnInit} from '@angular/core'
import {Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService implements OnInit{
  private posts : Post[] = [];
  private postUpdate = new Subject<Post[]>();

  constructor(private http: HttpClient){
      this.http.get('localhost:5000/').toPromise().then(data => {
        console.log(data);

      })
  }



  ngOnInit() {

  }

  getPostUpdateListener() {
    return this.postUpdate.asObservable();
  }

  getPost() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post = {title: title, content: content};
    this.posts.push(post);
    this.postUpdate.next([...this.posts])
    console.log(this.posts, "This is from service");

  }
}
