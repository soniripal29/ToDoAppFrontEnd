import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit {

  task!: string;
  description!: string;
  taskData: any;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  addTasks(){
    this.taskData = {
      task: this.task,
      description: this.description,
      // user: "123"
    };
    this.todoService.addTask(this.taskData).subscribe((data) => {
      console.log(data);
    })
  }

}
