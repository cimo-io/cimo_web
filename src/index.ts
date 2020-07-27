// Copyright 2020 The CIMO Authors. All rights reserved.
// Use of this source code is governed by a GPLV3.0 license that can be
// found in the LICENSE file.

import { Encoder as MEncoder } from "./codec/encoder";
import { Decoder as MDecoder } from "./codec/decoder";
import { Renderer as MRenderer } from "./renderer/renderer";

export class Encoder extends MEncoder {}
export class Decoder extends MDecoder {}
export class Renderer extends MRenderer {}
