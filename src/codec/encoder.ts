/**
 * #FORMAT DESCRIPTION
 *
 * ## [FILE-HEADER] >>> First 4 bytes
 * [89,69,90,73]
 *
 * ## [FILE-VERSION] >>> 2 bytes after FILE-HEADER
 * [0,1]
 *
 * ## [META-DATA] >>> 32 bytes after FILE-VERSION
 *
 * ### [WIDTH] >>> 2 bytes
 * [0,0]
 *
 * ### [HEIGHT] >>> 2 bytes
 * [0,0]
 *
 * ### [ANIMATION] >>> 1 bytes
 * [0]
 *
 * ### [FPS] >>> 1 bytes
 * [0]
 *
 * ## [FRAME-DATA]
 *
 * ### [FRAME-HEADER] >>> 6 bytes
 *
 * #### [FRAME-INDEX] >>> 3 bytes
 * [0,0,0]
 *
 * #### [FRAME-DATA-LENGTH] >>> 3 bytes
 * [0,0,0]
 *
 * #### [FRAME-DATA] >>> n bytes
 *
 */

import {
  kSetFillStyleTag,
  kFillRectTag,
  kFileTag,
  kFileVersion,
} from "../macros";

/**
 * [FRAME-DATA]
 *
 * # setFillStyle(r, g, b, a); >>> Pure Color
 * TAG [0,99]
 * LENGTH [0,4]
 * PARAMS [0] [0] [0] [0]
 *
 * # fillRect(x, y, width, height);
 * TAG [0,109]
 * LENGTH [0,8]
 * PARAMS [0,0] [0,0] [0,0] [0,0]
 *
 */

const intTo2Bytes = (value: number): number[] => {
  value = Math.round(value);
  return [(value >> 8) & 0xff, value & 0xff];
};

const intTo3Bytes = (value: number): number[] => {
  value = Math.round(value);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
};

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

  setFillStyle(r: number, g: number, b: number, a: number) {
    const frame = this.frames[this.frames.length - 1];
    frame.push(...intTo2Bytes(kSetFillStyleTag));
    frame.push(...intTo2Bytes(4));
    frame.push(r, g, b, a);
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
