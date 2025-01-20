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
import {SignatureType} from "../../../core/models/SignatureType";

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
                    senderNameCompany: 'IML',
                    senderNamePerson: 'Peter Müller',
                    senderStreet: 'Joseph-von-Fraunhofer-Str. 2-4',
                    senderPostcode: '44227',
                    senderCity: 'Dortmund',
                    senderCountryCode: {region: 'NRW', value: 'DE'},
                    senderContactInformation: {
                        email: 'test@test.com',
                        phone: '+15612331421'
                    }
                },
                consigneeInformation: {
                    consigneeNameCompany: 'Rhenus',
                    consigneeNamePerson: 'Martina Hill',
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
                    carrierNameCompany: 'DB Schenker',
                    carrierNamePerson: 'Thorsten Baumann',
                    carrierPostcode: '44279',
                    carrierStreet: 'Test Straße 2',
                    carrierCity: 'Dortmund',
                    carrierCountryCode: {region: 'NRW', value: 'DE'},
                    carrierLicensePlate: 'UN-DO-1234',
                    carrierContactInformation: {
                        email: 'test@test.com',
                        phone: '+15612331421'
                    }
                },
                successiveCarrierInformation: {
                    successiveCarrierCity: 'Dortmund',
                    successiveCarrierCountryCode: {region: 'NRW', value: 'DE'},
                    successiveCarrierNameCompany: 'DHL',
                    successiveCarrierStreet: 'Straße 1234',
                    successiveCarrierNamePerson: 'Angelika Trommel',
                    successiveCarrierPostcode: '44809',
                    successiveCarrierSignature: {
                        type: SignatureType.SignOnGlass,
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
                        phone: '+15612331421'
                    }
                },
                carriersReservationsAndObservationsOnTakingOverTheGoods: {
                    carrierReservationsObservations: 'Observations',
                    senderReservationsObservationsSignature: {
                        type: SignatureType.SignOnGlass,
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
                            logisticsShippingMarksCustomBarcode: ''
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
                signatureOrStampOfTheSender: {
                    senderSignature: {
                        type: SignatureType.SignOnGlass,
                        userName: 'Anna Tellman',
                        userCompany: 'DHL',
                        userStreet: 'Dahlacker 12',
                        userPostCode: '44791',
                        userCity: 'Bochum',
                        userCountry: 'Germany',
                        timestamp: new Date(),
                        data: '123lasc123'
                    }
                },
                signatureOrStampOfTheCarrier: {
                    carrierSignature: {
                        type: SignatureType.SignOnGlass,
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
                goodsReceived: {
                    confirmedLogisticsLocationName: '',
                    consigneeReservationsObservations: '',
                    consigneeSignature: {
                        type: SignatureType.SignOnGlass,
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
