/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EcmrOverviewComponent} from './ecmrOverview.component';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableModule
} from "@angular/material/table";
import {MatTabBody, MatTabHeader} from "@angular/material/tabs";
import {MatInput} from "@angular/material/input";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatOption, MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatTooltip} from "@angular/material/tooltip";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {NgIf} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {CdkScrollable} from "@angular/cdk/overlay";
import {MatDivider} from "@angular/material/divider";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {EcmrOverviewService} from "./ecmr-overview-service/ecmr-overview.service";
import {EcmrData} from "../../core/models/EcmrData";

describe('OverviewComponent', () => {
  let component: EcmrOverviewComponent;
  let fixture: ComponentFixture<EcmrOverviewComponent>;

  const overviewServiceSpy = jasmine.createSpyObj('EcmrOverviewService', ['initializeData', 'getData']);

  const testEcmr: EcmrData =  {
    ecmrId: "FhG-IML-504",
    ecmrConsignment: {
      senderInformation: {
        senderNameCompany: {value: "IML"},
        senderNamePerson: {value: "Peter Müller"},
        senderStreet: {value: "Joseph-von-Fraunhofer-Str. 2-4"},
        senderPostcode: {value: "44227"},
        senderCity: {value: "Dortmund"},
        senderCountry: {region: "NRW", value: "DE"},
      },
      consigneeInformation: {
        consigneeNameCompany: {value: "Rhenus"},
        consigneeNamePerson: {value: "Martina Hill"},
        consigneePostcode: {value: "44227"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      takingOverTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods taking over value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      deliveryOfTheGoods: {
        logisticsTakingOverTheGoods: {value: "goods delivery value"},
        logisticsTakingOverTheGoodsCountry: {value: "Germany"},
        logisticsEventActualOccurrence: {value: new Date()},
        logisticsTimeOfArrivalDate: {value: new Date()},
        logisticsTimeOfDepartureDate: {value: new Date()},
      },
      sendersInstructions: {
        transportInstructionsDescription: {value: "Truck"}
      },
      carrierInformation: {
        consigneeNameCompany: {value: "DB Schenker"},
        consigneeNamePerson: {value: "Thorsten Baumann"},
        consigneePostcode: {value: "44279"},
        consigneeCity: {value: "Dortmund"},
        consigneeCountry: {region: "NRW", value: "DE"},
      },
      successiveCarriers: {
        successiveCarrierCity: {value: "Dortmund"},
        successiveCarrierCountry: {value: "Germany"},
        successiveCarrierName: {value: "DHL"},
        successiveCarrierPersonName: {value: "Angelika Trommel"},
        successiveCarrierPostcode: {value: "44809"},
        successiveCarrierSignature: {
          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        successiveCarrierSignatureDate: {value: new Date()},
        successiveCarrierStreetName: {value: "Dahlacker 12"},
      },
      carriersReservationsAndObservationsOnTakingOverTheGoods: {
        carrierReservationsObservations: {value: "Observations"},
        senderReservationsObservationsSignature: {
          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      documentsHandedToCarrier: {
        documentsRemarks: {value: "Remarks"}
      },
      itemList: [{
        marksAndNos:
          {
            logisticsShippingMarksMarking: {value: ""},
            logisticsShippingMarksCustomBarcode: {value: ""}
          },
        numberOfPackages: {logisticsPackageItemQuantity: {value: 5}},
        methodOfPacking: {logisticsPackageType: {value: "boxed"}},
        natureOfTheGoods: {transportCargoIdentification: {value: ""}},
        grossWeightInKg: {supplyChainConsignmentItemGrossWeight: {value: 123}},
        volumeInM3: {supplyChainConsignmentItemGrossVolume: {value: 15}}
      }],
      specialAgreementsSenderCarrier: {customSpecialAgreement: {value: ""}},
      toBePaidBy: {
        customChargeCarriage: {value: 5},
        customChargeSupplementary: {value: 5},
        customChargeCustomsDuties: {value: 5},
        customChargeOther: {value: 5}
      },
      otherUsefulParticulars: {customParticulars: {value: ""}},
      cashOnDelivery: {customCashOnDelivery: {value: 12}},
      established: {
        customEstablishedDate: {value: new Date()},
        customEstablishedIn: {value: ""}
      },
      signatureOrStampOfTheSender: {
        senderSignature: {
          value: {
            type: "",
            userName: "Anna Tellman",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      signatureOrStampOfTheCarrier: {
        carrierSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        }
      },
      goodsReceived: {
        confirmedLogisticsLocationName: {value: ""},
        consigneeReservationsObservations: {value: ""},
        consigneeSignature: {

          value: {
            type: "",
            userName: "AT",
            userCompany: "DHL",
            userStreet: "Dahlacker 12",
            userPostCode: "44791",
            userCity: "Bochum",
            userCountry: "Germany",
            timestamp: new Date(),
            data: "123lasc123"
          }
        },
        consigneeSignatureDate: {value: new Date()},
        consigneeTimeOfArrival: {value: new Date()},
        consigneeTimeOfDeparture: {value: new Date()},
      },
      nonContractualPartReservedForTheCarrier: {nonContractualCarrierRemarks: {value: ""}},
      referenceIdentificationNumber: {value: "FhG-IML-504"},
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EcmrOverviewComponent,
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
      ],
      providers: [
        {provide: EcmrOverviewService, useValue: overviewServiceSpy},
      ]
    })
    .compileComponents();

    overviewServiceSpy.getData.and.returnValue(testEcmr)

    fixture = TestBed.createComponent(EcmrOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data', () => {
    expect(overviewServiceSpy.initializeData).toHaveBeenCalled();
    expect(overviewServiceSpy.getData).toHaveBeenCalled();
  });

  it('should show ecmr details', () => {
    component.showDetailsForEcmrAtIndex(1)
    expect(component.showDetails).toBeTrue()

    component.closeDetailsView()
    expect(component.showDetails).toBeFalse()
  });

  it('should hide columns', () => {
    expect(component.toggledColumns[0]).toBeTrue()
    component.toggleColumnAtIndex(0)
    expect(component.toggledColumns[0]).toBeFalse()

    const displayedCols = component.displayedColumns.length
    component.updateColumns()
    expect(component.displayedColumns.length < displayedCols).toBeTrue()
  });
});
