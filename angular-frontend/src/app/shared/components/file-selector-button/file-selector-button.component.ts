/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, output, OutputEmitterRef, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-file-selector-button',
    imports: [
        MatButton,
        MatIcon
    ],
    templateUrl: './file-selector-button.component.html',
    styleUrl: './file-selector-button.component.scss'
})
export class FileSelectorButtonComponent {

    filesSelected: OutputEmitterRef<File[]> = output<File[]>();
    invalidFilesSelected: OutputEmitterRef<File[]> = output<File[]>();

    readonly acceptAttr = 'image/*,application/pdf';
    private readonly maxFileSize = 10 * 1024 * 1024;

    readonly lastInvalidCount = signal(0);

    onFileInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const allFiles = Array.from(input.files);

        const validFiles: File[] = [];
        const invalidFiles: File[] = [];

        for (const file of allFiles) {
            if (this.isValidFile(file)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        }

        this.lastInvalidCount.set(invalidFiles.length);

        if (validFiles.length) {
            this.filesSelected.emit(validFiles);
        }

        if (invalidFiles.length) {
            this.invalidFilesSelected.emit(invalidFiles);
        }

        input.value = '';
    }

    private isValidFile(file: File): boolean {
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';

        const isAllowedType = isImage || isPdf;
        const isAllowedSize = file.size <= this.maxFileSize;

        return isAllowedType && isAllowedSize;
    }

}
