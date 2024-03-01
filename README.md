# Reverse tilemap

Builds a [tilemap](https://doc.mapeditor.org/en/stable/reference/json-map-format/) from a target image and tile image(s)

According to the specifications of the tiled format, tiles can be mirrored vertically, horizontally, and diagonally

## usage

```js
import { make_json_tiled_map_from_image } from "./index.js"
import fs from 'node:fs'

const target_image_path = "./test-assets/cavesofgallet.png"
const tile_width = 8
const tile_height = 8
const tiles_image_paths = [
    "./test-assets/cavesofgallet_tiles_a.png",
    "./test-assets/cavesofgallet_tiles_b.png",
]

const map = make_json_tiled_map_from_image(target_image_path, tiles_image_paths, tile_width, tile_height)

fs.writeFileSync("output.tiled.map.json", JSON.stringify(map))
```

### If there is no tile image available

#### using cli

    node src/cli.js reverse 8 8 target.png target.png > tilemap0.json
    node src/cli.js simplify tilemap0.json > tiles.png
    node src/cli.js reverse 8 8 target.png tiles.png > tilemap.json

#### using api

1. run `make_json_tiled_map_from_image` using the target image as tile image

Then, in order to reduce tile image to only used tiles

2. run `make_png_of_used_tiles` to produce an image of unique tiles 

Then

3. run `make_json_tiled_map_from_image` on the initial target image, this time using the tile image produced by step 2

## licenses

### Source code in `src/`

(c) 2024 lespin, GNU GENERAL PUBLIC LICENSE v3

### Image assets in `test-assets/`

Assets are public domain

retrieved 28/02/2024 at https://adamatomic.itch.io/cavernas

"Based on GHOST CROQUET, Celeste, Iconoclasts, and Bitsy. The download includes around 100 tiles so far, as well as a reference image to see how they can be used. These assets are public domain and free to use on whatever you want, personal or commercial. Enjoy <3"

