/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrOverviewComponent } from './ecmrOverview.component';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableModule
} from '@angular/material/table';
import { MatTabBody, MatTabHeader } from '@angular/material/tabs';
import { MatInput } from '@angular/material/input';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkScrollable } from '@angular/cdk/overlay';
import { MatDivider } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ecmr } from '../../core/models/Ecmr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PayerType } from '../../core/enums/PayerType';
import { of } from 'rxjs';
import { EcmrService } from '../../shared/services/ecmr.service';

describe('OverviewComponent', () => {
    let component: EcmrOverviewComponent;
    let fixture: ComponentFixture<EcmrOverviewComponent>;

    const ecmrServiceSpy = jasmine.createSpyObj('EcmrService', ['getAllEcmr', 'getShowColumns', 'getDisplayedColumns', 'getFilterRequest', 'getEcmrSort', 'getEcmrPageSize']);

    const testEcmr: Ecmr = {
        ecmrId: 'FhG-IML-504',
        ecmrConsignment: {
            senderInformation: {
                senderCompanyName: 'IML',
                senderPersonName: 'Peter Müller',
                senderStreet: 'Joseph-von-Fraunhofer-Str. 2-4',
                senderPostcode: '44227',
                senderCity: 'Dortmund',
                senderCountryCode: {region: 'NRW', value: 'DE'},
                senderContactInformation: {
                    email: 'test@test.com',
                    phone: '+15612331421'
                }
            },
            multiConsigneeShipment: {
                isMultiConsigneeShipment: false
            },
            consigneeInformation: {
                consigneeCompanyName: 'Rhenus',
                consigneePersonName: 'Martina Hill',
                consigneePostcode: '44227',
                consigneeStreet: 'Test Straße 2',
                consigneeCity: 'Dortmund',
                consigneeCountryCode: {region: 'NRW', value: 'DE'},
                consigneeContactInformation: {
                    email: 'test@test.com',
                    phone: '+15612331421'
                }
            },
            takingOverTheGoods: {
                takingOverTheGoodsPlace: 'goods taking over value',
                logisticsTimeOfArrivalDateTime: new Date(),
                logisticsTimeOfDepartureDateTime: new Date(),
            },
            deliveryOfTheGoods: {
                logisticsLocationCity: 'goods delivery value',
                logisticsLocationOpeningHours: '1-2',
            },
            sendersInstructions: {
                transportInstructionsDescription: 'Truck'
            },
            carrierInformation: {
                carrierCompanyName: 'DB Schenker',
                carrierDriverName: 'Thorsten Baumann',
                carrierPostcode: '44279',
                carrierStreet: 'Test Straße 2',
                carrierCity: 'Dortmund',
                carrierCountryCode: {region: 'NRW', value: 'DE'},
                carrierLicensePlate: 'UN-DO-1234',
                carrierContactInformation: {
                    email: 'test@test.com',
                    carrierPhone: '+15612331421',
                    driverPhone: '+15612331421'
                }
            },
            successiveCarrierInformation: {
                successiveCarrierCity: 'Dortmund',
                successiveCarrierCountryCode: {region: 'NRW', value: 'DE'},
                successiveCarrierCompanyName: 'DHL',
                successiveCarrierStreet: 'Straße 1234',
                successiveCarrierDriverName: 'Angelika Trommel',
                successiveCarrierPostcode: '44809',
                successiveCarrierSignature: {
                    userName: 'AT',
                    userCompany: 'DHL',
                    userStreet: 'Dahlacker 12',
                    userPostCode: '44791',
                    userCity: 'Bochum',
                    userCountry: 'Germany',
                    timestamp: new Date(),
                    data: '123lasc123'
                },
                successiveCarrierContactInformation: {
                    email: 'test@test.com',
                    carrierPhone: '+15612331421',
                    driverPhone: '+15612331421'
                }
            },
            carriersReservationsAndObservationsOnTakingOverTheGoods: {
                carrierReservationsObservations: 'Observations',
                senderReservationsObservationsSignature: {
                    userName: 'AT',
                    userCompany: 'DHL',
                    userStreet: 'Dahlacker 12',
                    userPostCode: '44791',
                    userCity: 'Bochum',
                    userCountry: 'Germany',
                    timestamp: new Date(),
                    data: '123lasc123'
                }
            },
            documentsHandedToCarrier: {
                documentsRemarks: 'Remarks'
            },
            itemList: [{
                marksAndNos:
                    {
                        logisticsShippingMarksMarking: '',
                        logisticsShippingMarksCustomBarcodeList: [{barcode: ''}]
                    },
                numberOfPackages: {logisticsPackageItemQuantity: 5},
                methodOfPacking: {logisticsPackageType: 'boxed'},
                natureOfTheGoods: {transportCargoIdentification: ''},
                grossWeightInKg: {supplyChainConsignmentItemGrossWeight: 123},
                volumeInM3: {supplyChainConsignmentItemGrossVolume: 15}
            }],
            specialAgreementsSenderCarrier: {customSpecialAgreement: ''},
            toBePaidBy: {
                customChargeCarriage: {
                    value: 10000,
                    currency: 'EUR',
                    payer: PayerType.Sender
                },
                customChargeSupplementary: {
                    value: 10000,
                    currency: 'EUR',
                    payer: PayerType.Sender
                },
                customChargeCustomsDuties: {
                    value: 10000,
                    currency: 'EUR',
                    payer: PayerType.Sender
                },
                customChargeOther: {
                    value: 10000,
                    currency: 'EUR',
                    payer: PayerType.Sender
                },
            },
            otherUsefulParticulars: {
                customParticulars: '',
            },
            cashOnDelivery: {
                customCashOnDelivery: 12,
            },
            established: {
                customEstablishedDate: new Date(),
                customEstablishedIn: ''
            },
            goodsReceived: {
                confirmedLogisticsLocationName: '',
                consigneeReservationsObservations: '',
                consigneeSignature: {
                    userName: 'AT',
                    userCompany: 'DHL',
                    userStreet: 'Dahlacker 12',
                    userPostCode: '44791',
                    userCity: 'Bochum',
                    userCountry: 'Germany',
                    timestamp: new Date(),
                    data: '123lasc123'
                },
                consigneeSignatureDate: new Date(),
                consigneeTimeOfArrival: new Date(),
                consigneeTimeOfDeparture: new Date(),
            },
            nonContractualPartReservedForTheCarrier: {
                nonContractualCarrierRemarks: '',
            },
            referenceIdentificationNumber: {value: 'FhG-IML-504'},
        }
    }

    beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [EcmrOverviewComponent,
                    BrowserAnimationsModule,
                    MatToolbar,
                    MatToolbarRow,
                    MatIcon,
                    MatButton,
                    MatLabel,
                    MatTable,
                    MatTabHeader,
                    MatTabBody,
                    MatHeaderCell,
                    MatHeaderCellDef,
                    MatCellDef,
                    MatColumnDef,
                    MatCell,
                    MatHeaderRowDef,
                    MatRow,
                    MatRowDef,
                    MatHeaderRow,
                    MatTableModule,
                    MatInput,
                    MatFormField,
                    MatPrefix,
                    MatSuffix,
                    MatSort,
                    MatSortHeader,
                    MatSortModule,
                    MatIconButton,
                    MatButtonToggleGroup,
                    MatButtonToggle,
                    MatCheckbox,
                    MatSelect,
                    ReactiveFormsModule,
                    MatOption,
                    MatAccordion,
                    MatExpansionPanel,
                    MatExpansionPanelTitle,
                    MatExpansionPanelDescription,
                    MatExpansionPanelHeader,
                    MatDialogContent,
                    MatDialogTitle,
                    MatTooltip,
                    MatMenu,
                    MatMenuTrigger,
                    MatMenuItem,
                    NgIf,
                    MatCard,
                    MatCardContent,
                    MatMiniFabButton,
                    CdkScrollable,
                    MatDivider,
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: HttpLoaderFactory,
                            deps: [HttpClient]
                        }
                    })],
                providers: [
                    {provide: EcmrService, useValue: ecmrServiceSpy},
                    provideHttpClient(withInterceptorsFromDi())
                ]
            })
                .compileComponents();

            ecmrServiceSpy.getAllEcmr.and.returnValue(of([testEcmr]));

            fixture = TestBed.createComponent(EcmrOverviewComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        }
    )
    ;

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize data', () => {
        component.ngOnInit();
        expect(ecmrServiceSpy.getAllEcmr).toHaveBeenCalled();
    });


})
;
