/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTimeService } from '../../services/date-time.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { EcmrSeal } from '../../../core/models/EcmrSeal';

@Component({
  selector: 'app-ecmr-seal',
  standalone: true,
  imports: [
    TranslatePipe,
    MatIcon,
    MatButton
  ],
  templateUrl: './ecmr-seal.component.html',
  styleUrl: './ecmr-seal.component.scss'
})
export class EcmrSealComponent {

  constructor(public dateTimeService: DateTimeService) {
  }

  @Input()
  sealed: boolean;
  @Input()
  buttonDisabled: boolean;
  @Input()
  seal?: EcmrSeal | null;
  @Output()
  buttonClicked: EventEmitter<void> = new EventEmitter();

}
