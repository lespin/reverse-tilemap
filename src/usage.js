import { make_json_tiled_map_from_image } from "./index.js"
import fs from 'node:fs'

const target_image_path = "./test-assets/cavesofgallet.png"
const tile_width = 8
const tile_height = 8
const tiles_image_paths = [
    "output.png"
    //target_image_path
    // "./test-assets/cavesofgallet_tiles.png",
//     "./test-assets/cavesofgallet_tiles_a.png",
  //   "./test-assets/cavesofgallet_tiles_b.png",
]

const map = make_json_tiled_map_from_image(target_image_path, tiles_image_paths, tile_width, tile_height)

fs.writeFileSync("output.tiled.map.json", JSON.stringify(map))


