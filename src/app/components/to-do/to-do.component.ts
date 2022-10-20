import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(public dialog: MatDialog, private todoService: TodoService) { }

  ngOnInit(): void {
    this.dataSource.data = ELEMENT_DATA;
      this.todoService.getAllTasks().subscribe((response)=>{
        this.dataSource.data = response;
        console.log(response);
      })
  }

  addTask() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

export interface PeriodicElement {
  task: string;
  description: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { task: "task1", description: 'task1', status: "Active" },
  { task: "task2", description: 'task2', status: "Completed" },
  { task: "task3", description: 'task3', status: "Active" },
  { task: "task4", description: 'task4', status: "Completed" },
  { task: "task5", description: 'task5', status: "Active" },
  { task: "task6", description: 'task6', status: "Completed" },
  { task: "task7", description: 'task7', status: "Active" },
  { task: "task8", description: 'task8', status: "Completed" },
  { task: "task9", description: 'task9', status: "Active" },
  { task: "task10", description: 'task10', status: "Completed" },
  { task: "task11", description: 'task11', status: "Active" },
  { task: "task12", description: 'task12', status: "Completed" },
  { task: "task13", description: 'task13', status: "Active" },
  { task: "task14", description: 'task14', status: "Completed" },
  { task: "task15", description: 'task15', status: "Active" },
  { task: "task16", description: 'task16', status: "Completed" },
  { task: "task17", description: 'task17', status: "Active" },
  { task: "task18", description: 'task18', status: "Completed" },
  { task: "task19", description: 'task19', status: "Active" },
  { task: "task20", description: 'task20', status: "Completed" },

];
