// Copyright 2020 The CIMO Authors. All rights reserved.
// Use of this source code is governed by a GPLV3.0 license that can be
// found in the LICENSE file.

import { Encoder } from "./codec/encoder";
import { Decoder } from "./codec/decoder";

const codec = new Encoder({ width: 300, height: 300 });
codec.scale(0.5, 0.5);
codec.setFillStyle(255, 0, 0, 255);
codec.fillRect(0, 0, 150, 150);
codec.setStrokeStyle(255, 255, 0, 255);
codec.strokeRect(0, 0, 150, 150);
const data = codec.build();
console.log(data);

const decoder = new Decoder(data);
console.log(JSON.stringify(decoder));
