/*
 * CargoTrack: public landing page at "/" (https://ecmr.cargotrack.ro/), the page the OLF eCMR partner listing links to.
 * Signed-in users and the embedded app (CargoTrack Web App iframe) go straight to the overview (landing.guard.ts).
 * Texts live here (ro, en fallback) so that no upstream translation file has to be patched; the tone follows the
 * OLF listing: factual, no promotional claims.
 */
import { DOCUMENT } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

type Lang = 'ro' | 'en';

interface Item {
    icon: string;
    title: string;
    text: string;
}

interface Texts {
    tagline: string;
    nav: { roles: string; steps: string; trust: string };
    login: string;
    guide: string;
    eyebrow: string;
    title: string;
    lead: string;
    rolesTitle: string;
    rolesLead: string;
    roles: Item[];
    stepsTitle: string;
    steps: Item[];
    trustTitle: string;
    trust: Item[];
    contactTitle: string;
    contactText: string;
    contact: string;
    privacy: string;
    imprint: string;
    card: { title: string; sender: string; consignee: string; carrier: string; sealed: string; status: string };
}

const TEXTS: Record<Lang, Texts> = {
    ro: {
        tagline: 'by CargoTrack Solutions',
        nav: { roles: 'Roluri', steps: 'Cum funcționează', trust: 'Securitate' },
        login: 'Autentificare',
        guide: 'Ghid de utilizare',
        eyebrow: 'Bazat pe OLF-eCMR Toolbox · Open Logistics Foundation',
        title: 'Scrisoarea de trăsură CMR, în format electronic',
        lead: 'Emiteți, sigilați și partajați scrisori de trăsură eCMR între expeditor, transportator și destinatar, fără documente pe hârtie.',
        rolesTitle: 'Un singur document pentru toate părțile transportului',
        rolesLead: 'Fiecare parte lucrează pe același document, în rolul său.',
        roles: [
            { icon: 'inventory_2', title: 'Expeditor', text: 'Creează scrisoarea de trăsură, folosește șabloane pentru transporturile repetate și o sigilează la încărcare.' },
            { icon: 'local_shipping', title: 'Transportator', text: 'Primește documentul, completează datele vehiculului și confirmă preluarea mărfii. Șoferul poate semna fără cont, cu un cod primit prin SMS.' },
            { icon: 'where_to_vote', title: 'Destinatar', text: 'Confirmă primirea mărfii, notează eventualele rezerve și semnează livrarea.' }
        ],
        stepsTitle: 'Cum funcționează',
        steps: [
            { icon: 'edit_document', title: 'Creare', text: 'Formularul urmează rubricile scrisorii de trăsură CMR. Datele pot fi preluate dintr-un șablon.' },
            { icon: 'verified', title: 'Sigilare', text: 'La fiecare etapă documentul primește un sigiliu electronic; orice modificare ulterioară devine vizibilă.' },
            { icon: 'share', title: 'Partajare', text: 'Prin e-mail, prin cod TAN trimis prin SMS sau către alte platforme eCMR compatibile.' },
            { icon: 'inventory', title: 'Livrare și arhivă', text: 'Destinatarul semnează la livrare; documentul complet rămâne în arhivă și poate fi descărcat ca PDF.' }
        ],
        trustTitle: 'Securitate și conformitate',
        trust: [
            { icon: 'gavel', title: 'Protocolul eCMR (2008)', text: 'Între statele care au ratificat Protocolul adițional la Convenția CMR, scrisoarea de trăsură electronică are aceeași valoare ca cea pe hârtie.' },
            { icon: 'key', title: 'Sigilii electronice', text: 'Fiecare etapă este sigilată (JAdES), iar amprenta certificatului este publicată în DNS, astfel încât platformele partenere pot verifica autenticitatea.' },
            { icon: 'hub', title: 'Standard deschis', text: 'Platforma folosește componentele open-source ale Open Logistics Foundation și poate schimba documente cu alte platforme OLF-eCMR.' },
            { icon: 'history', title: 'Istoric complet', text: 'Fiecare acțiune (creare, modificare, sigilare, partajare) este înregistrată în istoricul documentului.' }
        ],
        contactTitle: 'Doriți să folosiți eCMR?',
        contactText: 'Scrieți-ne și vă ajutăm cu configurarea contului și primele transporturi.',
        contact: 'Contact',
        privacy: 'Confidențialitate',
        imprint: 'Date de identificare, informații legale',
        card: { title: 'Scrisoare de trăsură', sender: 'Expeditor', consignee: 'Destinatar', carrier: 'Transportator', sealed: 'Sigilat', status: 'În transport' }
    },
    en: {
        tagline: 'by CargoTrack Solutions',
        nav: { roles: 'Roles', steps: 'How it works', trust: 'Security' },
        login: 'Sign in',
        guide: 'User guide',
        eyebrow: 'Based on the OLF-eCMR Toolbox · Open Logistics Foundation',
        title: 'The CMR consignment note, in electronic form',
        lead: 'Issue, seal and share eCMR consignment notes between sender, carrier and consignee, without paper documents.',
        rolesTitle: 'One document for every party to the carriage',
        rolesLead: 'Each party works on the same document, in its own role.',
        roles: [
            { icon: 'inventory_2', title: 'Sender', text: 'Creates the consignment note, uses templates for recurring transports and seals it at loading.' },
            { icon: 'local_shipping', title: 'Carrier', text: 'Receives the document, completes the vehicle data and confirms taking over the goods. Drivers can sign without an account, with a code received by SMS.' },
            { icon: 'where_to_vote', title: 'Consignee', text: 'Confirms receipt of the goods, records any reservations and signs the delivery.' }
        ],
        stepsTitle: 'How it works',
        steps: [
            { icon: 'edit_document', title: 'Create', text: 'The form follows the fields of the CMR consignment note. Data can be taken from a template.' },
            { icon: 'verified', title: 'Seal', text: 'At every stage the document receives an electronic seal; any later change becomes visible.' },
            { icon: 'share', title: 'Share', text: 'By e-mail, by a TAN code sent via SMS, or to other compatible eCMR platforms.' },
            { icon: 'inventory', title: 'Delivery and archive', text: 'The consignee signs on delivery; the complete document stays in the archive and can be downloaded as PDF.' }
        ],
        trustTitle: 'Security and compliance',
        trust: [
            { icon: 'gavel', title: 'eCMR Protocol (2008)', text: 'Between states that have ratified the Additional Protocol to the CMR Convention, the electronic consignment note has the same value as the paper one.' },
            { icon: 'key', title: 'Electronic seals', text: 'Every stage is sealed (JAdES) and the certificate fingerprint is published in DNS, so partner platforms can verify authenticity.' },
            { icon: 'hub', title: 'Open standard', text: 'The platform uses the open-source components of the Open Logistics Foundation and can exchange documents with other OLF-eCMR platforms.' },
            { icon: 'history', title: 'Full history', text: 'Every action (creation, change, sealing, sharing) is recorded in the document history.' }
        ],
        contactTitle: 'Would you like to use eCMR?',
        contactText: 'Write to us and we will help you set up your account and your first transports.',
        contact: 'Contact',
        privacy: 'Privacy',
        imprint: 'Imprint, legal information',
        card: { title: 'Consignment note', sender: 'Sender', consignee: 'Consignee', carrier: 'Carrier', sealed: 'Sealed', status: 'In transport' }
    }
};

@Component({
    selector: 'app-cargotrack-landing',
    imports: [MatIcon, RouterLink],
    // styles: src/cargotrack/_landing.scss (global, see there)
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, OnDestroy {
    private readonly translate = inject(TranslateService);
    private readonly document = inject(DOCUMENT);

    protected readonly year = new Date().getFullYear();
    protected readonly contactMail = 'product@cargotrack.ro';

    protected readonly lang = toSignal(
        this.translate.onLangChange.pipe(
            map(event => event.lang),
            startWith(this.translate.currentLang),
            map((lang): Lang => (lang === 'ro' ? 'ro' : 'en'))
        ),
        { requireSync: true }
    );

    protected t(): Texts {
        return TEXTS[this.lang()];
    }

    ngOnInit(): void {
        // hides the app toolbar and navigation rail (cargotrack.scss)
        this.document.body.classList.add('ct-landing');
    }

    ngOnDestroy(): void {
        this.document.body.classList.remove('ct-landing');
    }

    protected setLang(lang: Lang): void {
        try {
            localStorage.setItem('selectedLanguage', lang);
        } catch {
            // storage blocked: the choice only lasts for this page view
        }
        this.translate.use(lang);
    }

    protected scrollTo(id: string): void {
        this.document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
}
