import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataBr',
  standalone: true
})
export class DataBrPipe implements PipeTransform {

  transform(value: string | null | undefined): string {

    if (!value) {
      return '';
    }

    const data = new Date(value);

    return data.toLocaleDateString('pt-BR');
  }
}