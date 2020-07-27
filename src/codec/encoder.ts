// Copyright 2020 The CIMO Authors. All rights reserved.
// Use of this source code is governed by a GPLV3.0 license that can be
// found in the LICENSE file.

import {
  kSetFillStyleTag,
  kFillRectTag,
  kFileTag,
  kFileVersion,
  kSaveTag,
  kRestoreTag,
  kScaleTag,
  kRotateTag,
  kTranslateTag,
  kTransformTag,
  kSetTransformTag,
  kSetGlobalAlphaTag,
  kSetStrokeStyleTag,
  kSetLineWidthTag,
  kSetMiterLimitTag,
  kSetShadowOffsetXTag,
  kSetShadowOffsetYTag,
  kSetShadowBlurTag,
  kSetShadowColorTag,
  kStrokeRectTag,
  kClearRectTag,
} from "../macros";
import { intTo2Bytes, doubleTo8Bytes, intTo3Bytes } from "../utils";

export class Encoder {
  private frames: number[][] = [[]];

  constructor(
    readonly options: {
      width: number;
      height: number;
      animation?: boolean;
      fps?: number;
    }
  ) {}

  getMetaData(): number[] {
    let metaData: number[] = [];
    metaData.push(...intTo2Bytes(this.options.width));
    metaData.push(...intTo2Bytes(this.options.height));
    metaData.push(this.options.animation == true ? 1 : 0);
    metaData.push(this.options.fps !== undefined ? this.options.fps : 0);
    if (metaData.length < 32) {
      for (let index = metaData.length; index < 32; index++) {
        metaData.push(0);
      }
    }
    return metaData;
  }

  save() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSaveTag));
    frame.push(...intTo2Bytes(0));
  }

  restore() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kRestoreTag));
    frame.push(...intTo2Bytes(0));
  }

  scale(x: number, y: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kScaleTag));
    frame.push(...intTo2Bytes(16));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
  }

  rotate(angle: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kRotateTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(angle));
  }

  translate(x: number, y: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kTranslateTag));
    frame.push(...intTo2Bytes(16));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
  }

  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kTransformTag));
    frame.push(...intTo2Bytes(8 * 6));
    frame.push(...doubleTo8Bytes(a));
    frame.push(...doubleTo8Bytes(b));
    frame.push(...doubleTo8Bytes(c));
    frame.push(...doubleTo8Bytes(d));
    frame.push(...doubleTo8Bytes(e));
    frame.push(...doubleTo8Bytes(f));
  }

  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetTransformTag));
    frame.push(...intTo2Bytes(8 * 6));
    frame.push(...doubleTo8Bytes(a));
    frame.push(...doubleTo8Bytes(b));
    frame.push(...doubleTo8Bytes(c));
    frame.push(...doubleTo8Bytes(d));
    frame.push(...doubleTo8Bytes(e));
    frame.push(...doubleTo8Bytes(f));
  }

  setGlobalAlpha(a: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetGlobalAlphaTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(a));
  }

  setStrokeStyle(r: number, g: number, b: number, a: number = 1.0) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetStrokeStyleTag));
    frame.push(...intTo2Bytes(4));
    frame.push(r, g, b, Math.floor(a * 255));
  }

  setFillStyle(r: number, g: number, b: number, a: number = 1.0) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetFillStyleTag));
    frame.push(...intTo2Bytes(4));
    frame.push(r, g, b, Math.floor(a * 255));
  }

  setLineWidth(v: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetLineWidthTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(v));
  }

  setMiterLimit(v: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetMiterLimitTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(v));
  }

  setShadowOffsetX(v: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetShadowOffsetXTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(v));
  }

  setShadowOffsetY(v: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetShadowOffsetYTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(v));
  }

  setShadowBlur(v: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetShadowBlurTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...doubleTo8Bytes(v));
  }

  setShadowColor(r: number, g: number, b: number, a: number = 1.0) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetShadowColorTag));
    frame.push(...intTo2Bytes(4));
    frame.push(r, g, b, Math.floor(a * 255));
  }

  fillRect(x: number, y: number, width: number, height: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kFillRectTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...intTo2Bytes(x));
    frame.push(...intTo2Bytes(y));
    frame.push(...intTo2Bytes(width));
    frame.push(...intTo2Bytes(height));
  }

  strokeRect(x: number, y: number, width: number, height: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kStrokeRectTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...intTo2Bytes(x));
    frame.push(...intTo2Bytes(y));
    frame.push(...intTo2Bytes(width));
    frame.push(...intTo2Bytes(height));
  }

  clearRect(x: number, y: number, width: number, height: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kClearRectTag));
    frame.push(...intTo2Bytes(8));
    frame.push(...intTo2Bytes(x));
    frame.push(...intTo2Bytes(y));
    frame.push(...intTo2Bytes(width));
    frame.push(...intTo2Bytes(height));
  }

  endFrame() {
    this.frames.push([]);
  }

  build(): Uint8Array {
    let data = [];
    data.push(...kFileTag);
    data.push(...kFileVersion);
    data.push(...this.getMetaData());
    this.frames.forEach((frame, index) => {
      let frameData = [];
      frameData.push(...intTo3Bytes(index));
      frameData.push(...intTo3Bytes(frame.length));
      frameData.push(...frame);
      data.push(...frameData);
    });
    return new Uint8Array(data);
  }
}
