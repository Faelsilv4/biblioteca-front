import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataBr'
})
export class DataBrPipe implements PipeTransform {

  transform(data: string | Date | null | undefined): string {
    if (!data) {
      return '';
    }

    if (data instanceof Date) {
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();

      return `${dia}/${mes}/${ano}`;
    }

    const dataTexto = data.toString();

    if (dataTexto.includes('-')) {
      const partes = dataTexto.split('-');

      const ano = partes[0];
      const mes = partes[1];
      const dia = partes[2]?.substring(0, 2);

      return `${dia}/${mes}/${ano}`;
    }

    return dataTexto;
  }
}