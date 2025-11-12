/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JsonImportExportService {

    exportAsJson<T>(rows: T[], filename = 'export.json') {
        this.downloadFile(JSON.stringify(rows, null, 2), filename, 'application/vnd.ecmr+json;charset=utf-8');
    }

    downloadFile(content: string | Blob, filename: string, mime: string) {
        const blob = content instanceof Blob ? content : new Blob([content], {type: mime});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    importJson<T>(file: File): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = () => reject(reader.error);
            reader.onload = () => {
                try {
                    const json = JSON.parse(String(reader.result)) as T[];
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            };
            reader.readAsText(file, 'utf-8');
        });
    }

}
