import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(userCredential => {
        // Logged in successfully
        console.log('Logged in:', userCredential);
        this.router.navigate(['/paralelos']); // Redirige al componente Paralelos
      })
      .catch(error => {
        // Handle errors here
        console.error('Login error:', error);
        window.alert('Correo o contraseña incorrectos. Inténtalo de nuevo.');
      });
  }
}
