import fs from "fs";
import { join } from "path";

const STACK_ITEM_SIZE = 32;
const STACK_SIZE = 7;
const BUILD_METADATA_SIZE = STACK_ITEM_SIZE;
const WRAM_SIZE_PER_PROGRAM = 256;

function safeWriteByteAndMoveRight(value: number) {
    const root = Math.floor(Math.sqrt(value));
    return `${"+".repeat(value - root ** 2)}>${"+".repeat(root)}[<${"+".repeat(root)}>-]`;
}
function safeWriteBytesAndMoveRight(buf: Buffer) {
    return [...buf].map(safeWriteByteAndMoveRight).join("");
}
console.log(safeWriteBytesAndMoveRight(Buffer.from("Hello World!")) + "<<<<<<<<<<<<[.>]");