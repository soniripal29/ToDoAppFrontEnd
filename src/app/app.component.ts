

// app.component.ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RegistrationService } from './services/registration.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  title = 'Authentication-App';
  firstName = "";
  lastName = "";

  // url = 'https://jsonplaceholder.typicode.com/users';
  // users: string[] = [];

  constructor(private httpClient: HttpClient, public service: RegistrationService, private router: Router) {
    if (this.service.isLoggedIn()) {
      let userData: any = localStorage.getItem('currentUser');
      this.firstName = JSON.parse(userData)['result']['firstName'];
      this.lastName = JSON.parse(userData)['result']['lastName'];
    }
  }


  logout() {
    this.service.logout();
    this.router.navigate(['/login']);
  }

  goToEditProfile() {
    this.router.navigate(['/home']);
  }

  goToToDo() {
    this.router.navigate(['/to-do']);
  }

  goToUnsplash() {
    this.router.navigate(['/unsplash']);
  }
}
