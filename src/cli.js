import { make_json_tiled_map_from_image } from "./index.js"
import fs from 'node:fs'
import { make_png_of_used_tiles } from "./simplify.js"
import { PNG } from "pngjs"

const [_node, program_name, command, ...params] = process.argv

switch (command) {
    case 'reverse': {
        if (params.length < 4) {
            console.error(`usage : ${program_name} reverse tile_width tile_height target_image_path tiles_image_paths+`)
        } else {
            const [tile_width, tile_height, target_image_path, ...tiles_image_paths] = params
            console.error('tile size:', tile_width, 'x', tile_height)
            console.error('building target image:', target_image_path)
            console.error('using tilemap images:', tiles_image_paths)
            const map = make_json_tiled_map_from_image(target_image_path, tiles_image_paths, tile_width, tile_height)
            process.stdout.write(JSON.stringify(map))
        }
        break;
    }
    case 'simplify': {
        if (params.length < 1) {
            console.error(`usage : ${program_name} simplify tiled_map_path`)
        } else {
            const [tiled_map_path] = params
            const tilemap = JSON.parse(fs.readFileSync(tiled_map_path))
            const read_tileset_image = tileset => fs.readFileSync(tileset.image)
            const png = make_png_of_used_tiles(tilemap, read_tileset_image)
            process.stdout.write(PNG.sync.write(png))        
        }
        break;
    }
    default: {
        console.error(`usage : ${program_name} reverse tile_width tile_height target_image_path tiles_image_paths+`)        
        console.error(`usage : ${program_name} simplify tiled_map_path`)
    }

}
// fs.writeFileSync('output.png', PNG.sync.write(png))



