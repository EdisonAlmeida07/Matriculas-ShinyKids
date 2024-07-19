import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../services/global';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = Global.url;
  }

  getStudents(): Observable<any> {
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this.http.get(this.url + 'students', {headers:headers});
  }

  createStudent(student: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + 'save-student', student, { headers: headers });
  }

  guardarStudent(student: any): Observable<any>{
    let params=JSON.stringify(student);
    let headers=new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(this.url+'save-student', params, {headers:headers});
  }

  updateStudent(student: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(this.url + 'students/' + student.id, student, { headers: headers });
  }

  deleteStudent(studentId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(this.url + 'students/' + studentId, { headers: headers });
  }

  saveStudent(studentData: FormData): Observable<any> {
    return this.http.post<any>(this.url+'save-student', studentData);
  }

}