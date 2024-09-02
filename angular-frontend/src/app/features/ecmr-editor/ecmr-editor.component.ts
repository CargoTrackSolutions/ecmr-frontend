/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CountryCode } from '../../core/enums/CountryCode';
import { catchError, filter, forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { CommonModule, DatePipe, NgClass, NgForOf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { EcmrConsignment } from '../../core/models/EcmrConsignment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Signature } from '../../core/models/areas/signature/Signature';
import { EcmrEditorService } from './ecmr-editor-service/ecmr-editor.service';
import { Ecmr } from '../../core/models/Ecmr';
import { PayerType } from '../../core/enums/PayerType';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { TemplateNameDialogComponent } from '../template-overview/template-name-dialog/template-name-dialog.component';
import { LoadFromTemplateDialogComponent } from '../template-overview/load-from-template-dialog/load-from-template-dialog.component';
import { TemplateUser } from '../../core/models/TemplateUser';
import { LoadingService } from '../../core/services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicDisableControlDirective } from './dynamic-disable-control.directive';
import { GroupService } from '../group/group.service';
import { EcmrCreateShareDialogComponent } from './ecmr-create-share-dialog/ecmr-create-share-dialog.component';
import { GroupFlat } from '../../core/models/GroupFlat';
import { ExternalUserService } from './ecmr-editor-service/external-user.service';
import { SignaturePadDialogComponent } from '../signature-pad/signature-pad-dialog.component';
import { Sign } from '../../core/models/Sign';
import { Signer } from '../../core/enums/Signer';
import { DateTimeService } from '../../shared/services/date-time.service';
import { MatOptionModule } from '@angular/material/core';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { EcmrStatus } from '../../core/models/EcmrStatus';
import { EcmrService } from '../../shared/services/ecmr.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { ShareEcmrDialogComponent } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog.component';
import { EcmrActionService } from '../../shared/services/ecmr-action.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

export enum EditorMode {
    ECMR_EDIT = 'ECMR_EDIT',
    ECMR_COPY = 'ECMR_COPY',
    ECMR_NEW = 'ECMR_NEW',
    TEMPLATE_EDIT = 'TEMPLATE_EDIT',
    TEMPLATE_NEW = 'TEMPLATE_NEW',
}

@Component({
    selector: 'app-ecmr-editor',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormField,
        MatInputModule,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatToolbarModule,
        MatDatepickerModule,
        CdkTextareaAutosize,
        MatMenuModule,
        MatExpansionModule,
        TranslateModule,
        MatSelectModule,
        DynamicDisableControlDirective,
        NgClass,
        NgForOf,
    ],
    providers: [DatePipe, DateTimeService],
    templateUrl: './ecmr-editor.component.html',
    styleUrl: './ecmr-editor.component.scss'
})
export class EcmrEditorComponent implements OnInit {
    canFillSenderFields: boolean = false;
    canFillCarrierFields: boolean = false;
    canFillConsigneeFields: boolean = false;

    isMobile: boolean = false;
    isPhone: boolean = false;
    breakpointSubscription: Subscription | undefined;

    editorMode: EditorMode;

    senderSignature: Signature | null;
    carrierSignature: Signature | null;
    consigneeSignature: Signature | null;

    userEcmrRoles: EcmrRole[] = [];

    @ViewChild(MatAccordion) accordion: MatAccordion;

    ecmrConsignment: EcmrConsignment;
    ecmrToEdit: Ecmr;
    ecmrId: string | null;
    loadedTemplate: TemplateUser;

    payerType: PayerType[] = Object.values(PayerType);

    itemList = new FormArray([
        new FormGroup({
            marksAndNos: new FormGroup({
                logisticsShippingMarksMarking: new FormControl<string | null>(null),
                logisticsShippingMarksCustomBarcode: new FormControl<string | null>(null)
            }),
            numberOfPackages: new FormGroup({
                logisticsPackageItemQuantity: new FormControl<number | null>(null),
            }),
            methodOfPacking: new FormGroup({
                logisticsPackageType: new FormControl<string | null>(null),
            }),
            natureOfTheGoods: new FormGroup({
                transportCargoIdentification: new FormControl<string | null>(null),
            }),
            grossWeightInKg: new FormGroup({
                supplyChainConsignmentItemGrossWeight: new FormControl<number | null>(null),
            }),
            volumeInM3: new FormGroup({
                supplyChainConsignmentItemGrossVolume: new FormControl<number | null>(null)
            })
        })
    ]);

    ecmrConsignmentFormGroup = new FormGroup({
        //Area 1
        senderInformation: new FormGroup({
            senderNameCompany: new FormControl<string | null>(null),
            senderNamePerson: new FormControl<string | null>(null),
            senderStreet: new FormControl<string | null>(null),
            senderPostcode: new FormControl<string | null>(null),
            senderCity: new FormControl<string | null>(null),
            senderCountryCode: new FormGroup({
                value: new FormControl<string | null>(null),
                region: new FormControl<string | null>(null)
            }),
            senderContactInformation: new FormGroup({
                email: new FormControl<string | null>(null, [emailValidator()]),
                phone: new FormControl<string | null>(null, [phoneNumberValidator()])
            })
        }),
        //Area 2
        consigneeInformation: new FormGroup({
            consigneeNameCompany: new FormControl<string | null>(null),
            consigneeNamePerson: new FormControl<string | null>(null),
            consigneeStreet: new FormControl<string | null>(null),
            consigneePostcode: new FormControl<string | null>(null),
            consigneeCity: new FormControl<string | null>(null),
            consigneeCountryCode: new FormGroup({
                value: new FormControl<string | null>(null),
                region: new FormControl<string | null>(null)
            }),
            consigneeContactInformation: new FormGroup({
                email: new FormControl<string | null>(null, [emailValidator()]),
                phone: new FormControl<string | null>(null, [phoneNumberValidator()])
            })
        }),
        //Area 3
        takingOverTheGoods: new FormGroup({
            takingOverTheGoodsPlace: new FormControl<string | null>(null),
            logisticsTimeOfArrivalDateTime: new FormControl<Date | null>(null),
            logisticsTimeOfDepartureDateTime: new FormControl<Date | null>(null),
        }),
        //Area 4
        deliveryOfTheGoods: new FormGroup({
            logisticsLocationOpeningHours: new FormControl<string | null>(null),
            logisticsLocationCity: new FormControl<string | null>(null),
        }),
        //Area 5
        sendersInstructions: new FormGroup({
            transportInstructionsDescription: new FormControl<string | null>(null),
        }),
        //Area 6
        carrierInformation: new FormGroup({
            carrierNameCompany: new FormControl<string | null>(null),
            carrierNamePerson: new FormControl<string | null>(null),
            carrierStreet: new FormControl<string | null>(null),
            carrierPostcode: new FormControl<string | null>(null),
            carrierCity: new FormControl<string | null>(null),
            carrierCountryCode: new FormGroup({
                value: new FormControl<string | null>(null),
                region: new FormControl<string | null>(null)
            }),
            carrierLicensePlate: new FormControl<string | null>(null),
            carrierContactInformation: new FormGroup({
                email: new FormControl<string | null>(null, [emailValidator()]),
                phone: new FormControl<string | null>(null, [phoneNumberValidator()])
            })
        }),
        //Area 7
        successiveCarrierInformation: new FormGroup({
            successiveCarrierCity: new FormControl<string | null>(null),
            successiveCarrierCountryCode: new FormGroup({
                value: new FormControl<string | null>(null),
                region: new FormControl<string | null>(null),
            }),
            successiveCarrierNameCompany: new FormControl<string | null>(null),
            successiveCarrierNamePerson: new FormControl<string | null>(null),
            successiveCarrierPostcode: new FormControl<string | null>(null),
            successiveCarrierSignature: new FormControl<Signature | null>(null),
            successiveCarrierSignatureDate: new FormControl<Date | null>(null),
            successiveCarrierStreet: new FormControl<string | null>(null),
            successiveCarrierContactInformation: new FormGroup({
                email: new FormControl<string | null>(null, [emailValidator()]),
                phone: new FormControl<string | null>(null, [phoneNumberValidator()])
            })
        }),
        //Area 8
        carriersReservationsAndObservationsOnTakingOverTheGoods: new FormGroup({
            carrierReservationsObservations: new FormControl<string | null>(null),
            senderReservationsObservationsSignature: new FormControl<Signature | null>(null)
        }),
        //Area 9
        documentsHandedToCarrier: new FormGroup({
            documentsRemarks: new FormControl<string | null>(null)
        }),
        itemList: this.itemList,
        //Area 16
        specialAgreementsSenderCarrier: new FormGroup({
            customSpecialAgreement: new FormControl<string | null>(null),
        }),
        //Area 17
        toBePaidBy: new FormGroup({
            customChargeCarriage: new FormGroup({
                value: new FormControl<number | null>(null),
                currency: new FormControl<string | null>(null),
                payer: new FormControl<PayerType | null>(null)
            }),
            customChargeSupplementary: new FormGroup({
                value: new FormControl<number | null>(null),
                currency: new FormControl<string | null>(null),
                payer: new FormControl<PayerType | null>(null)
            }),
            customChargeCustomsDuties: new FormGroup({
                value: new FormControl<number | null>(null),
                currency: new FormControl<string | null>(null),
                payer: new FormControl<PayerType | null>(null)
            }),
            customChargeOther: new FormGroup({
                value: new FormControl<number | null>(null),
                currency: new FormControl<string | null>(null),
                payer: new FormControl<PayerType | null>(null)
            }),
        }),
        //Area 18
        otherUsefulParticulars: new FormGroup({
            customParticulars: new FormControl<string | null>(null),
        }),
        //Area 19
        cashOnDelivery: new FormGroup({
            customCashOnDelivery: new FormControl<number | null>(null),
        }),
        //Area 21
        established: new FormGroup({
            customEstablishedIn: new FormControl<string | null>(null),
            customEstablishedDate: new FormControl<Date | null>(null)
        }),
        //Area 22
        signatureOrStampOfTheSender: new FormGroup({
            senderSignature: new FormControl<Signature | null>(null)
        }),
        //Area 23
        signatureOrStampOfTheCarrier: new FormGroup({
            carrierSignature: new FormControl<Signature | null>(null)
        }),
        //Area 24
        goodsReceived: new FormGroup({
            consigneeSignatureDate: new FormControl<Date | null>(null),
            confirmedLogisticsLocationName: new FormControl<string | null>(null),
            consigneeReservationsObservations: new FormControl<string | null>(null),
            consigneeTimeOfArrival: new FormControl<Date | null>(null),
            consigneeTimeOfDeparture: new FormControl<Date | null>(null),
            consigneeSignature: new FormControl<Signature | null>(null)
        }),
        //Area 25
        nonContractualPartReservedForTheCarrier: new FormGroup({
            nonContractualCarrierRemarks: new FormControl<string | null>(null)
        }),
        //Area 26
        referenceIdentificationNumber: new FormGroup({
            value: new FormControl<string>('', Validators.required)
        })
    })


    countries = Object.keys(CountryCode);
    filteredConsigneeCountries: Observable<string[]>;
    filteredSenderCountries: Observable<string[]>;
    filteredCarrierCountries: Observable<string[]>;
    filteredSuccessiveCarrierCountries: Observable<string[]>;

    sub: Subscription;
    id: string;
    tan: string;
    isExternalUser: boolean;

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private ecmrEditorService: EcmrEditorService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private groupService: GroupService,
                private externalUserService: ExternalUserService,
                private translateService: TranslateService,
                private cd: ChangeDetectorRef,
                private snackBarService: SnackbarService,
                protected ecmrActionService: EcmrActionService,
                private loadingService: LoadingService,
                protected dateTimeService: DateTimeService,
                public matDialog: MatDialog,
                private ecmrService: EcmrService) {
    }

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver
          .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
          .subscribe((result) => {
             this.isMobile = result.matches;
             this.isPhone = this.breakpointObserver.isMatched(Breakpoints.XSmall);
          }
        );

        this.id = this.route.snapshot.params['id'];
        this.tan = this.route.snapshot.params['tan'];
        this.isExternalUser = !!this.tan;
        if (this.id) {
            this.editorMode = EditorMode.ECMR_EDIT;
        } else {
            this.editorMode = EditorMode.ECMR_NEW;
        }

        if (this.route.snapshot.url.join('/').includes('template-editor')) {
            this.editorMode = EditorMode.TEMPLATE_NEW;
            this.sub = this.route.params.subscribe(params => {
                this.id = params['id'];
                if (this.id) {
                    this.editorMode = EditorMode.TEMPLATE_EDIT;
                }
            });
        }


        if (this.router.url.includes('copy')) {
            this.editorMode = EditorMode.ECMR_COPY;
        }

        this.initializeForm();

        // Initialize Country Autocomplete Form Fields
        const formGroupControl = this.ecmrConsignmentFormGroup.controls;
        //Autocomplete filter Sender Countries
        this.filteredSenderCountries = formGroupControl.senderInformation.controls.senderCountryCode.controls.value.valueChanges
            .pipe(
                startWith(formGroupControl.senderInformation.controls.senderCountryCode.controls.value.value ?? ''),
                map(value => this._filter(value ?? ''))
            );

        //Autocomplete filter Consignee Countries
        this.filteredConsigneeCountries = formGroupControl.consigneeInformation.controls.consigneeCountryCode.controls.value.valueChanges
            .pipe(
                startWith(formGroupControl.consigneeInformation.controls.consigneeCountryCode.controls.value.value ?? ''),
                map(value => this._filter(value ?? ''))
            );

        //Autocomplete filter Carrier Countries
        this.filteredCarrierCountries = this.ecmrConsignmentFormGroup.controls.carrierInformation.controls.carrierCountryCode.controls.value.valueChanges
            .pipe(
                startWith(formGroupControl.carrierInformation.controls.carrierCountryCode.controls.value.value ?? ''),
                map(value => this._filter(value ?? ''))
            );

        this.filteredSuccessiveCarrierCountries = this.ecmrConsignmentFormGroup.controls.successiveCarrierInformation.controls.successiveCarrierCountryCode.controls.value.valueChanges
            .pipe(
                startWith(formGroupControl.successiveCarrierInformation.controls.successiveCarrierCountryCode.controls.value.value ?? ''),
                map(value => this._filter(value ?? ''))
            );
    }

    setFormConstraints() {
        this.canFillSenderFields = false;
        this.canFillCarrierFields = false;
        this.canFillConsigneeFields = false;
        if (this.userEcmrRoles.includes(EcmrRole.Sender)) {
            if (this.ecmrToEdit != null && this.ecmrToEdit.ecmrStatus === EcmrStatus.NEW || !this.ecmrToEdit) {
                this.canFillSenderFields = true;
            }
            if (this.ecmrToEdit != null && this.editorMode === EditorMode.TEMPLATE_EDIT) {
                this.canFillSenderFields = true;
            }
        }
        if (this.userEcmrRoles.includes(EcmrRole.Carrier) && this.ecmrToEdit && this.ecmrToEdit.ecmrStatus == EcmrStatus.LOADING) {
            this.canFillCarrierFields = true;
        }

        if (this.userEcmrRoles.includes(EcmrRole.Consignee) && this.ecmrToEdit && this.ecmrToEdit.ecmrStatus == EcmrStatus.IN_TRANSPORT) {
            this.canFillConsigneeFields = true;
        }
    }

    signSender() {
        if (this.senderFieldsAreValid() && this.ecmrConsignmentFormGroup.valid) {
            this.matDialog.open(SignaturePadDialogComponent, {
                width: '1000px',
                maxWidth: '95vw',
            })
                .afterClosed()
                .pipe(
                    filter(result => result),
                    switchMap(signResult => {
                        this.ecmrToEdit.ecmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
                        return (this.isExternalUser ?
                                this.externalUserService.updateEcmr(this.ecmrToEdit, this.tan) :
                                this.ecmrEditorService.updateEcmr(this.ecmrToEdit)
                        ).pipe(map(() => signResult))
                    }),
                    switchMap(result => {
                        const signature: Sign = {
                            signer: Signer.Sender,
                            data: result,
                            city: this.ecmrConsignmentFormGroup.controls.established.controls.customEstablishedIn.value
                        };

                        return this.isExternalUser ? this.externalUserService.signEcmr(signature, this.id, this.tan) : this.ecmrEditorService.signEcmr(signature, this.id);
                    }),
                    switchMap(() => this.isExternalUser ? this.externalUserService.getEcmrWithTan(this.id, this.tan) : this.ecmrEditorService.getEcmr(this.id))
                )
                .subscribe(ecmr => {
                    this.loadEcmr(ecmr);
                    this.setFormConstraints();
                    this.cd.detectChanges();
                });
        } else {
            this.ecmrConsignmentFormGroup.markAllAsTouched();
            const action = this.translateService.instant('general.snackbar_action');
            const message = this.translateService.instant('ecmr_editor.snackbar_error');
            this.snackbar.open(message, action, {duration: 3000})
        }
    }

    senderFieldsAreValid(): boolean {
        const invalidFields: AbstractControl[] = [];
        const invalidVolumes: AbstractControl[] = [];
        invalidFields.push(...this.checkControls(this.ecmrConsignmentFormGroup.controls.senderInformation, ['senderNamePerson', 'region']));
        invalidFields.push(...this.checkControls(this.ecmrConsignmentFormGroup.controls.consigneeInformation, ['consigneeNamePerson', 'region']));
        invalidFields.push(...this.checkControls(this.ecmrConsignmentFormGroup.controls.takingOverTheGoods, ['region']));
        invalidFields.push(...this.checkControls(this.ecmrConsignmentFormGroup.controls.carrierInformation, ['region']));
        if (this.ecmrConsignmentFormGroup.controls.itemList.controls.length > 0) {
            for (const itemGroup of this.itemList.controls) {

                const volumeControl = itemGroup.controls.volumeInM3.controls.supplyChainConsignmentItemGrossVolume;
                if (volumeControl.value == 0) {
                    volumeControl.setErrors({'minValue': true});
                    invalidVolumes.push(volumeControl);
                }

                invalidFields.push(...this.checkControls(itemGroup, []))
            }
        }

        invalidFields.push(...this.checkControls(this.ecmrConsignmentFormGroup.controls.established, []));

        for (const control of invalidFields) {
            control.setErrors({'mandatoryForSigning': true});
        }
        return invalidFields.length == 0 && invalidVolumes.length == 0;
    }

    signCarrier() {
        this.matDialog.open(SignaturePadDialogComponent)
            .afterClosed()
            .pipe(
                filter(result => result),
                switchMap(signResult => {
                    this.ecmrToEdit.ecmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
                    return (this.isExternalUser ?
                            this.externalUserService.updateEcmr(this.ecmrToEdit, this.tan) :
                            this.ecmrEditorService.updateEcmr(this.ecmrToEdit)
                    ).pipe(map(() => signResult))
                }),
                switchMap(result => {
                    const signature: Sign = {
                        signer: Signer.Carrier,
                        data: result,
                        city: null
                    }
                    return this.isExternalUser ? this.externalUserService.signEcmr(signature, this.id, this.tan) : this.ecmrEditorService.signEcmr(signature, this.id);
                }),
                switchMap(() => this.isExternalUser ? this.externalUserService.getEcmrWithTan(this.id, this.tan) : this.ecmrEditorService.getEcmr(this.id))
            )
            .subscribe(ecmr => {
                this.loadEcmr(ecmr);
                this.cd.detectChanges();
            });
    }

    signConsignee() {
        if (this.consignorFieldsAreValid() && this.ecmrConsignmentFormGroup.valid) {
            this.matDialog.open(SignaturePadDialogComponent)
                .afterClosed()
                .pipe(
                    filter(result => result),
                    switchMap(signResult => {
                        this.ecmrToEdit.ecmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
                        return (this.isExternalUser ?
                                this.externalUserService.updateEcmr(this.ecmrToEdit, this.tan) :
                                this.ecmrEditorService.updateEcmr(this.ecmrToEdit)
                        ).pipe(map(() => signResult))
                    }),
                    switchMap(result => {
                        const signature: Sign = {
                            signer: Signer.Consignee,
                            data: result,
                            city: this.ecmrConsignmentFormGroup.controls.takingOverTheGoods.controls.takingOverTheGoodsPlace.value!
                        }
                        return this.isExternalUser ? this.externalUserService.signEcmr(signature, this.id, this.tan) : this.ecmrEditorService.signEcmr(signature, this.id);
                    }),
                    switchMap(() => this.isExternalUser ? this.externalUserService.getEcmrWithTan(this.id, this.tan) : this.ecmrEditorService.getEcmr(this.id))
                )
                .subscribe(ecmr => {
                    this.loadEcmr(ecmr);
                });
        } else {
            this.ecmrConsignmentFormGroup.markAllAsTouched();
            const action = this.translateService.instant('general.snackbar_action');
            const message = this.translateService.instant('ecmr_editor.snackbar_error');
            this.snackbar.open(message, action, {duration: 3000})
        }
    }

    consignorFieldsAreValid(): boolean {
        const invalidFields: AbstractControl[] = this.checkControls(this.ecmrConsignmentFormGroup.controls.goodsReceived,
            ['consigneeReservationsObservations', 'consigneeTimeOfArrival', 'consigneeTimeOfDeparture', 'consigneeSignature'])
        for (const control of invalidFields) {
            control.setErrors({'mandatoryForSigning': true});
        }
        return invalidFields.length == 0;
    }

    checkControls(group: FormGroup, excludedElements: string[]): AbstractControl[] {
        const invalidFields: AbstractControl[] = [];
        for (const controlName in group.controls) {
            const control = group.controls[controlName];
            if (control instanceof FormGroup) {
                // recursive call for subgroups
                const subResult = this.checkControls(control, excludedElements)
                if (subResult.length > 0) {
                    invalidFields.push(...subResult);
                }
            } else if (!excludedElements.includes(controlName) && (control.value === null || control.value === '')) {
                invalidFields.push(control)
            }
        }
        return invalidFields;
    }

    /**
     * Filter function for country autocomplete fields
     */
    private _filter(value: string): string[] {
        if (value) {
            const filteredValue: string = value.toUpperCase();
            return this.countries.filter(option =>
                option.includes(filteredValue)
            );
        } else {
            return this.countries;
        }
    }

    private initializeForm() {
        if (this.editorMode === EditorMode.ECMR_NEW || this.editorMode === EditorMode.TEMPLATE_NEW) {
            this.ecmrConsignment = this.ecmrEditorService.createEmptyEcmrConsignment();
            this.userEcmrRoles = [EcmrRole.Sender];
            this.setFormConstraints();
        }
        if (this.editorMode === EditorMode.ECMR_EDIT) {
            if (this.tan != undefined) {
                const loadEcmrObs = this.externalUserService.getEcmrWithTan(this.id, this.tan);
                const loadRolesObs = this.externalUserService.getEcmrRolesForUser(this.id, this.tan);
                this.loadingService.showLoaderUntilCompleted(forkJoin({ecmr: loadEcmrObs, roles: loadRolesObs}))
                    .subscribe(result => {
                        this.loadEcmr(result.ecmr);
                        this.userEcmrRoles = result.roles;
                        this.setFormConstraints();
                    })

            } else {
                const loadEcmrObs = this.ecmrEditorService.getEcmr(this.id);
                const loadRolesObs = this.ecmrService.getEcmrRolesForCurrentUser(this.id);
                this.loadingService.showLoaderUntilCompleted(forkJoin({ecmr: loadEcmrObs, roles: loadRolesObs}))
                    .subscribe(result => {
                        this.loadEcmr(result.ecmr);
                        this.userEcmrRoles = result.roles;
                        this.setFormConstraints();
                    });
            }
        }
        if (this.editorMode === EditorMode.ECMR_COPY) {
            this.ecmrEditorService.getEcmr(this.id).subscribe(ecmr => {
                this.userEcmrRoles = [EcmrRole.Sender];
                this.loadEcmr(this.ecmrEditorService.copyEcmr(ecmr));
                this.setFormConstraints();
            });
        }
        if (this.editorMode === EditorMode.TEMPLATE_EDIT) {
            this.ecmrEditorService.getTemplate(Number.parseFloat(this.id)).subscribe(ecmr => {
                this.userEcmrRoles = [EcmrRole.Sender];
                this.canFillSenderFields = true;
                this.loadedTemplate = ecmr;
                this.loadEcmr(ecmr.ecmr);
                this.setFormConstraints();
            });
        }
    }

    private loadEcmr(data: Ecmr) {
        this.ecmrToEdit = data;
        this.ecmrConsignment = data.ecmrConsignment;
        this.ecmrConsignmentFormGroup.controls.itemList.controls = [];
        this.ecmrConsignment.itemList.forEach(() => {
            this.addNewItem();
        });
        this.ecmrConsignmentFormGroup.patchValue(this.ecmrConsignment);

        this.senderSignature = this.ecmrConsignment.signatureOrStampOfTheSender.senderSignature;
        this.carrierSignature = this.ecmrConsignment.signatureOrStampOfTheCarrier.carrierSignature;
        this.consigneeSignature = this.ecmrConsignment.goodsReceived.consigneeSignature;
    }

    shareEcmr(ecmr: Ecmr) {
        this.matDialog.open(ShareEcmrDialogComponent, {
            width: '800px',
            maxWidth: '90vw',
            data: {
                ecmr: ecmr,
                roles: this.userEcmrRoles,
                isExternalUser: this.isExternalUser,
                tan: this.tan
            }
        });
    }

    saveEcmr(returnToOverview: boolean) {
        this.ecmrConsignmentFormGroup.reset(this.ecmrConsignmentFormGroup.getRawValue())
        if (this.ecmrConsignmentFormGroup.valid && (this.editorMode == EditorMode.ECMR_NEW || this.editorMode == EditorMode.ECMR_COPY)) {
            const formValue: EcmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();

            const ecmr: Ecmr = {
                ecmrId: null,
                ecmrConsignment: formValue
            }

            this.groupService.getAllGroupsAsFlatList(true).pipe(
                switchMap(groups => {
                    if (groups.length > 1) {
                        return this.matDialog.open(EcmrCreateShareDialogComponent, {
                            data: groups,
                            width: '60vw',
                            maxHeight: '800px'
                        }).afterClosed()
                    } else if (groups.length == 0) {
                        return of([])
                    } else {
                        return of(groups)
                    }
                }),
                map(groups => groups as GroupFlat[]),
                switchMap(groups => {
                    return this.loadingService.showLoaderUntilCompleted(this.ecmrEditorService.saveEcmr(ecmr, groups))
                }),
                catchError(err => {
                    console.warn(err);
                    return of(null)
                })
            ).subscribe(ecmr => {
                if (ecmr && returnToOverview) this.returnToOverview()
            })


        } else if (this.ecmrConsignmentFormGroup.valid && (this.editorMode == EditorMode.ECMR_EDIT)) {
            this.ecmrToEdit.ecmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();

            const $updateObservable = this.isExternalUser ? this.externalUserService.updateEcmr(this.ecmrToEdit, this.tan) : this.ecmrEditorService.updateEcmr(this.ecmrToEdit)

            $updateObservable.subscribe({
                next: ecmr => {
                    this.loadEcmr(ecmr)
                    this.snackBarService.openSuccessSnackbar('ecmr_editor.save_success')
                    if (returnToOverview) this.returnToOverview()
                },
                error: error => {
                    const action = this.translateService.instant('general.snackbar_action');
                    const message = this.translateService.instant('general.snackbar_error');
                    this.snackbar.open(message, action, {duration: 3000})
                    console.error(error)
                }
            })
        } else {
            this.ecmrConsignmentFormGroup.markAllAsTouched();
        }
    }


    saveTemplate() {
        if (this.ecmrConsignmentFormGroup.valid && this.editorMode !== EditorMode.TEMPLATE_EDIT) {
            this.matDialog.open(TemplateNameDialogComponent, {
                minWidth: '350px'
            }).afterClosed().pipe(
                filter(dialogResult => dialogResult),
                switchMap(dialogResult => {
                    const formValues: EcmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
                    const ecmr: Ecmr = {
                        ecmrId: null,
                        ecmrConsignment: formValues
                    }
                    return this.ecmrEditorService.saveTemplate(ecmr, dialogResult);
                })
            ).subscribe(() => {
                this.returnToOverview()
            });
        }
        if (this.ecmrConsignmentFormGroup.valid && (this.editorMode == EditorMode.TEMPLATE_EDIT)) {
            this.loadedTemplate.ecmr.ecmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
            this.ecmrEditorService.updateTemplate(this.loadedTemplate).subscribe(() => {
                this.returnToOverview()
            })
        }
    }

    loadFromTemplate() {
        this.matDialog.open(LoadFromTemplateDialogComponent, {
            width: '90%'
        })
            .afterClosed()
            .subscribe(dialogResult => {
                if (dialogResult) {
                    this.loadedTemplate = dialogResult;
                    this.ecmrConsignment = dialogResult.ecmr.ecmrConsignment;
                    this.ecmrConsignmentFormGroup.controls.itemList.controls = []
                    this.addNewItem();
                    this.ecmrConsignmentFormGroup.patchValue(this.ecmrConsignment)
                }
            });
    }

    resetForm() {
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'ecmr_editor.reset_confirmation_message',
            }
        }).afterClosed().pipe(
            filter(dialogResult => dialogResult.isConfirmed === true))
            .subscribe(() => {
                this.ecmrConsignmentFormGroup.reset();

                this.ecmrConsignmentFormGroup.controls.itemList.controls = [];
                this.addNewItem();
            })
    }

    /**
     * Adds a new Item FormGroup to the ItemList FormArray
     */
    addNewItem() {
        this.ecmrConsignmentFormGroup.controls.itemList.controls.push(
            new FormGroup({
                marksAndNos: new FormGroup({
                    logisticsShippingMarksMarking: new FormControl(),
                    logisticsShippingMarksCustomBarcode: new FormControl()
                }),
                numberOfPackages: new FormGroup({
                    logisticsPackageItemQuantity: new FormControl(),
                }),
                methodOfPacking: new FormGroup({
                    logisticsPackageType: new FormControl(),
                }),
                natureOfTheGoods: new FormGroup({
                    transportCargoIdentification: new FormControl(),
                }),
                grossWeightInKg: new FormGroup({
                    supplyChainConsignmentItemGrossWeight: new FormControl(),
                }),
                volumeInM3: new FormGroup({
                    supplyChainConsignmentItemGrossVolume: new FormControl()
                })
            })
        )
    }

    /**
     * Removes an Item FormGroup from the ItemList FormArray
     */
    deleteItem(i: number) {
        this.ecmrConsignmentFormGroup.controls.itemList.controls.splice(i, 1);
        this.ecmrConsignmentFormGroup.controls.itemList.updateValueAndValidity();
    }

    returnToOverview() {
        if (!this.isTemplate()) {
            this.router.navigate(['/ecmr-overview'])
        } else {
            this.router.navigate(['/templates-overview'])
        }

    }

    protected readonly EditorMode = EditorMode;


    isTemplate(): boolean {
        return (this.editorMode == EditorMode.TEMPLATE_NEW || this.editorMode == EditorMode.TEMPLATE_EDIT);
    }

    isNotEdit(): boolean {
        return !(this.editorMode === EditorMode.ECMR_EDIT || this.editorMode === EditorMode.TEMPLATE_EDIT)
    }

    scrollToElement() {
        const element = document.getElementById('ecmr-signature-scroll');
        element?.scrollIntoView({behavior: 'smooth'});
    }

    checkCountry(forControl: string) {
        let formControl: FormControl<string | null>;
        if (forControl === 'sender') {
            formControl = this.ecmrConsignmentFormGroup.controls.senderInformation.controls.senderCountryCode.controls.value;
        } else if (forControl === 'carrier') {
            formControl = this.ecmrConsignmentFormGroup.controls.carrierInformation.controls.carrierCountryCode.controls.value;
        } else if (forControl === 'successiveCarrier') {
            formControl = this.ecmrConsignmentFormGroup.controls.successiveCarrierInformation.controls.successiveCarrierCountryCode.controls.value;
        } else if (forControl === 'consignee') {
            formControl = this.ecmrConsignmentFormGroup.controls.consigneeInformation.controls.consigneeCountryCode.controls.value;
        }

        const countryIsFromList = this.countries.find(country => country.includes(formControl.value!));
        if (!countryIsFromList && formControl!.value) {
            formControl!.setErrors({'invalidCountryCode': true});
        }
    }

    transformToUppercase(forControl: string) {
        let formControl: FormControl<string | null>;

        if (forControl === 'sender') {
            formControl = this.ecmrConsignmentFormGroup.controls.senderInformation.controls.senderCountryCode.controls.value;
        } else if (forControl === 'carrier') {
            formControl = this.ecmrConsignmentFormGroup.controls.carrierInformation.controls.carrierCountryCode.controls.value;
        } else if (forControl === 'successiveCarrier') {
            formControl = this.ecmrConsignmentFormGroup.controls.successiveCarrierInformation.controls.successiveCarrierCountryCode.controls.value;
        } else if (forControl === 'consignee') {
            formControl = this.ecmrConsignmentFormGroup.controls.consigneeInformation.controls.consigneeCountryCode.controls.value;
        }

        const currentValue = formControl!.value!;

        if (currentValue) {
            formControl!.setValue(currentValue.toUpperCase(), {emitEvent: false});
        }
    }

    checkSignStatus() {
        return this.canFillSenderFields || this.canFillCarrierFields || this.canFillConsigneeFields;
    }

    checkEcmrStatusNew() {
        return this.ecmrToEdit?.ecmrStatus !== EcmrStatus.NEW;
    }

    disableSave() {
        if (this.userEcmrRoles.includes(EcmrRole.Reader) && this.userEcmrRoles.length == 1) {
            return true;
        }
        if (this.userEcmrRoles.includes(EcmrRole.Sender) && this.canFillSenderFields) {
            return false;
        }
        if (this.userEcmrRoles.includes(EcmrRole.Carrier) && this.canFillCarrierFields) {
            return false;
        }
        return !(this.userEcmrRoles.includes(EcmrRole.Consignee) && this.canFillConsigneeFields);
    }
}

export function phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const phoneRegex = /^(\+)?[0-9]*$/;
        const valid = phoneRegex.test(control.value);
        return valid ? null : {invalidPhoneNumber: true};
    };
}

export function emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const valid = emailRegex.test(control.value);
        return valid ? null : {invalidEmail: true};
    };
}
