import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from './auth-data.model';

const LINK = "https://dear-diary-angular.herokuapp.com"

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private http: HttpClient, private router: Router) { }

  tokenObserver = new Subject<boolean>();

  tokenListener() {

    return this.tokenObserver.asObservable();

  }

  isTokenized = false;
  token :string ="";
  user : User;

  getToken(): string{
    return this.token;
  }

  getTokenStatus() {
    return this.isTokenized;
  }

  logout() {
    this.token = "";
    this.tokenObserver.next(false);
    this.isTokenized = false;
    this.router.navigate(['/login']);
    this.clearAuthData();
    this.userId = null;
    clearTimeout(this.tokenTimer);
  }


  createUser(email: string, password: string) {

    this.user = {
      email: email,
      password: password
    }

    this.http.post(LINK+'/user/signup', this.user)
          .subscribe(res =>{
            console.log(res);
            this.router.navigate(['/login']);
          })
  }

  userId = "";

  getUserId() {
    return this.userId;
  }

  login(email: string, password: string) {

    const authData : User = {email: email, password: password}

    this.http.post<{token: string, userId: string}>(LINK+'/user/login', authData)
      .subscribe(result =>{
        console.log(result)
        this.token = result.token;
        this.tokenObserver.next(true);
        this.isTokenized = true;

        this.setAuthTimer(3600)
        this.userId = result.userId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + 3600*1000);

        console.log(expirationDate);


        this.saveAuthData(this.token, expirationDate, this.userId)
        this.router.navigate(['/create']);
      })

  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expirationDate', expirationDate.toISOString());
      localStorage.setItem('userId', userId);

  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')

    localStorage.removeItem('expirationDate')
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const expirationDate = localStorage.getItem('expirationDate');

    if(!token || !expirationDate){
      return null;
    }

    return {token: token, expirationDate: new Date(expirationDate), userId: userId}

  }

  autoAuthUser() {
    console.log("Checking logged in info...");

    const authInformation = this.getAuthData();

    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      console.log("Hey the user is already logged in!");

      this.token = authInformation.token;
      this.isTokenized = true;
      this.tokenObserver.next(true);
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000)
    }

  }

  tokenTimer: any;

  private setAuthTimer(duration : number) {

    console.log("Setting timmer : ", duration);


    this.tokenTimer = setTimeout(()=> {
        this.logout();
    }, duration * 1000)
  }

}
