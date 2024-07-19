import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-paralelos',
  templateUrl: './paralelos.component.html',
  styleUrls: ['./paralelos.component.css']
})
export class ParalelosComponent implements OnInit {
  students: any[] = []; // Variable para almacenar todos los estudiantes
  filteredStudents: any[] = []; // Variable para almacenar estudiantes filtrados
  filteredStudentCount: number = 0; // Variable para contar estudiantes filtrados

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    // Cargar todos los estudiantes al iniciar el componente
    this.loadStudents();
  }

  // Método para cargar todos los estudiantes
  loadStudents() {
    this.studentService.getStudents().subscribe(
      (data: any) => {
        if (data && data.students && Array.isArray(data.students)) {
          this.students = data.students;
          // Inicialmente, mostrar todos los estudiantes
          this.filteredStudents = [...this.students];
          this.updateFilteredStudentCount();
        } else {
          console.error('Expected an array of students but received:', data);
        }
      },
      error => {
        console.error('Error fetching students', error);
      }
    );
  }

  // Método para filtrar estudiantes por grado
  filterStudentsByGrade(grade: string) {
    this.filteredStudents = this.students.filter(student => student.grado === grade);
    this.updateFilteredStudentCount();
  }

  // Método para actualizar el conteo de estudiantes filtrados
  updateFilteredStudentCount() {
    this.filteredStudentCount = this.filteredStudents.length;
  }
}
