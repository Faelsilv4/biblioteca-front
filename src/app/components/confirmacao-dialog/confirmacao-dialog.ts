import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmacaoDialogData {
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
  icone?: string;
}

@Component({
  selector: 'app-confirmacao-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmacao-dialog.html',
  styleUrl: './confirmacao-dialog.css'
})
export class ConfirmacaoDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfirmacaoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmacaoDialogData
  ) {}

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}