import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtered'
})
export class FilteredPipe implements PipeTransform {
  transform(students: any[], searchText: string): any[] {
    if (!students) return [];
    if (!searchText) return students;

    searchText = searchText.toLowerCase();
    return students.filter(student => {
      return (student.nombres && student.nombres.toLowerCase().includes(searchText)) ||
             (student.apellidos && student.apellidos.toLowerCase().includes(searchText)) ||
             (student.grado && student.grado.toLowerCase().includes(searchText)) ||
             (student.direccion && student.direccion.toLowerCase().includes(searchText));
    });
  }
}
