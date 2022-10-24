import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { FileUpload } from 'src/app/models/file-upload.model';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('fileInput') el: ElementRef | undefined;

  canEdit: boolean = false;
  selectedFiles?: FileList;
  currentFileUpload!: FileUpload;
  // imageUrl: any = "../../assets/avatar.png"
  imageUrl: any = ""
  private basePath = '/profile-images';

  profileForm = this.fb.group({
    firstName: [{ value: '', disabled: true }, Validators.required],
    lastName: [{ value: '', disabled: true }, Validators.required],
    dob: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required]],
    password: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8)]],
    file: null!
  })

  constructor(public registrationService: RegistrationService, public fb: FormBuilder,
    private cd: ChangeDetectorRef, private db: AngularFireDatabase, private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,) {
    this.registrationService.getUserData().subscribe((response: any) => {
      console.log(response['data'][0]);
      this.profileForm.patchValue(response['data'][0]);
      this.imageUrl = response['data'][0]['imageURL']
      console.log(this.imageUrl)
    })
  }

  ngOnInit(): void {
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
        this.profileForm.patchValue({
          file: reader.result
        });
        this.profileForm.markAsUntouched();
        // this.editFile = false;
        // this.removeUpload = true;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  edit() {
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
    this.profileForm.controls.firstName.enable();
    this.profileForm.controls.lastName.enable();
    this.profileForm.controls.dob.enable();
    this.profileForm.controls.email.enable();
    // this.profileForm.controls.password.enable();
    this.canEdit = true
    // this.profileForm.controls.firstname.clearValidators();

  }

  save() {
    if (this.profileForm.valid) {
      console.log("form :", this.profileForm.value);
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
                "firstName": this.profileForm.controls.firstName.value,
                "lastName": this.profileForm.controls.lastName.value,
                "email": this.profileForm.controls['email'].value,
                "dob": this.profileForm.controls['dob'].value,
                // "password": this.profileForm.controls['password'].value,
                // "signInType": "google",
                "imageURL": downloadURL
              }

              console.log("json data : ", jsonData)

              this.registrationService.saveUserData(jsonData).subscribe((response: any) => {
                console.log("response :", response)
                if (response != undefined && response.status == 'success') {
                  alert("Data saved successfully");
                  window.location.reload();

                  // this.canEdit=false;
                }

              },
                error => {
                  console.log("error : ", error);
                  if ((<HttpErrorResponse>error).error.message == 'User already exists') {
                    alert("Error occurred");
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
          "firstName": this.profileForm.controls.firstName.value,
          "lastName": this.profileForm.controls.lastName.value,
          "email": this.profileForm.controls['email'].value,
          "dob": this.profileForm.controls['dob'].value,
          // "password": this.profileForm.controls['password'].value,
          // "signInType": "google"
        }

        console.log("json data : ", jsonData)

        this.registrationService.saveUserData(jsonData).subscribe((response: any) => {
          console.log("response :", response)
          if (response != undefined && response.status == 'success') {
            alert("Data saved successfully");
            window.location.reload();

            // this.canEdit=false;
          }

        },
          error => {
            // console.log("error : ", error);
            if ((<HttpErrorResponse>error).error.message == 'User already exists') {
              alert("Error occurred");
              // this.ngOnInit();
            }
          })

      }

    }
  }

  cancel() {
    this.profileForm.controls.firstName.disable();
    this.profileForm.controls.lastName.disable();
    this.profileForm.controls.dob.disable();
    this.profileForm.controls.email.disable();
    // this.profileForm.controls.password.enable();
    this.canEdit = false
    this.registrationService.getUserData().subscribe((response: any) => {
      console.log(response['data'][0]);
      // localStorage.setItem("userId",)
      this.profileForm.patchValue(response['data'][0]);
      this.imageUrl = response['data'][0]['imageURL']
      console.log(this.imageUrl)
    })
  }

}
