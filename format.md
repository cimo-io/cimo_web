#FORMAT DESCRIPTION

# CIMO Format Definition

## [FILE-HEADER] >>> First 4 bytes

[89,69,90,73]

## [FILE-VERSION] >>> 2 bytes after FILE-HEADER

[0,1]

## [META-DATA] >>> 32 bytes after FILE-VERSION

### [WIDTH] >>> 2 bytes

[0,0]

### [HEIGHT] >>> 2 bytes

[0,0]

### [ANIMATION] >>> 1 bytes

[0]

### [FPS] >>> 1 bytes

[0]

## [FRAME-DATA]

### [FRAME-HEADER] >>> 6 bytes

#### [FRAME-INDEX] >>> 3 bytes

[0,0,0]

#### [FRAME-DATA-LENGTH] >>> 3 bytes

[0,0,0]

#### [FRAME-DATA] >>> n bytes

## FRAME-DATA

### save

TAG [0,100]
LENGTH [0,0]

# restore

TAG [0,101]
LENGTH [0,0]

# scale(x, y)

TAG [0,102]
PARAMS [0][0][0][0][0][0][0][0] [0][0][0][0][0][0][0][0]

# setFillStyle(r, g, b, a); >>> Pure Color

TAG [0,99]
LENGTH [0,4]
PARAMS [0][0] [0][0]

# fillRect(x, y, width, height);

TAG [0,109]
LENGTH [0,8]
PARAMS [0,0][0,0] [0,0][0,0]
