/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { CountryCode } from '../../core/enums/CountryCode';
import { filter, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { EcmrConsignment } from '../../core/models/EcmrConsignment';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
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
import {MatSnackBar} from "@angular/material/snack-bar";
import {DynamicDisableControlDirective} from "./dynamic-disable-control.directive";

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
        DynamicDisableControlDirective
    ],
    templateUrl: './ecmr-editor.component.html',
    styleUrl: './ecmr-editor.component.scss'
})
export class EcmrEditorComponent implements OnInit {
    canFillSenderFields: boolean = false;
    canFillCarrierFields: boolean = false;
    canFillConsignorFields: boolean = false;

    isMobile: boolean = false;
    breakpointSubscription: Subscription | undefined;

    isEdit: boolean = false;
    isTemplate: boolean = false;

    @ViewChild(MatAccordion) accordion: MatAccordion;

    ecmrConsignment: EcmrConsignment;
    ecmrId: string|null;
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

    constructor(private breakpointObserver: BreakpointObserver,
                private router: Router,
                private ecmrEditorService: EcmrEditorService,
                private route: ActivatedRoute,
                private snackbar: MatSnackBar,
                private translateService: TranslateService,
                private cd: ChangeDetectorRef,
                private loadingService: LoadingService,
                public matDialog: MatDialog) {
    }

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver.observe([
            Breakpoints.Handset,
            Breakpoints.Tablet
        ]).subscribe(result => {
            this.isMobile = result.matches;
        });

        this.isTemplate = this.route.snapshot.url.join('/').includes('template-editor');

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            if (this.id) this.isEdit = true;
        });

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
    }

  setFormConstraints(){
      if(this.isEdit){
        if(this.ecmrConsignment.signatureOrStampOfTheCarrier.carrierSignature != null){
          this.canFillConsignorFields = true;
        } else if(this.ecmrConsignment.signatureOrStampOfTheSender.senderSignature != null){
          this.canFillCarrierFields = true;
        } else {
          this.canFillSenderFields = true;
        }

      } else {
        this.canFillSenderFields = true;
      }
  }

  //TODO: update this method, it is currently for testing purposes only!
  signSender(){
      if(this.ecmrConsignmentFormGroup.valid) {
        console.log("sign sender")
        const signature: Signature = {
          type: 'signature',
          userName: 'sender',
          userCompany: 'the company',
          userStreet: 'street',
          userPostCode: '1234',
          userCity: 'Bochum',
          userCountry: 'DE',
          timestamp: new Date(),
          data: 'sender data'
        }
        this.ecmrConsignmentFormGroup.controls.signatureOrStampOfTheSender.controls.senderSignature.setValue(signature);

        this.canFillSenderFields = false;
        this.canFillCarrierFields = true;

        this.cd.detectChanges();
      }
      else {
        this.ecmrConsignmentFormGroup.markAllAsTouched();
      }

  }

  //TODO: update this method, it is currently for testing purposes only!
  signCarrier(){
    console.log("sign carrier")
    const signature: Signature = {
      type: 'signature',
      userName: 'carrier',
      userCompany: 'the company',
      userStreet: 'street',
      userPostCode: '1234',
      userCity: 'Bochum',
      userCountry: 'DE',
      timestamp: new Date(),
      data: 'carrier data'
    }

    this.ecmrConsignmentFormGroup.controls.signatureOrStampOfTheCarrier.controls.carrierSignature.setValue(signature);

    this.canFillCarrierFields = false;
    this.canFillConsignorFields = true;

    this.cd.detectChanges();
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
        if (this.isEdit) {
            if (!this.isTemplate) {
                this.ecmrEditorService.getEcmr(this.id).subscribe(data => {
                    this.ecmrId = data.ecmrId;
                    this.ecmrConsignment = data.ecmrConsignment;
                    this.ecmrConsignmentFormGroup.controls.itemList.controls = []
                    this.ecmrConsignment.itemList.forEach(() => {
                        this.addNewItem();
                    })
                    this.ecmrConsignmentFormGroup.patchValue(this.ecmrConsignment)
                    this.setFormConstraints();
                })
            } else {
                this.ecmrEditorService.getTemplate(Number.parseFloat(this.id)).subscribe(data => {
                    this.loadedTemplate = data;
                    this.ecmrConsignment = data.ecmr.ecmrConsignment;
                    this.ecmrConsignmentFormGroup.controls.itemList.controls = []
                    this.ecmrConsignment.itemList.forEach(() => {
                        this.addNewItem();
                    })
                    this.ecmrConsignmentFormGroup.patchValue(this.ecmrConsignment)
                    this.setFormConstraints();
                })
            }
        } else {
            this.ecmrConsignment = this.ecmrEditorService.createEmptyEcmrConsignment();
            this.setFormConstraints();
        }
    }

    saveEcmr() {
        if (this.ecmrConsignmentFormGroup.valid && !this.isEdit) {
            const formValue: EcmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
            const ecmr: Ecmr = {
                ecmrId: null,
                ecmrConsignment: formValue
            }
            this.loadingService.showLoaderUntilCompleted(this.ecmrEditorService.saveEcmr(ecmr))
                .subscribe(() => {
                    this.returnToOverview()
                })
        } else if (this.ecmrConsignmentFormGroup.valid && this.isEdit) {
          const formValue: EcmrConsignment = this.ecmrConsignmentFormGroup.getRawValue();
          const ecmr: Ecmr = {
            ecmrId: this.ecmrId,
            ecmrConsignment: formValue
          }

          this.ecmrEditorService.updateEcmr(ecmr).subscribe({
            next: () => { this.returnToOverview()},
            error: error => {
              const action = this.translateService.instant('general.snackbar_action');
              const message = this.translateService.instant('general.snackbar_error');
              this.snackbar.open(message, action, {duration: 3000})
              console.error(error)}
          })
        }
    }

    saveTemplate() {
        if (this.ecmrConsignmentFormGroup.valid && !this.isEdit || !this.loadedTemplate || !this.isTemplate) {
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
        } else {
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
                    this.ecmrConsignment.itemList.forEach(() => {
                        this.addNewItem();
                    })
                    this.ecmrConsignmentFormGroup.patchValue(this.ecmrConsignment)
                }
            });
    }

    resetForm() {
        this.ecmrConsignmentFormGroup.reset();
        //Remove all items from itemList FormArray
        this.ecmrConsignmentFormGroup.controls.itemList.controls = [];
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
        this.ecmrConsignmentFormGroup.controls.itemList.controls.splice(i, 1)
    }

    returnToOverview() {
        if (!this.isTemplate) {
            this.router.navigate(['/ecmr-overview'])
        } else {
            this.router.navigate(['/templates-overview'])
        }

    }
}
