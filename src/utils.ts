// Copyright 2020 The CIMO Authors. All rights reserved.
// Use of this source code is governed by a GPLV3.0 license that can be
// found in the LICENSE file.

export const intTo2Bytes = (value: number): number[] => {
  value = Math.round(value);
  return [(value >> 8) & 0xff, value & 0xff];
};

export const intTo3Bytes = (value: number): number[] => {
  value = Math.round(value);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
};

export const doubleTo8Bytes = (value: number): number[] => {
  const buffer = new ArrayBuffer(8);
  const longNum = new Float64Array(buffer);
  longNum[0] = value;
  const arr = new Int8Array(buffer);
  return [arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]];
};

export const _2BytesToInt = (value: number[] | Uint8Array): number => {
  return value[0] * 256 + value[1];
};

export const _3BytesToInt = (value: number[] | Uint8Array): number => {
  return value[0] * 256 * 256 + value[1] * 256 + value[2];
};

export const _8BytesToDouble = (value: Uint8Array): number => {
  var arrayBuffer = value.buffer.slice(
    value.byteOffset,
    value.byteLength + value.byteOffset
  );
  const longNum = new Float64Array(arrayBuffer);
  return longNum[0];
};
