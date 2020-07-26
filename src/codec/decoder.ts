const _2BytesToInt = (value: number[] | Uint8Array): number => {
  return value[0] * 256 + value[1];
};

const _3BytesToInt = (value: number[] | Uint8Array): number => {
  return value[0] * 256 * 256 + value[1] * 256 + value[2];
};

export class Decoder {
  width?: number;
  height?: number;
  animation?: boolean;
  fps?: number;
  frames: Uint8Array[] = [];

  constructor(readonly data: Uint8Array) {
    if (
      !(data[0] === 89 && data[1] === 69 && data[2] === 90 && data[3] === 73)
    ) {
      throw "Invalid header check.";
    }
    if (_2BytesToInt([data[4], data[5]]) > 1) {
      throw "Invalid version check.";
    }
    this.readMetaData();
    this.readFrames();
  }

  readMetaData() {
    const metaData = this.data.subarray(6, 6 + 32);
    this.width = _2BytesToInt(metaData.subarray(0, 2));
    this.height = _2BytesToInt(metaData.subarray(2, 4));
    this.animation = metaData[4] == 1;
    this.fps = metaData[5];
  }

  readFrames() {
    let dataIndex = 38;
    while (dataIndex < this.data.length) {
      const frameIndex = _3BytesToInt([
        this.data[dataIndex],
        this.data[dataIndex + 1],
        this.data[dataIndex + 2],
      ]);
      const frameLength = _3BytesToInt([
        this.data[dataIndex + 3],
        this.data[dataIndex + 4],
        this.data[dataIndex + 5],
      ]);
      const frameData = this.data.subarray(
        dataIndex + 6,
        dataIndex + 6 + frameLength
      );
      this.frames[frameIndex] = frameData;
      dataIndex += 6 + frameLength;
    }
  }
}
