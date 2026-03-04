/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { AfterViewInit, Component, computed, inject, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { Event, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { EcmrOverviewDetailsComponent } from './ecmr-overview-details/ecmr-overview-details.component';


import { Ecmr } from '../../core/models/Ecmr';
import { EcmrTableComponent } from '../../shared/components/ecmr-table/ecmr-table.component';
import { catchError, filter, forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { EcmrService } from '../../shared/services/ecmr.service';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShareEcmrDialogComponent } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog.component';
import { EcmrStatus } from '../../core/models/EcmrStatus';
import { EcmrActionService } from '../../shared/services/ecmr-action.service';
import { EcmrRole } from '../../core/enums/EcmrRole';
import { FilterRequest } from './filter-request';
import { EcmrPage } from '../../core/models/EcmrPage';
import { LoadingService } from '../../core/services/loading.service';
import { EcmrType } from '../../core/models/EcmrType';
import { SnackbarService } from '../../core/services/snackbar.service';
import { ExternalEcmrImportDialogComponent } from './dialog/external-ecmr-import-dialog/external-ecmr-import-dialog.component';
import { SealMetadataService } from '../../shared/services/seal-metadata.service';
import { SealMetadata } from '../../core/models/SealMetadata';
import { ShareEcmrDialogData } from '../../shared/dialogs/share-ecmr-dialog/share-ecmr-dialog-data';
import { DocumentModel } from '../../core/models/DocumentModel';
import { DocumentService } from '../../shared/services/document.service';
import { UserRole } from '../../core/enums/UserRole';
import { AuthService } from '../../core/services/auth.service';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { GroupFlat } from '../../core/models/GroupFlat';
import { GroupService } from '../group/group.service';

@Component({
    selector: 'app-overview',
    imports: [
        MatToolbar,
        MatToolbarRow,
        MatIcon,
        MatButton,
        MatTableModule,
        MatSortModule,
        MatIconButton,
        ReactiveFormsModule,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        TranslateModule,
        EcmrTableComponent,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        TranslateModule,
        EcmrOverviewDetailsComponent,
        MatDrawer,
        MatDrawerContainer,
        MatFormField,
        MatLabel,
        MatInput,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatOption,
        MatSuffix
    ],
    templateUrl: './ecmrOverview.component.html',
    styleUrl: './ecmrOverview.component.scss'
})
export class EcmrOverviewComponent implements OnInit, AfterViewInit {
    dialog = inject(MatDialog);
    snackbar = inject(MatSnackBar);
    ecmrService = inject(EcmrService);
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    private breakpointObserver = inject(BreakpointObserver);
    protected ecmrActionService = inject(EcmrActionService);
    private snackbarService = inject(SnackbarService);
    private sealMetadataService = inject(SealMetadataService);
    private readonly documentService = inject(DocumentService);
    readonly authService = inject(AuthService);
    private groupService = inject(GroupService);


    isMobile: boolean = false;
    breakpointSubscription: Subscription | undefined;

    @ViewChild(EcmrTableComponent) table: EcmrTableComponent;
    @ViewChild(EcmrOverviewDetailsComponent) ecmrOverviewDetails: EcmrOverviewDetailsComponent;
    @ViewChild(MatSort) sort: MatSort = new MatSort();

    // ecmr selected
    selectedEcmr: Ecmr | null = null;
    selectedEcmrRoles: EcmrRole[];
    selectedEcmrs: Ecmr[] = [];
    selectedEcmrSealMetadata: SealMetadata[] = [];

    ecmr: Ecmr[] = [];

    filterRequest: FilterRequest = {
        ecmrId: null,
        referenceId: null,
        from: null,
        to: null,
        transportType: null,
        status: null,
        licensePlate: null,
        carrierName: null,
        carrierPostCode: null,
        consigneePostCode: null,
        lastEditor: null,
        groupId: null
    };

    selectedGroupFilter: WritableSignal<GroupFlat | null> = signal<GroupFlat | null>(null);
    availableGroups: WritableSignal<GroupFlat[]> = signal<GroupFlat[]>([]);
    filteredAvailableGroups: WritableSignal<GroupFlat[]> = signal<GroupFlat[]>([]);
    availableGroupsFormControl = new FormControl<string | GroupFlat>('');
    groupsLoaded: Signal<boolean> = computed(() => {
        return this.availableGroups().length > 0;
    });

    initialSort: Sort = {active: '', direction: ''};
    readonly ecmrType: EcmrType = EcmrType.ECMR;
    protected readonly EcmrStatus = EcmrStatus;
    protected readonly open = open;
    protected readonly UserRole = UserRole;

    selectedFiles: WritableSignal<File[]> = signal<File[]>([]);
    documentsForSelectedEcmr: WritableSignal<DocumentModel[]> = signal<DocumentModel[]>([]);

    constructor() {
        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is NavigationEnd => e instanceof NavigationEnd)
        ).subscribe((ev: NavigationEnd) => {
            if (ev.url === '/ecmr-overview') {
                const nav = this.router.getCurrentNavigation();
                if (nav?.extras?.state) {
                    if (nav.extras.state['selectedEcmr'] !== undefined) {
                        this.selectEcmr(nav.extras.state['selectedEcmr']);
                    }
                }
            }
        });
    }

    ngOnInit() {
        this.breakpointSubscription = this.breakpointObserver
            .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
            .subscribe((result) => {
                this.isMobile = result.matches;
            });

        const savedFilterRequest = this.ecmrService.getFilterRequest();
        if (savedFilterRequest) this.filterRequest = savedFilterRequest;

        if (!this.isMobile) {
            const savedSort = this.ecmrService.getEcmrSort(this.ecmrType);
            if (savedSort) this.initialSort = savedSort;
        }

        this.setupGroupFilter();
    }

    ngAfterViewInit() {
        this.loadData().subscribe(data => {
            this.updateTableData(data);
            this.table.initFilter();
        });
    }

    loadData(): Observable<EcmrPage> {
        const paginator = this.table.paginator
        this.filterRequest.groupId = this.getSelectedGroupId();

        if (this.isMobile || !this.table.sort?.active || !this.table.sort?.direction) {
            return this.loadingService.showLoaderUntilCompleted(this.ecmrService.getAllEcmr(this.filterRequest, EcmrType.ECMR, paginator.pageIndex, paginator.pageSize, 'creationDate', 'ASC'));
        } else {
            return this.loadingService.showLoaderUntilCompleted(this.ecmrService.getAllEcmr(this.filterRequest, EcmrType.ECMR, paginator.pageIndex, paginator.pageSize, this.table.sort.active, this.table.sort.direction.toUpperCase()));
        }
    }

    updateTableData(data: EcmrPage) {
        this.table.dataSource.data = data.ecmrs;
        this.table.ecmr.set(data.ecmrs)
        this.ecmr = data.ecmrs;
        this.table.paginator.length = data.totalElements;
        this.clearMultiSelection();
    }

    createNewEcmr() {
        this.router.navigateByUrl('/ecmr-editor');
    }

    importExternalEcmr() {
        this.dialog.open(ExternalEcmrImportDialogComponent,
            {
                width: '90vw',
                maxWidth: '700px'
            }).afterClosed().pipe(
            switchMap(result => {
                if (result) {
                    return this.loadData()
                }
                return of(null)
            })
        ).subscribe(data => {
            if (data) {
                this.updateTableData(data);
            }
        })
    }

    shareEcmr(ecmr: Ecmr) {
        if (ecmr?.ecmrId) {
            this.loadingService.showLoaderUntilCompleted(forkJoin({
                sealMetaData: this.loadSealMetadata(ecmr.ecmrId),
                roles: this.ecmrService.getEcmrRolesForCurrentUser(ecmr.ecmrId)
            })).subscribe(result => {
                this.dialog.open(ShareEcmrDialogComponent, {
                    width: '800px',
                    maxWidth: '90vw',
                    data: {
                        ecmr: ecmr,
                        sealMetadata: result.sealMetaData,
                        roles: result.roles,
                        isExternalUser: false
                    } as ShareEcmrDialogData
                });
            })
        }
    }

    editEcmr(ecmrId: string) {
        if (ecmrId) this.router.navigateByUrl(`/ecmr-editor/${ecmrId}`);
    }

    signEcmr(ecmrId: string) {
        if (ecmrId) this.router.navigateByUrl(`/ecmr-editor/${ecmrId}?action=seal`); // or /seal or seal=true
    }

    deleteEcmr(ecmrId: string) {
        this.dialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'overview.delete_ecmr_dialog_text'
            }
        }).afterClosed().pipe(
            filter(dialogResult => dialogResult.isConfirmed === true && !!ecmrId),
            switchMap(() => this.ecmrService.deleteEcmr(ecmrId)),
            switchMap(() => this.loadData())
        ).subscribe(data => {
            this.snackbarService.openSuccessSnackbar('overview.delete_success');
            this.updateTableData(data);
        });
    }

    deleteButtonVisible(ecmr: Ecmr) {
        return ecmr.ecmrStatus === EcmrStatus.NEW
    }

    bulkDeleteButtonVisible() {
        return this.selectedEcmrs.every(ecmr => ecmr.ecmrStatus === EcmrStatus.NEW);
    }

    historyOfEcmr(ecmrId: string, refId: string) {
        if (ecmrId) this.router.navigateByUrl(`/history/${ecmrId}/${refId}`);
    }

    moveToArchive(ecmrId: string) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'overview.confirmation_message',
                checkBoxText: 'confirmation.checkbox',
            },
        });
        dialogRef.afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(result => {
                if (result.isCheckboxTicked) {
                    this.onCopyEcmr(ecmrId);
                }
                return this.ecmrService.moveToArchive(ecmrId);
            }),
            switchMap(() => this.loadData()),
            catchError(err => {
                this.snackbarService.openErrorSnackbar('general.snackbar_error');
                console.error(err);
                return of(null)
            }),
        ).subscribe(data => {
            if (data) {
                this.snackbarService.openSuccessSnackbar('overview.move_to_archive_success');
                this.updateTableData(data);
                this.selectedEcmr = null;
            }
        });
    }

    onCopyEcmr(ecmrId: string | null | undefined) {
        if (ecmrId) {
            this.router.navigateByUrl(`/ecmr-editor/${ecmrId}/copy`);
        }
    }

    selectEcmr(ecmr: Ecmr | null) {
        this.selectedEcmrSealMetadata = [];
        if (ecmr?.ecmrId) {
            this.ecmrService.getEcmrRolesForCurrentUser(ecmr.ecmrId).subscribe(roles => {
                this.selectedEcmrRoles = roles
            })
            this.loadSealMetadata(ecmr.ecmrId).subscribe(sealMetadata => {
                this.selectedEcmrSealMetadata = sealMetadata;
            })
        }
        this.selectedEcmr = ecmr;
        if (ecmr?.ecmrId) {
            this.documentService.getDocuments(ecmr.ecmrId).subscribe(files => {
                this.documentsForSelectedEcmr.set(files)
            })
        }

    }

    private loadSealMetadata(ecmrId: string): Observable<SealMetadata[]> {
        return this.sealMetadataService.getSealMetadata(ecmrId)
            .pipe(
                catchError(err => {
                    this.snackbarService.openErrorSnackbar('general.snackbar_error')
                    console.log(err);
                    return of([])
                })
            );
    }

    closeDetailView($event: boolean) {
        if ($event)
            this.selectEcmr(null)
    }

    onFilterRequest(request: FilterRequest) {
        this.filterRequest = request;
        this.loadData().subscribe(data => {
            this.updateTableData(data);
        });
    }

    onSelectedEcmrs(ecmrs: Ecmr[]) {
        this.selectedEcmrs = ecmrs;
    }

    clearMultiSelection() {
        this.selectedEcmrs = [];
        this.table?.clearSelection();
    }

    bulkMoveToArchive() {
        if (this.selectedEcmrs.length === 0) return;

        const dialogData = this.selectedEcmrs.length === 1 ? {
            text: 'overview.confirmation_message'
        } : {
            text: 'overview.multiselect.archive_confirmation_message',
            textParams: {count: this.selectedEcmrs.length}
        };

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: dialogData,
        });
        dialogRef.afterClosed().pipe(
            filter(result => result.isConfirmed),
            switchMap(() => {
                const ecmrIds = this.selectedEcmrs.flatMap(ecmr => ecmr.ecmrId ? [ecmr.ecmrId] : []);
                return this.ecmrService.bulkMoveToArchive(ecmrIds);
            }),
            switchMap(() => this.loadData()),
            catchError(err => {
                this.snackbarService.openErrorSnackbar('general.snackbar_error');
                console.error(err);
                return of(null)
            }),
        ).subscribe(data => {
            if (data) {
                this.snackbarService.openSuccessSnackbar('overview.multiselect.archive_success');
                this.updateTableData(data);
            }
        });
    }

    bulkDelete() {
        if (this.selectedEcmrs.length === 0) return;

        const dialogData = this.selectedEcmrs.length === 1 ? {
            text: 'overview.delete_ecmr_dialog_text'
        } : {
            text: 'overview.multiselect.delete_confirmation_message',
            textParams: {count: this.selectedEcmrs.length}
        };

        this.dialog.open(ConfirmationDialogComponent, {
            data: dialogData,
        }).afterClosed().pipe(
            filter(dialogResult => dialogResult.isConfirmed === true),
            switchMap(() => {
                const ecmrIds = this.selectedEcmrs.flatMap(ecmr => ecmr.ecmrId ? [ecmr.ecmrId] : []);
                return this.ecmrService.bulkDeleteEcmr(ecmrIds);
            }),
            switchMap(() => this.loadData()),
            catchError(err => {
                this.snackbarService.openErrorSnackbar('general.snackbar_error');
                console.error(err);
                return of(null)
            }),
        ).subscribe(data => {
            if (data) {
                this.snackbarService.openSuccessSnackbar('overview.multiselect.delete_success');
                this.updateTableData(data);
            }
        });
    }

    scrollToDocuments() {
        this.ecmrOverviewDetails.scrollToDocuments();
    }

    downloadDocument(document: DocumentModel) {
        this.loadingService.showLoaderUntilCompleted(this.documentService.downloadDocument(document.id)).subscribe(blob => {
            const a = window.document.createElement('a')
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = document.fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);
        });
    }

    protected onGroupSelected(group: GroupFlat) {
        this.selectedGroupFilter.set(group);
        this.loadData().subscribe(data => {
            this.updateTableData(data);
        })
    }

    private setupGroupFilter() {
        this.groupService.getAllGroupsAsFlatList(true).subscribe(groups => {
            this.availableGroups.set(groups);
            this.filteredAvailableGroups.set(groups);

            if(this.authService.getDefaultGroupIdForUser() != null) {
                const groupFromList = groups.find(group => group.id === this.authService.getDefaultGroupIdForUser());
                if(groupFromList) {
                    this.availableGroupsFormControl.setValue(groupFromList);
                    this.selectedGroupFilter.set(groupFromList);
                }
            }
        });

        this.availableGroupsFormControl.valueChanges
            .pipe(
                startWith(''),
                map(value => (typeof value === 'string' ? value : value?.name)),
                map(searchValue => searchValue
                    ? this._filterGroups(searchValue)
                    : this.availableGroups().slice()
                )
            )
            .subscribe(filteredGroups => this.filteredAvailableGroups.set(filteredGroups));
    }

    private _filterGroups(searchValue: string): GroupFlat[] {
        const filterValue = searchValue.toLowerCase();
        return this.availableGroups().filter(group =>
            (group.name?.toLowerCase() || '').includes(filterValue) ||
            (group.description?.toLowerCase() || '').includes(filterValue)
        );
    }

    protected clearGroupFilter() {
        this.selectedGroupFilter.set(null);
        this.availableGroupsFormControl.reset();
        this.loadData().subscribe(data => {
            this.updateTableData(data);
        })
    }

    getSelectedGroupId() {
        const selectedGroup = this.selectedGroupFilter();
        return selectedGroup ? selectedGroup.id : null;
    }

    displayGroupFn(group: GroupFlat) {
        if(group == null) return '';
        let groupDisplay = group.name;

        if (group.description) {
            groupDisplay += ' - ' + group.description;
        }

        return groupDisplay;
    }
}
