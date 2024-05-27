/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {MarksAndNos} from "../areas/ten/MarksAndNos";
import {NumberOfPackages} from "../areas/eleven/NumberOfPackages";
import {MethodOfPacking} from "../areas/twelve/MethodOfPacking";
import {NatureOfTheGoods} from "../areas/thirteen/NatureOfTheGoods";
import {GrossWeightInKg} from "../areas/fourteen/GrossWeightInKg";
import {VolumeInM3} from "../areas/fifteen/VolumeInM3";

export interface Item {
  marksAndNos: MarksAndNos;
  numberOfPackages: NumberOfPackages;
  methodOfPacking: MethodOfPacking;
  natureOfTheGoods: NatureOfTheGoods;
  grossWeightInKg: GrossWeightInKg;
  volumeInM3: VolumeInM3;
}
