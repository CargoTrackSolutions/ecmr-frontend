/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import { Directive, inject, input, OnChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[dynamicDisable]',
  standalone: true
})
export class DynamicDisableControlDirective implements OnChanges {
  private ngControl = inject(NgControl);

  readonly dynamicDisable = input<boolean>();

  ngOnChanges() {
    if (this.ngControl.control) {
      if (this.dynamicDisable()) {
        this.ngControl.control.disable();
      } else {
        this.ngControl.control.enable();
      }
    }
  }
}
