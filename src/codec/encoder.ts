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
  kSetLineCapTag,
  kSetLineJoinTag,
  kBeginPathTag,
  kClosePathTag,
  kStrokeTag,
  kFillTag,
  kMoveToTag,
  kLineToTag,
  kRectTag,
  kQuadraticCurveToTag,
  kBezierCurveToTag,
  kArcTag,
  kArcToTag,
  kClipTag,
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

  setLineCap(v: string) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetLineCapTag));
    frame.push(...intTo2Bytes(1));
    if (v === "butt") {
      frame.push(0);
    } else if (v === "round") {
      frame.push(1);
    } else if (v === "square") {
      frame.push(2);
    } else {
      frame.push(0);
    }
  }

  setLineJoin(v: string) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetLineJoinTag));
    frame.push(...intTo2Bytes(1));
    if (v === "round") {
      frame.push(0);
    } else if (v === "bevel") {
      frame.push(1);
    } else if (v === "miter") {
      frame.push(2);
    } else {
      frame.push(0);
    }
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
    frame.push(...intTo2Bytes(8 * 4));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
    frame.push(...doubleTo8Bytes(width));
    frame.push(...doubleTo8Bytes(height));
  }

  strokeRect(x: number, y: number, width: number, height: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kStrokeRectTag));
    frame.push(...intTo2Bytes(8 * 4));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
    frame.push(...doubleTo8Bytes(width));
    frame.push(...doubleTo8Bytes(height));
  }

  clearRect(x: number, y: number, width: number, height: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kClearRectTag));
    frame.push(...intTo2Bytes(8 * 4));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
    frame.push(...doubleTo8Bytes(width));
    frame.push(...doubleTo8Bytes(height));
  }

  beginPath() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kBeginPathTag));
    frame.push(...intTo2Bytes(0));
  }

  closePath() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kClosePathTag));
    frame.push(...intTo2Bytes(0));
  }

  stroke() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kStrokeTag));
    frame.push(...intTo2Bytes(0));
  }

  fill() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kFillTag));
    frame.push(...intTo2Bytes(0));
  }

  lineTo(x: number, y: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kLineToTag));
    frame.push(...intTo2Bytes(8 * 2));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
  }

  moveTo(x: number, y: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kMoveToTag));
    frame.push(...intTo2Bytes(8 * 2));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
  }

  rect(x: number, y: number, width: number, height: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kRectTag));
    frame.push(...intTo2Bytes(8 * 4));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
    frame.push(...doubleTo8Bytes(width));
    frame.push(...doubleTo8Bytes(height));
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kQuadraticCurveToTag));
    frame.push(...intTo2Bytes(8 * 4));
    frame.push(...doubleTo8Bytes(cpx));
    frame.push(...doubleTo8Bytes(cpy));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kBezierCurveToTag));
    frame.push(...intTo2Bytes(8 * 6));
    frame.push(...doubleTo8Bytes(cp1x));
    frame.push(...doubleTo8Bytes(cp1y));
    frame.push(...doubleTo8Bytes(cp2x));
    frame.push(...doubleTo8Bytes(cp2y));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
  }

  arc(
    x: number,
    y: number,
    r: number,
    start: number,
    end: number,
    anticlockwise: boolean
  ) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kArcTag));
    frame.push(...intTo2Bytes(8 * 5 + 1));
    frame.push(...doubleTo8Bytes(x));
    frame.push(...doubleTo8Bytes(y));
    frame.push(...doubleTo8Bytes(r));
    frame.push(...doubleTo8Bytes(start));
    frame.push(...doubleTo8Bytes(end));
    frame.push(anticlockwise ? 1 : 0);
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kArcToTag));
    frame.push(...intTo2Bytes(8 * 5));
    frame.push(...doubleTo8Bytes(x1));
    frame.push(...doubleTo8Bytes(y1));
    frame.push(...doubleTo8Bytes(x2));
    frame.push(...doubleTo8Bytes(y2));
    frame.push(...doubleTo8Bytes(radius));
  }

  clip() {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kClipTag));
    frame.push(...intTo2Bytes(0));
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
