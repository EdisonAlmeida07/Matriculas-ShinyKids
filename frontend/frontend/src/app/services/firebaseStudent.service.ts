import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStudent {
  private firestoreInstance: firebase.firestore.Firestore;
  private storageInstance: firebase.storage.Storage;

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebaseConfig2);
    } else {
      firebase.app(); // if already initialized, use that one
    }
    this.firestoreInstance = firebase.firestore();
    this.storageInstance = firebase.storage();
  }

  addStudent(student: any, profileImage: File, carnetVacunas: File): Promise<void> {
    const profileImagePath = `images/${profileImage.name}`;
    const carnetVacunasPath = `documents/${carnetVacunas.name}`;

    const profileImageRef = this.storageInstance.ref().child(profileImagePath);
    const carnetVacunasRef = this.storageInstance.ref().child(carnetVacunasPath);

    return new Promise<void>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      if (!user) {
        reject('User not authenticated');
        return;
      }

      profileImageRef.put(profileImage).then(() => {
        profileImageRef.getDownloadURL().then(profileImageUrl => {
          student.profileImageUrl = profileImageUrl;

          carnetVacunasRef.put(carnetVacunas).then(() => {
            carnetVacunasRef.getDownloadURL().then(carnetVacunasUrl => {
              student.carnetVacunasUrl = carnetVacunasUrl;
              this.firestoreInstance.collection('estudiante').add(student)
                .then(() => resolve())
                .catch(error => reject(error));
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }
}
