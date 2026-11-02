import fs from "fs";
import { join } from "path";

const INDEX_ITEM_SIZE = 16;
const INDEX_SIZE = 128;
const STACK_ITEM_SIZE = 32;
const STACK_SIZE = 7;
const BUILD_METADATA_SIZE = STACK_ITEM_SIZE;
const WRAM_ITEM_SIZE = 256;
const WRAM_SIZE = 7;

const BUILD_METADATA = "buffalos vdev";

// TODO: could be optimized, e. g. w/ 56 (7*8, not 7*7+7)
function safeWriteByteAndMoveRight(value: number) {
    const root = Math.floor(Math.sqrt(value));
    return `${"+".repeat(value - root ** 2)}>${root ? `${"+".repeat(root)}[<${"+".repeat(root)}>-]` : ""}`;
}
function safeWriteBytesAndMoveRight(buf: Buffer) {
    return [...buf].map(safeWriteByteAndMoveRight).join("");
}

function brainfuckFilter(code: string) {
    return code.replace(/[^\[\]+\-<>.,]/g, "");
}

type Progmem = [string, string][]; // [name, contents][]

function buildRaw(progmem: Progmem, entry: string, cmdline: string, metadata: string = BUILD_METADATA) {
    // index
    let image = safeWriteBytesAndMoveRight(Buffer.concat(progmem.concat(new Array(INDEX_SIZE - progmem.length).fill(["", ""])).map(x => Buffer.from(x[0].slice(0, 16).padEnd(16, "\0"), "utf-8"))));

    // entry
    const entryIdx = progmem.findIndex(x => x[0] === entry);
    if(entryIdx === -1) throw new Error("Entry program not found!");
    image += safeWriteBytesAndMoveRight(Buffer.concat([Buffer.from([entryIdx]), Buffer.from(cmdline.slice(0, STACK_ITEM_SIZE - 1).padEnd(STACK_ITEM_SIZE - 1, "\0"), "utf-8")]));

    // build metadata
    image += ">".repeat((STACK_SIZE - 1) * STACK_ITEM_SIZE);
    image += safeWriteBytesAndMoveRight(Buffer.from(BUILD_METADATA, "utf-8"));

    // shift back to stack size
    image += "<".repeat(STACK_SIZE * STACK_ITEM_SIZE + BUILD_METADATA.length);

    return brainfuckFilter(image);
}

console.log(buildRaw(fs.readdirSync("disk").map(x => [x, fs.readFileSync(join("disk", x), "utf-8")]), "hello.bf", ""));
