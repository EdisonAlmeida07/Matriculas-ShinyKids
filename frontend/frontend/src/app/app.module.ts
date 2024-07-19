import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralComponent } from './components/general/general.component';
import { MatriculasComponent } from './components/matriculas/matriculas.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { ParalelosComponent } from './components/paralelos/paralelos.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilteredPipe } from '../app/pipes/filtered.pipe';

@NgModule({ declarations: [
        AppComponent,
        GeneralComponent,
        MatriculasComponent,
        EstudiantesComponent,
        ParalelosComponent,
        FilteredPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
    ],
    bootstrap: [AppComponent],
    providers: [
        //provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // Inicializa la primera aplicación de Firebase
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig2, 'secondApp')), // Inicializa la segunda aplicación de Firebase
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
        provideAuth(() => getAuth()),
        provideHttpClient(withInterceptorsFromDi()) // Configura HttpClient con interceptores
      ]
    })
export class AppModule { }
