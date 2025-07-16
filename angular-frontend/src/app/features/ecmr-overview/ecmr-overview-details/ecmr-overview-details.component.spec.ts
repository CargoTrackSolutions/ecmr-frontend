/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmrOverviewDetailsComponent } from './ecmr-overview-details.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.component';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PayerType } from '../../../core/enums/PayerType';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

describe('EcmrOverviewDetailsComponent', () => {
    let component: EcmrOverviewDetailsComponent;
    let fixture: ComponentFixture<EcmrOverviewDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [EcmrOverviewDetailsComponent, BrowserAnimationsModule, TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })],
    providers: [
        TranslateService,
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    url: [
                        { path: 'someurl' } // Mock URL segments
                    ]
                }
            }
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();

        fixture = TestBed.createComponent(EcmrOverviewDetailsComponent);
        component = fixture.componentInstance;

        component.selectedEcmr = {
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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
