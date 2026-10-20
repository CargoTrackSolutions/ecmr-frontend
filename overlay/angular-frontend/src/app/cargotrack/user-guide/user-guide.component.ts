/*
 * CargoTrack: user guide page (/user-guide), linked from the "User Guide & Docs" entry of the upstream drawer.
 * The manuals are Romanian PDFs in assets/docs; page texts live here (ro, en fallback) so that no upstream
 * translation file has to be patched.
 */
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

interface Manual {
    file: string;
    title: Record<Lang, string>;
    description: Record<Lang, string>;
}

type Lang = 'ro' | 'en';

const TEXTS: Record<Lang, { title: string; intro: string; download: string }> = {
    ro: {
        title: 'Ghid de utilizare',
        intro: 'Manualele de utilizare ale platformei eCMR, pe roluri. Documentele se deschid în format PDF.',
        download: 'Descarcă PDF'
    },
    en: {
        title: 'User guide',
        intro: 'User manuals of the eCMR platform by role (in Romanian). The documents open as PDF.',
        download: 'Download PDF'
    }
};

const MANUALS: Manual[] = [
    {
        file: 'manual-expeditor-ro.pdf',
        title: { ro: 'Manual de utilizare – Expeditor', en: 'User manual – Sender' },
        description: {
            ro: 'Crearea documentului eCMR, completarea, semnarea electronică, partajarea și șabloanele.',
            en: 'Creating, completing, electronically signing and sharing eCMR documents, and templates.'
        }
    },
    {
        file: 'manual-transportator-ro.pdf',
        title: { ro: 'Manual de utilizare – Transportator', en: 'User manual – Carrier' },
        description: {
            ro: 'Accesarea documentului eCMR, completarea datelor transportatorului și semnarea electronică.',
            en: 'Accessing the eCMR document, completing the carrier data and signing electronically.'
        }
    },
    {
        file: 'manual-destinatar-ro.pdf',
        title: { ro: 'Manual de utilizare – Destinatar', en: 'User manual – Consignee' },
        description: {
            ro: 'Confirmarea primirii mărfii, rezervele la livrare și semnarea electronică a documentului eCMR.',
            en: 'Confirming receipt of the goods, reservations on delivery and signing the eCMR document.'
        }
    }
];

@Component({
    selector: 'app-cargotrack-user-guide',
    imports: [MatButton, MatIcon, MatToolbar, MatToolbarRow],
    templateUrl: './user-guide.component.html',
    styleUrl: './user-guide.component.scss'
})
export class UserGuideComponent {
    private readonly translate = inject(TranslateService);

    protected readonly manuals = MANUALS;

    protected readonly lang = toSignal(
        this.translate.onLangChange.pipe(
            map(event => event.lang),
            startWith(this.translate.currentLang),
            map((lang): Lang => (lang === 'ro' ? 'ro' : 'en'))
        ),
        { requireSync: true }
    );

    protected texts(): (typeof TEXTS)[Lang] {
        return TEXTS[this.lang()];
    }
}
