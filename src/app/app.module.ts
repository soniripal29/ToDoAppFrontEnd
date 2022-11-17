import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './material/material.module';
import { LoaderComponent } from './components/loader/loader.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import { LoginUserComponent } from './components/login-user/login-user.component';
// import { MatCardModule } from '@angular/material/card';
// import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIconModule } from '@angular/material/icon';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

import { FileUploadModule } from 'ng2-file-upload';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { ToDoComponent } from './components/to-do/to-do.component';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { UnsplashComponent } from './components/unsplash/unsplash.component'

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    LoginUserComponent,
    HomeComponent,
    ToDoComponent,
    AddTaskDialogComponent,
    UnsplashComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // MatInputModule,
    // MatCardModule,
    // MatTabsModule,
    // MatFormFieldModule,
    // MatButtonModule,
    // MatCheckboxModule,
    // MatIconModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FileUploadModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
