/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, inject, OnInit } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Group } from '../../../core/models/Group';
import { GroupService } from '../group.service';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from '../group-edit-dialog/group-edit-dialog.component';
import { MatInput } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { filter, of, switchMap } from 'rxjs';
import {
    MatTree,
    MatTreeFlatDataSource,
    MatTreeFlattener,
    MatTreeNode,
    MatTreeNodeDef,
    MatTreeNodePadding,
    MatTreeNodeToggle
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NgTemplateOutlet } from '@angular/common';
import { FlatGroupNode } from '../../../core/models/FlatGroupNode';
import { FormsModule } from '@angular/forms';
import { GroupChangeParentDialogComponent } from '../group-change-parent-dialog/group-change-parent-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
    selector: 'app-group-overview',
    imports: [
        MatToolbar,
        MatButton,
        MatIcon,
        MatLabel,
        MatToolbarRow,
        TranslateModule,
        MatIconButton,
        MatTooltip,
        MatFormField,
        MatInput,
        MatSuffix,
        MatSortModule,
        MatTree,
        MatTreeNode,
        MatTreeNodeDef,
        MatTreeNodePadding,
        MatTreeNodeToggle,
        NgTemplateOutlet,
        FormsModule
    ],
    templateUrl: './group-overview.component.html',
    styleUrl: './group-overview.component.scss'
})
export class GroupOverviewComponent implements OnInit {
    private groupService = inject(GroupService);
    private matDialog = inject(MatDialog);
    private router = inject(Router);
    private snackbarService = inject(SnackbarService);
    private translateService = inject(TranslateService);


    searchText: string = '';

    private expandedNodeIds: Set<number> = new Set();

    private _transformer = (node: Group, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            description: node.description,
            id: node.id,
            children: node.children,
            level: level
        };
    };

    treeControl = new FlatTreeControl<FlatGroupNode>(
        node => node.level,
        node => node.expandable,
    );

    treeFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );

    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    originalData: Group[] = [];

    hasChild = (_: number, node: FlatGroupNode) => node.expandable;

    ngOnInit(): void {
        this.groupService.getAllGroups(true).subscribe(data => {
            this.originalData = data;
            this.dataSource.data = data;
        });
    }

    applyFilter() {
        this.dataSource.data = this.filterTree(this.originalData, this.searchText);
        this.treeControl.expandAll();
    }

    filterTree(data: Group[], searchText: string): Group[] {
        if (!searchText) {
            return data;
        }
        return data
            .map(node => ({...node}))
            .filter(node => this.filterNode(node, searchText.toLowerCase()));
    }

    filterNode(node: Group, searchText: string): boolean {
        if (node.name.toLowerCase().includes(searchText)) {
            return true;
        }

        if (node.children) {
            node.children = node.children
                .map(child => ({...child}))
                .filter(child => this.filterNode(child, searchText));

            return node.children.length > 0;
        }

        return false;
    }

    openGroup(group: Group) {
        this.router.navigateByUrl(`/group-detail/${group.id}`)
    }

    private saveExpandedState() {
        this.expandedNodeIds.clear();
        this.treeControl.dataNodes.forEach(node => {
            if (this.treeControl.isExpanded(node)) {
                this.expandedNodeIds.add(node.id);
            }
        });
    }

    private restoreExpandedState() {
        this.treeControl.dataNodes.forEach(node => {
            if (this.expandedNodeIds.has(node.id)) {
                this.treeControl.expand(node);
            }
        });
    }

    createNewGroup(group: Group | null) {
        this.saveExpandedState();
        this.matDialog.open(GroupEditDialogComponent, {
            width: '600px',
            data: {parentGroup: group, groupToEdit: null},
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.groupService.getAllGroups(true))
        ).subscribe(groups => {
            this.dataSource.data = groups;
            this.restoreExpandedState();
        })
    }

    editGroup(group: Group) {
        this.saveExpandedState();
        this.matDialog.open(GroupEditDialogComponent, {
            data: {parentGroup: null, groupToEdit: group},
            width: '600px'
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.groupService.getAllGroups(true))
        ).subscribe(groups => {
            this.dataSource.data = groups;
            this.restoreExpandedState();
        })
    }

    changeParent(group: Group) {
        this.saveExpandedState();
        this.matDialog.open(GroupChangeParentDialogComponent, {
            data: group,
            width: '600px'
        }).afterClosed().pipe(
            filter(result => !!result),
            switchMap(() => this.groupService.getAllGroups(true))
        ).subscribe(groups => {
            this.dataSource.data = groups;
            this.restoreExpandedState();
        })
    }

    deleteGroup(group: Group) {
        this.saveExpandedState();
        this.matDialog.open(ConfirmationDialogComponent, {
            data: {
                text: 'group_overview.delete_confirm'
            }
        }).afterClosed().pipe(
            switchMap(result => {
                if (result.isConfirmed) return this.groupService.deleteGroup(group.id)
                return of(false)
            }),
            switchMap(data => {
                if (data) {
                    return this.groupService.getAllGroups(true)
                }
                return of(null)
            }))
            .subscribe({
                next: groups => {
                    if (groups) {
                        this.dataSource.data = groups;
                        this.restoreExpandedState();
                    }
                },
                error: (err: HttpErrorResponse) => {
                    if (err.status == 400) {
                        this.snackbarService.openInfoSnackbar(this.translateService.instant('group_overview.delete_bad_request'));
                    } else {
                        this.snackbarService.openErrorSnackbar(err.error.message)
                    }
                }
            });
    }
}
