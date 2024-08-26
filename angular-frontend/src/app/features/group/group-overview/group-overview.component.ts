/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, OnInit } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
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
} from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { Group } from '../../../core/models/Group';
import { MatPaginator } from '@angular/material/paginator';
import { GroupService } from '../group.service';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from '../group-edit-dialog/group-edit-dialog.component';
import { MatInput } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { filter, switchMap } from 'rxjs';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
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
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { FlatGroupNode } from '../../../core/models/FlatGroupNode';
import { FormsModule } from '@angular/forms';
import { GroupChangeParentDialogComponent } from '../group-change-parent-dialog/group-change-parent-dialog.component';

@Component({
    selector: 'app-group-overview',
    standalone: true,
    imports: [
        MatToolbar,
        MatButton,
        MatIcon,
        MatLabel,
        MatToolbarRow,
        TranslateModule,
        MatTable,
        CdkColumnDef,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        MatPaginator,
        MatIconButton,
        MatTooltip,
        MatFormField,
        MatPrefix,
        MatInput,
        MatSuffix,
        MatSortModule,
        MatDrawerContainer,
        MatDrawer,
        MatTree,
        MatTreeNode,
        MatTreeNodeDef,
        MatTreeNodePadding,
        MatTreeNodeToggle,
        NgTemplateOutlet,
        FormsModule,
        NgIf
    ],
    templateUrl: './group-overview.component.html',
    styleUrl: './group-overview.component.scss'
})
export class GroupOverviewComponent implements OnInit {

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

    constructor(private groupService: GroupService,
                private matDialog: MatDialog,
                private router: Router) {
    }

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
        this.groupService.deleteGroup(group.id).pipe(
            filter(result => result),
            switchMap(() => this.groupService.getAllGroups(true))
        ).subscribe(groups => {
            this.dataSource.data = groups;
            this.restoreExpandedState();
        })
    }
}
