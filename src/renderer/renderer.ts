// Copyright 2020 The CIMO Authors. All rights reserved.
// Use of this source code is governed by a GPLV3.0 license that can be
// found in the LICENSE file.

import { Decoder } from "../codec/decoder";
import {
  kSetFillStyleTag,
  kFillRectTag,
  kScaleTag,
  kSaveTag,
  kRestoreTag,
  kSetStrokeStyleTag,
  kStrokeRectTag,
  kSetLineWidthTag,
  kRotateTag,
  kTranslateTag,
  kTransformTag,
  kSetTransformTag,
  kSetGlobalAlphaTag,
  kSetMiterLimitTag,
  kSetShadowOffsetXTag,
  kSetShadowOffsetYTag,
  kSetShadowBlurTag,
  kSetShadowColorTag,
  kClearRectTag,
} from "../macros";
import { _2BytesToInt, _8BytesToDouble } from "../utils";

export class Renderer {
  constructor(
    readonly decoder: Decoder,
    readonly renderingContext: CanvasRenderingContext2D
  ) {
    if (this.decoder.width && this.decoder.height) {
      renderingContext.canvas.width = this.decoder.width;
      renderingContext.canvas.height = this.decoder.height;
    }
    this.paint(0);
  }

  paint(frameIndex: number) {
    this.renderingContext.clearRect(
      0,
      0,
      this.renderingContext.canvas.width,
      this.renderingContext.canvas.height
    );
    const frameData = this.decoder.frames[frameIndex];
    console.log(this.decoder.frames);
    let dataIndex = 0;
    while (dataIndex < frameData.length) {
      const tag = _2BytesToInt([
        frameData[dataIndex],
        frameData[dataIndex + 1],
      ]);
      const length = _2BytesToInt([
        frameData[dataIndex + 2],
        frameData[dataIndex + 3],
      ]);
      const body = frameData.subarray(dataIndex + 4, dataIndex + 4 + length);
      switch (tag) {
        case kSaveTag: {
          this.renderingContext.save();
          break;
        }
        case kRestoreTag: {
          this.renderingContext.restore();
          break;
        }
        case kScaleTag:
          {
            const { x, y } = {
              x: _8BytesToDouble(body.subarray(0, 8)),
              y: _8BytesToDouble(body.subarray(8, 16)),
            };
            this.renderingContext.scale(x, y);
          }
          break;
        case kRotateTag:
          {
            const { angle } = {
              angle: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.rotate(angle);
          }
          break;
        case kTranslateTag:
          {
            const { x, y } = {
              x: _8BytesToDouble(body.subarray(0, 8)),
              y: _8BytesToDouble(body.subarray(8, 16)),
            };
            this.renderingContext.translate(x, y);
          }
          break;
        case kTransformTag:
          {
            const { a, b, c, d, e, f } = {
              a: _8BytesToDouble(body.subarray(0, 8)),
              b: _8BytesToDouble(body.subarray(8, 16)),
              c: _8BytesToDouble(body.subarray(16, 24)),
              d: _8BytesToDouble(body.subarray(24, 32)),
              e: _8BytesToDouble(body.subarray(32, 40)),
              f: _8BytesToDouble(body.subarray(40, 48)),
            };
            this.renderingContext.transform(a, b, c, d, e, f);
          }
          break;
        case kSetTransformTag:
          {
            const { a, b, c, d, e, f } = {
              a: _8BytesToDouble(body.subarray(0, 8)),
              b: _8BytesToDouble(body.subarray(8, 16)),
              c: _8BytesToDouble(body.subarray(16, 24)),
              d: _8BytesToDouble(body.subarray(24, 32)),
              e: _8BytesToDouble(body.subarray(32, 40)),
              f: _8BytesToDouble(body.subarray(40, 48)),
            };
            this.renderingContext.setTransform(a, b, c, d, e, f);
          }
          break;
        case kSetGlobalAlphaTag:
          {
            const { alpha } = {
              alpha: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.globalAlpha = alpha;
          }
          break;
        case kSetStrokeStyleTag:
          {
            const { r, g, b, a } = {
              r: body[0],
              g: body[1],
              b: body[2],
              a: body[3],
            };
            this.renderingContext.strokeStyle = `rgba(${r},${g},${b},${
              a / 255.0
            })`;
          }
          break;
        case kSetFillStyleTag:
          {
            const { r, g, b, a } = {
              r: body[0],
              g: body[1],
              b: body[2],
              a: body[3],
            };
            this.renderingContext.fillStyle = `rgba(${r},${g},${b},${
              a / 255.0
            })`;
          }
          break;
        case kSetLineWidthTag:
          {
            const { v } = {
              v: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.lineWidth = v;
          }
          break;
        case kSetMiterLimitTag:
          {
            const { v } = {
              v: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.miterLimit = v;
          }
          break;
        case kSetShadowOffsetXTag:
          {
            const { v } = {
              v: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.shadowOffsetX = v;
          }
          break;
        case kSetShadowOffsetYTag:
          {
            const { v } = {
              v: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.shadowOffsetY = v;
          }
          break;
        case kSetShadowBlurTag:
          {
            const { v } = {
              v: _8BytesToDouble(body.subarray(0, 8)),
            };
            this.renderingContext.shadowBlur = v;
          }
          break;
        case kSetShadowColorTag:
          {
            const { r, g, b, a } = {
              r: body[0],
              g: body[1],
              b: body[2],
              a: body[3],
            };
            this.renderingContext.shadowColor = `rgba(${r},${g},${b},${
              a / 255.0
            })`;
          }
          break;
        case kFillRectTag:
          {
            const { x, y, width, height } = {
              x: _2BytesToInt([body[0], body[1]]),
              y: _2BytesToInt([body[2], body[3]]),
              width: _2BytesToInt([body[4], body[5]]),
              height: _2BytesToInt([body[6], body[7]]),
            };
            this.renderingContext.fillRect(x, y, width, height);
          }
          break;
        case kStrokeRectTag:
          {
            const { x, y, width, height } = {
              x: _2BytesToInt([body[0], body[1]]),
              y: _2BytesToInt([body[2], body[3]]),
              width: _2BytesToInt([body[4], body[5]]),
              height: _2BytesToInt([body[6], body[7]]),
            };
            this.renderingContext.strokeRect(x, y, width, height);
          }
          break;
        case kClearRectTag:
          {
            const { x, y, width, height } = {
              x: _2BytesToInt([body[0], body[1]]),
              y: _2BytesToInt([body[2], body[3]]),
              width: _2BytesToInt([body[4], body[5]]),
              height: _2BytesToInt([body[6], body[7]]),
            };
            this.renderingContext.clearRect(x, y, width, height);
          }
          break;
      }
      dataIndex += 4 + length;
    }
  }
}
