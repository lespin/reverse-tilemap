import { FLIPPED_DIAGONALLY_FLAG, FLIPPED_HORIZONTALLY_FLAG, FLIPPED_VERTICALLY_FLAG, make_json_tiled_layer, make_json_tiled_map, make_json_tiled_tileset } from "./tiled.js"
import fs from 'node:fs'
import { PNG } from "pngjs"

const split_image = (png, tile_width, tile_height) => {
    const blocks = []
    const columns = Math.floor(png.width / tile_width)
    const rows = Math.floor(png.height / tile_height)
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const index = row * columns + column
            const tileData = []
            for (let tile_j = 0; tile_j < tile_height; tile_j++) {
                for (let tile_i = 0; tile_i < tile_width; tile_i++) {
                    const offset = 4 * ((column * tile_width + tile_i) + (row * tile_height + tile_j) * png.width)
                    const pixel = []
                    for (let byte = 0; byte < 4; byte++) {
                        pixel.push(png.data[offset + byte])
                    }
                    tileData.push(pixel)
                }
            }
            blocks.push({ index, row, column, tileData, tile_width, tile_height })
        }
    }
    return {
        blocks,
        columns,
        rows
    }
}

const TileImage = (tiles_image_path, tile_width, tile_height, first_gid) => {
    const png = PNG.sync.read(fs.readFileSync(tiles_image_path));
    const split = split_image(png, tile_width, tile_height)
    const { columns, rows } = split
    const tile_count = columns * rows
    const tiles = split.blocks.map(block => ({ gid: first_gid + block.index, ...block }))
    return {
        tiles,
        next_gid: first_gid + split.blocks.length,
        make_json_tiled_tileset: () => make_json_tiled_tileset(tiles_image_path, png.width, png.height, columns, tile_width, tile_height, tile_count, first_gid, tiles_image_path)
    }
}
const TargetImage = (target_image_path, tile_width, tile_height) => {
    const png = PNG.sync.read(fs.readFileSync(target_image_path));
    const split = split_image(png, tile_width, tile_height)
    return {
        split
    }
}

const compare_blocks = (target_block, tile_block, flipped_horizontally, flipped_vertically, flipped_diagonally) => {

    const w = target_block.tile_width
    const h = target_block.tile_height

    for (let i = 0; i < target_block.tileData.length; i++) {

        const target_x = i % w
        const target_y = Math.floor(i / w)

        let tile_x = target_x
        if (flipped_horizontally) {
            tile_x = w - target_x - 1
        }
        let tile_y = target_y
        if (flipped_vertically) {
            tile_y = h - target_y - 1
        }
        if (flipped_diagonally) {
            let tmp = tile_y
            tile_y = tile_x
            tile_x = tmp
        }
        const tile_i = tile_x + tile_y * w
        const target_pixel = target_block.tileData[i]
        const tile_pixel = tile_block.tileData[tile_i]
        for (let byte = 0; byte < 4; byte++) {
            if (target_pixel[byte] !== tile_pixel[byte]) {
                return false
            }
        }
    }
    return true
}

export const make_json_tiled_map_from_image = (target_image_path, tiles_image_paths, tile_width, tile_height) => {
    const tile_images = []
    let first_gid = 1
    for (let i = 0; i < tiles_image_paths.length; i++) {
        const tile_image = TileImage(tiles_image_paths[i], tile_width, tile_height, first_gid)
        tile_images.push(tile_image)
        first_gid = tile_image.next_gid
    }
    const target_image = TargetImage(target_image_path, tile_width, tile_height)
    const layerData = target_image.split.blocks.map(block => {
        let flipped_horizontally, flipped_vertically, flipped_diagonally
        const found = tile_images.flatMap(tile_image => tile_image.tiles).find(tile => {
            for (flipped_horizontally = 0; flipped_horizontally < 2; flipped_horizontally++) {
                for (flipped_vertically = 0; flipped_vertically < 2; flipped_vertically++) {
                    for (flipped_diagonally = 0; flipped_diagonally < 2; flipped_diagonally++) {
                        const compared = compare_blocks(block, tile, flipped_horizontally, flipped_vertically, flipped_diagonally)
                        if (compared) {
                            return true
                        }
                    }
                }
            }
            return false
        })
        if (found) {
            return found.gid
                + (flipped_horizontally ? FLIPPED_HORIZONTALLY_FLAG : 0)
                + (flipped_vertically ? FLIPPED_VERTICALLY_FLAG : 0)
                + (flipped_diagonally ? FLIPPED_DIAGONALLY_FLAG : 0)
        } else {
            return 0
        }
    })
    const tilesets = tile_images.map(x => x.make_json_tiled_tileset())
    const layers = [
        make_json_tiled_layer(target_image.split.columns, target_image.split.rows, layerData)
    ]
    const map = make_json_tiled_map(target_image.split.columns, target_image.split.rows, tile_width, tile_height, layers, tilesets)

    return map
}

