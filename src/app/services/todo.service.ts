import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  getdataUrl = 'https://todoapp25.herokuapp.com/task/';
  addTaskUrl = 'https://todoapp25.herokuapp.com/task/add'

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any> {
      return this.http.get<any>(this.getdataUrl);
  }

  addTask(task: any): Observable<any>{
    return this.http.post(this.addTaskUrl, task);
  }
}
