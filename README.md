# Reverse tilemap

Builds a [tilemap](https://doc.mapeditor.org/en/stable/reference/json-map-format/) from a target image and a tile image(s)

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

## licenses

### Source code in `src/`

(c) 2024 lespin, GNU GENERAL PUBLIC LICENSE v3

### Image assets in `test/input/`

Assets are public domain

retrieved 28/02/2024 at https://adamatomic.itch.io/cavernas

"Based on GHOST CROQUET, Celeste, Iconoclasts, and Bitsy. The download includes around 100 tiles so far, as well as a reference image to see how they can be used. These assets are public domain and free to use on whatever you want, personal or commercial. Enjoy <3"

