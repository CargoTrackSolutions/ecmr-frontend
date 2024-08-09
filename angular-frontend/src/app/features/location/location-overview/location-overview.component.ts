/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { Location } from '../../../core/models/Location';
import { LocationService } from '../location-service/location.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CountryCode } from '../../../core/enums/CountryCode';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TemplateNameDialogComponent } from '../../template-overview/template-name-dialog/template-name-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-location-admin',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    MatToolbar,
    MatToolbarRow,
    TranslateModule,
    MatTable,
    MatSortModule,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatIconButton,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatPaginator,
    MatTooltip,
    NgIf,
    ReactiveFormsModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './location-overview.component.html',
  styleUrl: './location-overview.component.scss'
})
export class LocationOverviewComponent implements OnInit {
  displayedColumns: string[] = ['actions','name','street','postcode','city','countryCode','officeNumber']
  dataSource = new MatTableDataSource<Location>();
  allLocations: Location[] = [];
  showFilter = false;

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  filterFormGroup = new FormGroup({
    name: new FormControl<string | null>(null),
    street: new FormControl<string | null>(null),
    postcode: new FormControl<string | null>(null),
    city: new FormControl<string | null>(null),
    countryCode: new FormControl<string | null>(null),
    officeNumber: new FormControl<string | null>(null)
  })

  constructor(private locationService: LocationService, private matDialog: MatDialog) {
  }

  ngOnInit() {
    //this.locationService.getAllLocations().subscribe(locations => {
    //  this.dataSource.data = locations;
    //  this.allLocations = {...locations};
    //})
    this.allLocations.push(
        {id: 0,
        city: 'Howi',
        name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Street 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '122', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'AllesKLAR', officeNumber: '09212', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.BR
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.BR
        },
        {id: 0,
          city: 'Irgendwas',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '213', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '3', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '2', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        },
        {id: 0,
          city: 'Howi',
          name: 'Test', officeNumber: '1', postcode: '44263', street: 'Rhenus-Platz 1',
          countryCode: CountryCode.DE
        })
    this.dataSource.data = this.allLocations;
    this.dataSource.filterPredicate = this.createFilter();
    this.filterFormGroup.valueChanges.subscribe(() => {
      this.applyFilter();
    })
  }

  sort(sort: Sort) {
    const data = this.dataSource.data.slice();
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'street':
          return compare(a.street, b.street, isAsc);
        case 'postcode':
          return compare(a.postcode, b.postcode, isAsc);
        case 'city':
          return compare(a.city, b.city, isAsc);
        case 'countryCode':
          return compare(a.countryCode, b.countryCode, isAsc);
        case 'officeNumber':
          return compare(a.officeNumber, b.officeNumber, isAsc);
        default:
          return 0;
      }
    });
  }

  applyFilter() {
    const filterValues = this.filterFormGroup.value;
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  createFilter(): (data: Location, filter: string) => boolean {
    return (data: Location, filter: string): boolean => {
      const searchTerms: { [key in keyof Location]?: string } = JSON.parse(filter);

      return Object.keys(searchTerms).every(key => {
        const typedKey = key as keyof Location;
        const searchTerm = searchTerms[typedKey];
        const dataValue = data[typedKey];

        if (searchTerm) {
          return dataValue != null ? dataValue.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false;
        } else {
          return true;
        }
      });
    };
  }

  onCreateClick() {

  }

  onEditClick(location: Location) {
    this.matDialog.open(TemplateNameDialogComponent, {
      minWidth: '350px',
      data: {
        location: location
      }
    });
  }

  onDeleteClick(location: Location) {
    console.log(location);
  }
}

function compare(a: number | string | Date | null, b: number | string | Date | null, isAsc: boolean) {
  if (a && b) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  return 0
}
