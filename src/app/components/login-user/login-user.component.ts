import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';
import { RegistrationService } from 'src/app/services/registration.service';
import { FileUploader } from 'ng2-file-upload';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse, HttpEventType, HttpHeaderResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';

import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  selectedFiles?: FileList;
  currentFileUpload!: FileUpload;
  percentage?: number;
  size = 64;

  editmode = true;
  hasDragOver = true;
  uploader!: FileUploader;

  @ViewChild('fileInput') el: ElementRef | undefined;
  // imageUrl: any = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
  imageUrl: any = "../../assets/avatar.png"
  editFile: boolean = true;
  removeUpload: boolean = false;

  registrationForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    dob: ['', Validators.required],
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    file: null!
  })

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  private basePath = '/profile-images';

  constructor(public registrationService: RegistrationService, public fb: FormBuilder,
    private cd: ChangeDetectorRef, private db: AngularFireDatabase, private storage: AngularFireStorage,
    public afAuth: AngularFireAuth, private router: Router) {
    // this.currentFileUpload = new FileUpload(<File>this.imageUrl)
    // console.log("in constructor :",this.currentFileUpload)

  }

  uploadFile(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    console.log("in upload file : ", event.target.files)
    let file = event.target.files[0];
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.registrationForm.patchValue({
          file: reader.result
        });
        this.registrationForm.markAsUntouched();
        this.editFile = false;
        this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  ngOnInit(): void {
  }

  signin() {
    console.log(this.loginForm.value, "\n", this.loginForm.valid)
    if (this.loginForm.valid) {
      const jsonData = {
        "email": this.loginForm.controls['email'].value,
        "password": this.loginForm.controls['password'].value
      }

      console.log("login json data : ", jsonData)

      this.registrationService.signin(jsonData).subscribe((response: any) => {
        console.log("response :", response)
        if (this.registrationService.isLoggedIn()) {
          // const redirect = this.registrationService.redirectUrl ? this.registrationService.redirectUrl : '/to-do';
          this.router.navigate(['/to-do']);
        } else {
          console.log('Username or password is incorrect.')
        }
      },
        error => {
          console.log("error : ", error);
          // alert("Incorrect Username or password")
          // if ((<HttpErrorResponse>error).error.message == 'User already exists') {
          //   alert("User already exists");
          //   // this.ngOnInit();
          // }
        })
    }
  }

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: firebase.auth.AuthProvider | GoogleAuthProvider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result: any) => {
        console.log('You have been successfully logged in!', result);
        const jsonData = {
          "email": result.additionalUserInfo?.profile['email'],
          "password": "google",
          "lastName": result.additionalUserInfo?.profile['family_name'],
          "firstName": result.additionalUserInfo?.profile['given_name']
        }

        this.registrationService.signin(jsonData).subscribe((response: any) => {
          console.log("response :", response)
          if (this.registrationService.isLoggedIn()) {
            // const redirect = this.registrationService.redirectUrl ? this.registrationService.redirectUrl : '/to-do';
            this.router.navigate(['/to-do']);
          } else {
            console.log('Username or password is incorrect.')
          }
        },
          error => {
            console.log("error : ", error);
            // if ((<HttpErrorResponse>error).error.message == 'User already exists') {
            //   alert("User already exists");
            //   // this.ngOnInit();
            // }
          })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signup() {
    if (this.registrationForm.valid) {
      console.log("form :", this.registrationForm.value);
      let downloadURL: any;
      if (this.selectedFiles) {
        const file = this.selectedFiles?.item(0);
        this.selectedFiles = undefined;
        // console.log("this.selectedFiles : ",this.selectedFiles, file);
        this.currentFileUpload = new FileUpload(<File>file);
        // console.log("in signup : ",this.currentFileUpload)  
        const filePath = `${this.basePath}/${this.currentFileUpload.file.name}`;
        const storageRef = this.storage.ref(filePath);
        const uploadTask = this.storage.upload(filePath, this.currentFileUpload.file);

        console.log("upload Task : ", uploadTask);
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(downloadURL => {
              downloadURL = downloadURL;
              // fileUpload.name = fileUpload.file.name;
              // console.log("downloadURL : ", downloadURL)
              // this.saveFileData(fileUpload);
              console.log("download url : ", downloadURL);
              const jsonData = {
                "firstName": this.registrationForm.controls['firstname'].value,
                "lastName": this.registrationForm.controls['lastname'].value,
                "email": this.registrationForm.controls['email'].value,
                "dob": this.registrationForm.controls['dob'].value,
                "password": this.registrationForm.controls['password'].value,
                // "signInType": "google",
                "imageURL": downloadURL
              }

              console.log("json data : ", jsonData)

              this.registrationService.signup(jsonData).subscribe((response: any) => {
                // console.log("response :", response.body.message)
                if (response.body != undefined && response.body.message == 'User Created Successfully') {
                  window.location.reload();
                }

              },
                error => {
                  console.log("error : ", error);
                  if ((<HttpErrorResponse>error).error.message == 'User already exists') {
                    alert("User already exists");
                    // this.ngOnInit();
                  }
                })
            });

          })
        ).subscribe();

        // if(downloadURL){

        // }
      }
      else {
        // alert("Please select profile picture");
        const jsonData = {
          "firstName": this.registrationForm.controls['firstname'].value,
          "lastName": this.registrationForm.controls['lastname'].value,
          "email": this.registrationForm.controls['email'].value,
          "dob": this.registrationForm.controls['dob'].value,
          "password": this.registrationForm.controls['password'].value,
          // "signInType": "google"
        }

        console.log("json data : ", jsonData)

        this.registrationService.signup(jsonData).subscribe((response: any) => {
          // console.log("response :", response)
          if (response.body != undefined && response.body.message == 'User Created Successfully') {
            window.location.reload();
          }

        },
          error => {
            // console.log("error : ", error);
            if ((<HttpErrorResponse>error).error.message == 'User already exists') {
              alert("User already exists");
              // this.ngOnInit();
            }
          })

      }

    }
  }

}
