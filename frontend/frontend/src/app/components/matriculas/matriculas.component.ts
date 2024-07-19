import { Component } from '@angular/core';
import { FirebaseStudent } from '../../services/firebaseStudent.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent {
  newStudent: any = {
    nombres: '',
    apellidos: '',
    cedula: '',
    direccion: '',
    tipoSangre: '',
    fechaNacimiento: '',
    grado: '',
    yearLectivo: '',
    sexo: '',
    padre: {
      nombresP: '',
      apellidosP: '',
      cedulaP: '',
      profesionP: '',
      telefonoP: '',
      lugarTrabajoP: '',
      correoP: '',
      fechaNacP: ''
    },
    madre: {
      nombresM: '',
      apellidosM: '',
      cedulaM: '',
      profesionM: '',
      telefonoM: '',
      lugarTrabajoM: '',
      correoM: '',
      FechaNacM: ''
    },
    representanteLegal: {
      nombresR: '',
      apellidosR: '',
      direccionR: '',
      telefonoR: '',
      correoR: '',
      parentesco: ''
    }
  };
  profileImage: File | null = null;
  carnetVacunas: File | null = null;
  

  constructor(
    private firebaseStudent: FirebaseStudent,
    private toastr: ToastrService,
    private router: Router  
  ) {}

  handleFileInput(event: any, type: string) {
    const file: File = event.target.files[0];
    if (type === 'profileImage') {
      this.profileImage = file;
    } else if (type === 'carnetVacunas') {
      this.carnetVacunas = file;
    }
  }

  addStudent() {
    if (this.profileImage && this.carnetVacunas) {
      this.firebaseStudent.addStudent(this.newStudent, this.profileImage, this.carnetVacunas)
        .then(() => {
          this.toastr.success('Estudiante guardado exitosamente', 'Éxito');
          console.log('Student added successfully');
          // Puedes agregar cualquier lógica adicional aquí después del éxito
        })
        .catch(error => {
          this.toastr.error('Error al guardar estudiante', 'Error');
          console.error('Error adding student: ', error);
        });
        window.alert('Estudiante guardado exitosamente.');
    } else {
      this.toastr.warning('Debe seleccionar imagen de perfil y carné de vacunas', 'Advertencia');
      console.error('Profile image and carnet de vacunas are required');
    }
  }
  printData() {
    window.print(); 
    this.router.navigate(['/paralelos']);
  }

  
}
