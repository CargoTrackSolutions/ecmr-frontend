import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';

interface GuideDocument {
    title: string;
    description: string;
    fileName: string;
}

@Component({
    selector: 'app-ghid',
    imports: [
        TranslateModule,
        MatIcon,
        MatButton,
        MatToolbar,
        MatToolbarRow
    ],
    templateUrl: './ghid.component.html',
    styleUrl: './ghid.component.scss'
})
export class GhidComponent {

    documents: GuideDocument[] = [
        {
            title: 'Manual de Utilizare – Expeditor',
            description: 'Ghid complet pentru utilizatorii cu rol de Expeditor: creare eCMR, semnare electronică, partajare și șabloane.',
            fileName: 'manual-expeditor-ro.pdf'
        },
        {
            title: 'Manual de Utilizare – Transportator',
            description: 'Ghid pentru transportatori: accesarea documentului eCMR, completarea datelor și semnarea electronică.',
            fileName: 'manual-transportator-ro.pdf'
        },
        {
            title: 'Manual de Utilizare – Destinatar',
            description: 'Ghid pentru destinatari: confirmarea primirii mărfii și semnarea electronică a documentului eCMR.',
            fileName: 'manual-destinatar-ro.pdf'
        }
    ];

    downloadPdf(fileName: string): void {
        const url = `assets/docs/${fileName}`;
        window.open(url, '_blank');
    }
}
