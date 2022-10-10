import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';

import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private basePath = '/profile-images';

  apiUrl = 'https://comp8967.herokuapp.com/api/user';

  signupUrl = this.apiUrl + '/create';
  signinUrl = this.apiUrl + '/login';
  getdataUrl = this.apiUrl + '/view/';
  savedataUrl = this.apiUrl + '/update/';
  errorData = {};
  redirectUrl: string | undefined;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage,
    private http: HttpClient) { }

  signup(data: any) {
    // headers.append('Content-Type', 'application/json');
    const req = new HttpRequest('POST', this.signupUrl, data);

    return this.http.request(req);
  }

  signin(data: any) {
    const req = new HttpRequest('POST', this.signinUrl, data);
    // return this.http.request(req)
    return this.http.post<any>(this.signinUrl, data)
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          console.log("user : ", localStorage.getItem('currentUser'))
        }
      }));
  }

  getUserData(): Observable<any> {
    let userData: any = localStorage.getItem('currentUser');
    let auth_token = JSON.parse(userData)['token']
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + auth_token
    })
    // var headers_object = new HttpHeaders().set("Authorization", "Bearer " + JSON.parse(userData)['token']);
    // const req = new HttpRequest('GET', this.getdataUrl + JSON.parse(userData)['result']['email'], { headers: headers });

    // return this.http.request(req);
    // return this.http.request(req)
    return this.http.get<any>(this.getdataUrl + JSON.parse(userData)['result']['email'], { headers: headers })


  }

  saveUserData(data:any) {
    let userData: any = localStorage.getItem('currentUser');
    let auth_token = JSON.parse(userData)['token']
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + auth_token
    })

    return this.http.put<any>(this.savedataUrl + JSON.parse(userData)['result']['email'], data ,{ headers: headers })
  }

  isLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  getAuthorizationToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.token;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }


}
