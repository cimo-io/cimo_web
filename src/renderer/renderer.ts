import { Decoder } from "../codec/decoder";
import { kSetFillStyleTag, kFillRectTag } from "../macros";

const _2BytesToInt = (value: number[] | Uint8Array): number => {
  return value[0] * 256 + value[1];
};

const _3BytesToInt = (value: number[] | Uint8Array): number => {
  return value[0] * 256 * 256 + value[1] * 256 + value[2];
};

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
      if (tag == kSetFillStyleTag) {
        const { r, g, b, a } = {
          r: body[0],
          g: body[1],
          b: body[2],
          a: body[3],
        };
        console.log(`rgba(${r},${g},${b},${a / 255.0})`);
        this.renderingContext.fillStyle = `rgba(${r},${g},${b},${a / 255.0})`;
      } else if (tag == kFillRectTag) {
        const { x, y, width, height } = {
          x: _2BytesToInt([body[0], body[1]]),
          y: _2BytesToInt([body[2], body[3]]),
          width: _2BytesToInt([body[4], body[5]]),
          height: _2BytesToInt([body[6], body[7]]),
        };
        console.log(`fillRect`);
        this.renderingContext.fillRect(x, y, width, height);
      }
      dataIndex += 4 + length;
    }
  }
}
