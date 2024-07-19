import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './components/general/general.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { ParalelosComponent } from './components/paralelos/paralelos.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'general', component: GeneralComponent
  },
  {
    path: 'estudiantes', component: EstudiantesComponent
  },
  {
    path: 'matriculas', component: MatriculasComponent
  },
  {
    path: 'paralelos', component: ParalelosComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
