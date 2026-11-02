# ram allocation documentation

4096 bytes are needed. behavior with less ram is undefined, wrapping is not necessary.

127 programs are supported. more could be used by tweaking the parameters in `build.ts`, but at most 255 could be supported. however, programs may overwrite the stack to exit the main thread.

## main table
|size (bytes)|function|
|-|-|
|127*16|program index|
|16|reserved by OS (at least 2B)|
|7*32|stack|
|32|build metadata|
|7*256|working memory|

## program index
|size (bytes)|function|
|-|-|
|16|program name #1 (string, null-padded)|
|16|program name #2|
|125*16|etc...|

## stack
|size (bytes)|function|
|-|-|
|32|program #1 (currently running)|
|32|program #2|
|32|program #3|
|32|program #4|
|32|program #5|
|32|program #6|
|32|program #7|

## stack program
|size (bytes)|function|
|-|-|
|1|program ID|
|31|cmdline (string)|

## build metadata
|size (bytes)|function|
|-|-|
|32|build name (string)|

## working memory
|size (bytes)|function|
|-|-|
|256|program #1 (currently running)|
|256|program #2|
|256|program #3|
|256|program #4|
|256|program #5|
|256|program #6|
|256|program #7|