import { AfterViewInit, Component, OnInit, ViewChild, ɵsetCurrentInjector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, switchMap, tap } from 'rxjs';
import { TodoService } from 'src/app/services/todo.service';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component'

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.css']
})
export class ToDoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['task', 'description', 'status'];
  displayedColumns_Completed: string[] = ['task', 'description', 'status', 'action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<TaskElement>([]);
  original_data: any;

  @ViewChild('paginator')
  paginator!: MatPaginator;

  @ViewChild('paginator1')
  paginator1!: MatPaginator;

  @ViewChild('paginator2')
  paginator2!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(public dialog: MatDialog, private todoService: TodoService) { }

  ngOnInit(): void {
    // this.dataSource.data = ELEMENT_DATA;
    this.getAllTask();
  }

  getAllTask() {
    this.todoService.getAllTasks().subscribe((response) => {
      this.dataSource.data = response;
      this.original_data = response;
      console.log(response);
    })
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.todoService.getAllTasks().subscribe((response) => {
        this.dataSource.data = response;
        this.original_data = response;
        console.log(response);
      })
    });
  }

  deleteTask(element: any) {
    const current = {
      _id: element._id
    };
    element.status = "deleted";
    // this.todoService.deleteTask(current).subscribe(res => {
    //   this.onTabChanged({ index: 2 });
    // });
    this.todoService.deleteTask(current).pipe(
      map(response => response))
      .subscribe(res => {
        this.todoService.getAllTasks().subscribe((response) => {
          this.dataSource.data = response;
          this.original_data = response;
          console.log(response);
          this.onTabChanged({ index: 2 });
        })
      })
    console.log(element._id);
  }

  completeTask($event: any, element: any) {
    if ($event.checked) {
      const current = {
        _id: element._id
      };
      element.status = "completed";

      this.todoService.completeTask(current).pipe(
        map(response => response))
        .subscribe(res => {
          this.todoService.getAllTasks().subscribe((response) => {
            this.dataSource.data = response;
            this.original_data = response;
            console.log(response);
            this.onTabChanged({ index: 1 });
          })
        })
      console.log(element._id);
    }
  }

  onTabChanged($event: any) {
    console.log($event.index);
    if ($event.index == 0) {
      // this.dataSource.data = this.original_data
      // this.dataSource.paginator = this.paginator;
      this.todoService.getAllTasks().subscribe((response) => {
        this.dataSource.data = response;
        this.original_data = response;
        // this.dataSource.data = this.original_data
        this.dataSource.paginator = this.paginator;
        console.log(response);
      })
    }
    else if ($event.index == 1) {
      let active_data = []
      for (let data of this.original_data) {
        if (data.status == 'active') {
          active_data.push(data)
        }
      }
      this.dataSource.data = active_data;
      this.dataSource.paginator = this.paginator1;
      console.log(this.dataSource.paginator)
    }
    else if ($event.index == 2) {
      let active_data = []
      for (let data of this.original_data) {
        if (data.status == 'complete') {
          active_data.push(data)
        }
      }
      this.dataSource.data = active_data;
      this.dataSource.paginator = this.paginator2;
      console.log(this.dataSource.paginator)
    }
  }

}

export interface TaskElement {
  task: string;
  description: string;
  status: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//   { task: "task1", description: 'task1', status: "Active" },
//   { task: "task2", description: 'task2', status: "Completed" },
//   { task: "task3", description: 'task3', status: "Active" },
//   { task: "task4", description: 'task4', status: "Completed" },
//   { task: "task5", description: 'task5', status: "Active" },
//   { task: "task6", description: 'task6', status: "Completed" },
//   { task: "task7", description: 'task7', status: "Active" },
//   { task: "task8", description: 'task8', status: "Completed" },
//   { task: "task9", description: 'task9', status: "Active" },
//   { task: "task10", description: 'task10', status: "Completed" },
//   { task: "task11", description: 'task11', status: "Active" },
//   { task: "task12", description: 'task12', status: "Completed" },
//   { task: "task13", description: 'task13', status: "Active" },
//   { task: "task14", description: 'task14', status: "Completed" },
//   { task: "task15", description: 'task15', status: "Active" },
//   { task: "task16", description: 'task16', status: "Completed" },
//   { task: "task17", description: 'task17', status: "Active" },
//   { task: "task18", description: 'task18', status: "Completed" },
//   { task: "task19", description: 'task19', status: "Active" },
//   { task: "task20", description: 'task20', status: "Completed" },

// ];
