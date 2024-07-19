import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service'; 

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  students: any[] = [];
  

  constructor(private studentService: StudentService) { }

  searchText = '';

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(data => {
      if (data && Array.isArray(data.students)) {
        this.students = data.students;
      } else {
        console.error('Expected an array of students but received:', data);
      }
      console.log('Students:', this.students);  
    }, error => {
      console.error('Error fetching students', error);
    });
  }
}
