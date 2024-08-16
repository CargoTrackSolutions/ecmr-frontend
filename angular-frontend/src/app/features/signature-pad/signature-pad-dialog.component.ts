/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatButton,
    TranslateModule,
    MatFormField,
    FormsModule,
    MatError,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './signature-pad-dialog.component.html',
  styleUrl: './signature-pad-dialog.component.scss'
})
export class SignaturePadDialogComponent implements AfterViewInit {
  @ViewChild('signaturePad', { static: false }) signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  private context!: CanvasRenderingContext2D;
  isSignatureEmpty: boolean = true; // Track signature state

  constructor(private dialogRef: MatDialogRef<SignaturePadDialogComponent>,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement, {
      backgroundColor: '#fff'
    });
    this.context = this.signaturePadElement.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    // Ensure the canvas is resized and cleared correctly
    this.resizeCanvas();

    // Check signature pad state after initialization
    this.updateSignatureState();
  }

  clearPad() {
    this.signaturePad?.clear();
    this.updateSignatureState();
  }

  closePad() {
    this.dialogRef.close();
  }

  savePad() {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        text: this.translateService.instant('signature.confirm_text')
      }
    }).afterClosed().subscribe(result => {
      if (result.isConfirmed) {
        this.dialogRef.close(this.signaturePad.toDataURL());
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.signaturePadElement.nativeElement.width = this.signaturePadElement.nativeElement.offsetWidth * ratio;
    this.signaturePadElement.nativeElement.height = this.signaturePadElement.nativeElement.offsetHeight * ratio;
    this.context.scale(ratio, ratio);
    this.clearPad();
  }

  private updateSignatureState() {
    this.isSignatureEmpty = this.signaturePad.isEmpty();
    this.cdr.detectChanges(); // Trigger change detection
  }

  isNotSigned(): boolean {
    return this.isSignatureEmpty;
  }
}
