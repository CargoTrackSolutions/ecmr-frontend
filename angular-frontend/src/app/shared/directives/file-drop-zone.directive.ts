/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Directive, ElementRef, HostBinding, HostListener, inject, input, output, OutputEmitterRef, signal } from '@angular/core';

@Directive({
    selector: '[appFileDropZone]'
})
export class FileDropZoneDirective {

    private readonly element: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

    fileDropEnabled = input<boolean>(true);

    filesDropped: OutputEmitterRef<File[]> = output<File[]>();
    hover: OutputEmitterRef<boolean> = output<boolean>();
    invalidFiles: OutputEmitterRef<number> = output<number>();
    fileHoverAmount: OutputEmitterRef<number> = output<number>();

    private readonly maxFileSize = 10 * 1024 * 1024;

    @HostBinding('class.dropzone-hover')
    isHovering = signal<boolean>(false);

    @HostListener('dragenter', ['$event'])
    onDragEnter(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const dt = event.dataTransfer;
        if (!dt?.items?.length) {
            this.invalidFiles.emit(0);
            return;
        }

        const items = Array.from(dt.items).filter(i => i.kind === 'file');
        this.fileHoverAmount.emit(items.length)

        const invalid = items.filter(i => !this.isAllowedMime(i.type));

        this.invalidFiles.emit(invalid.length);

        this.isHovering.set(true);
        this.hover.emit(true);

    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const toElement = event.relatedTarget as Node | null;

        if (toElement && this.element.nativeElement.contains(toElement)) {
            return;
        }

        this.isHovering.set(false);
        this.hover.emit(false);
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }


    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isHovering.set(false);
        this.hover.emit(false);

        if (!event.dataTransfer?.files?.length || !this.fileDropEnabled()) {
            return;
        }

        const allFiles = Array.from(event.dataTransfer.files);
        const validFiles = allFiles.filter(file => this.isAllowed(file));
        this.invalidFiles.emit(0)
        if (validFiles.length) {
            this.filesDropped.emit(validFiles);
            this.invalidFiles.emit(0);
        }

    }

    private isAllowed(file: File): boolean {
        if (file.size > this.maxFileSize) return false;
        if (file.type === 'application/pdf') return true;
        return file.type.startsWith('image/');
    }

    private isAllowedMime(type: string): boolean {
        if (type === 'application/pdf') return true;
        return type.startsWith('image/');


    }
}
