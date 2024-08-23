/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { CountryCode } from '../../core/enums/CountryCode';
import { catchError, filter, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { AsyncPipe, DatePipe, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
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
import { MatSelect } from '@angular/material/select';
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
import { EcmrTanService } from './ecmr-editor-service/ecmr-tan.service';
import { SignaturePadDialogComponent } from '../signature-pad/signature-pad-dialog.component';
import { Sign } from '../../core/models/Sign';
import { Signer } from '../../core/enums/Signer';
import { DateTimeService } from '../../shared/services/date-time.service';

export enum EditorMode {
    ECMR_EDIT,
    ECMR_COPY,
    ECMR_NEW,
    TEMPLATE_EDIT,
    TEMPLATE_NEW,
}

@Component({
    selector: 'app-ecmr-editor',
    standalone: true,
    imports: [
        MatCardModule,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatAutocomplete,
        MatOption,
        MatAutocompleteTrigger,
        AsyncPipe,
        MatToolbar,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
        CdkTextareaAutosize,
        MatMenuModule,
        NgIf,
        MatAccordion,
        MatExpansionModule,
        NgTemplateOutlet,
        TranslateModule,
        MatError,
        MatSelect,
        DynamicDisableControlDirective,
        NgClass
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
    breakpointSubscription: Subscription | undefined;

    editorMode: EditorMode;

    senderSignature: Signature | null;
    carrierSignature: Signature | null;
    consigneeSignature: Signature | null;

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
                email: new FormControl<string | null>(null),
                phone: new FormControl<string | null>(null)
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
                email: new FormControl<string | null>(null),
                phone: new FormControl<string | null>(null)
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
                email: new FormControl<string | null>(null),
                phone: new FormControl<string | null>(null)
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
                email: new FormControl<string | null>(null),
                phone: new FormControl<string | null>(null)
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

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private ecmrEditorService: EcmrEditorService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private groupService: GroupService,
                private ecmrTanService: EcmrTanService,
                private translateService: TranslateService,
                private cd: ChangeDetectorRef,
                private loadingService: LoadingService,
                protected dateTimeService: DateTimeService,
                public matDialog: MatDialog) {
    }

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
        ]).subscribe(result => {
            this.isMobile = result.matches;
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.tan = params['tan'];
            if (this.id) {
                this.editorMode = EditorMode.ECMR_EDIT;
            } else {
                this.editorMode = EditorMode.ECMR_NEW;
            }
        });

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
        if (this.editorMode == EditorMode.ECMR_EDIT) {
            if (this.ecmrConsignment.signatureOrStampOfTheCarrier.carrierSignature != null) {
                this.canFillConsigneeFields = true;
            } else if (this.ecmrConsignment.signatureOrStampOfTheSender.senderSignature != null) {
                this.canFillCarrierFields = true;
            } else {
                this.canFillSenderFields = true;
            }

        } else {
            this.canFillSenderFields = true;
        }
    }

    signSender() {
        this.saveEcmr(false);
        if (this.senderFieldsAreValid() && this.ecmrConsignmentFormGroup.valid) {
            this.matDialog.open(SignaturePadDialogComponent)
                .afterClosed()
                .pipe(
                    switchMap(result => {
                        if (result) {
                            const signature: Sign = {
                                signer: Signer.Sender,
                                data: result,
                                city: this.ecmrConsignmentFormGroup.controls.established.controls.customEstablishedIn.value
                            };

                            return this.ecmrEditorService.signEcmr(signature, this.id!);
                        } else {
                            return of(null);
                        }
                    })
                )
                .subscribe(savedSignature => {
                    if(savedSignature) {
                        this.ecmrConsignmentFormGroup.controls.signatureOrStampOfTheSender.controls.senderSignature.setValue(savedSignature);
                        this.senderSignature = savedSignature;

                        this.canFillSenderFields = false;
                        this.canFillCarrierFields = true;

                        this.cd.detectChanges();
                    }
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
                if(volumeControl.value == 0) {
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
        this.saveEcmr(false);
        this.matDialog.open(SignaturePadDialogComponent)
            .afterClosed()
            .pipe(
                switchMap(result => {
                    if (result) {
                        const signature: Sign = {
                            signer: Signer.Carrier,
                            data: result,
                            city: null
                        }
                        return this.ecmrEditorService.signEcmr(signature, this.id!);
                    } else {
                        return of(null);
                    }
                })
            )
            .subscribe(savedSignature => {
                if(savedSignature) {
                    this.ecmrConsignmentFormGroup.controls.signatureOrStampOfTheCarrier.controls.carrierSignature.setValue(savedSignature);
                    this.carrierSignature = savedSignature;

                    this.canFillCarrierFields = false;
                    this.canFillConsigneeFields = true;

                    this.cd.detectChanges();
                }
            });
    }

    signConsignor() {
        this.saveEcmr(false);
        if (this.consignorFieldsAreValid() && this.ecmrConsignmentFormGroup.valid) {
            this.matDialog.open(SignaturePadDialogComponent)
                .afterClosed()
                .pipe(
                    switchMap(result => {
                        if (result) {
                            const signature: Sign = {
                                signer: Signer.Consignee,
                                data: result,
                                city: this.ecmrConsignmentFormGroup.controls.takingOverTheGoods.controls.takingOverTheGoodsPlace.value!
                            }
                            return this.ecmrEditorService.signEcmr(signature, this.id!);
                        } else {
                            return of(null);
                        }
                    })
                )
                .subscribe(savedSignature => {
                    if(savedSignature) {
                        this.ecmrConsignmentFormGroup.controls.goodsReceived.controls.consigneeSignature.setValue(savedSignature);
                        this.consigneeSignature = savedSignature;

                        this.canFillConsigneeFields = false;
                    }
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
                if (subResult.length >= 0) {
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
            return []
        }
    }

    private initializeForm() {
        if (this.editorMode == EditorMode.ECMR_NEW || EditorMode.TEMPLATE_NEW) {
            this.ecmrConsignment = this.ecmrEditorService.createEmptyEcmrConsignment();
            this.setFormConstraints();
        }
        if (this.editorMode == EditorMode.ECMR_EDIT) {
            if (this.tan != undefined) {
                this.ecmrTanService.getEcmrWithTan(this.id, this.tan).subscribe(ecmr => {
                    this.loadEcmr(ecmr);
                })
            } else {
                this.ecmrEditorService.getEcmr(this.id).subscribe(ecmr => {
                    this.loadEcmr(ecmr);
                });
            }
        }
        if (this.editorMode == EditorMode.ECMR_COPY) {
            this.ecmrEditorService.getEcmr(this.id).subscribe(ecmr => {
                this.loadEcmr(this.ecmrEditorService.copyEcmr(ecmr));
            });
        }
        if (this.editorMode == EditorMode.TEMPLATE_EDIT) {
            this.ecmrEditorService.getTemplate(Number.parseFloat(this.id)).subscribe(ecmr => {
                this.loadedTemplate = ecmr;
                this.loadEcmr(ecmr.ecmr);
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
        this.setFormConstraints();

        this.senderSignature = this.ecmrConsignment.signatureOrStampOfTheSender.senderSignature;
        this.carrierSignature = this.ecmrConsignment.signatureOrStampOfTheCarrier.carrierSignature;
        this.consigneeSignature = this.ecmrConsignment.goodsReceived.consigneeSignature;

        if(this.senderSignature) {
            this.canFillSenderFields = false;
        }
        if(this.carrierSignature) {
            this.canFillCarrierFields = false;
        }
        if(this.consigneeSignature){
            this.canFillConsigneeFields = false;
        }
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
            this.ecmrEditorService.updateEcmr(this.ecmrToEdit).subscribe({
                next: () => {
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
        this.ecmrConsignmentFormGroup.reset();
        //Remove all items from itemList FormArray
        this.ecmrConsignmentFormGroup.controls.itemList.controls = [];
        this.addNewItem();
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
        return !(this.editorMode == EditorMode.ECMR_EDIT || this.editorMode == EditorMode.TEMPLATE_EDIT)
    }

    scrollToElement() {
        const element = document.getElementById('ecmr-signature-scroll');
        element?.scrollIntoView({behavior: 'smooth'});
    }
}
