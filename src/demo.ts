import { Encoder } from "./codec/encoder";
import { Decoder } from "./codec/decoder";

const codec = new Encoder({ width: 300, height: 300 });
codec.setFillStyle(255, 0, 0, 255);
codec.fillRect(0, 0, 150, 150);
const data = codec.build();
console.log(data);

const decoder = new Decoder(data)
console.log(JSON.stringify(decoder))