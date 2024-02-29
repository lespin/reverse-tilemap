import fs from 'node:fs'
import { FLIPPED_DIAGONALLY_FLAG, FLIPPED_HORIZONTALLY_FLAG, FLIPPED_VERTICALLY_FLAG, ROTATED_HEXAGONAL_120_FLAG } from './tiled.js';
import { PNG } from "pngjs"

const remove_flips = id => {
    return id &= ~(FLIPPED_HORIZONTALLY_FLAG |
        FLIPPED_VERTICALLY_FLAG |
        FLIPPED_DIAGONALLY_FLAG |
        ROTATED_HEXAGONAL_120_FLAG);
}

const get_used_gids = tilemap => {
    const used_gids = new Set()
    tilemap.layers.forEach(layer => {
        layer.data.forEach(id => {
            if (id !== 0) used_gids.add(remove_flips(id))
        })
    })
    return [...used_gids]
}
const decode_gid = (tilemap, gid) => {
    const tilesets = tilemap.tilesets
    for (let i = tilesets.length - 1; i >= 0; --i) {
        const tileset = tilesets[i];
        if (tileset.firstgid <= gid) {
            const tile_num = gid - tileset.firstgid
            // tileset index, tilenum
            return [i, tile_num]
        }
    }
}


export const make_png_of_used_tiles = (tilemap, read_tileset_image) => {
    const images = tilemap.tilesets.map(tileset => PNG.sync.read(read_tileset_image(tileset)))

    const used_gids = get_used_gids(tilemap)

    const dest_columns = Math.ceil(Math.sqrt(used_gids.length))
    const dest_height = Math.ceil(used_gids.length / dest_columns)
    const dest_png = new PNG({
        width: dest_columns * tilemap.tilewidth,
        height: dest_height * tilemap.tileheight,
        filterType: -1
    });
    used_gids.forEach((gid, destIndex) => {
        const [tileset_index, tile_num] = decode_gid(tilemap, gid)
        const tileset = tilemap.tilesets[tileset_index]
        const si = tile_num % tileset.columns
        const sj = Math.floor(tile_num / tileset.columns)
        const sx = tileset.tilewidth * si
        const sy = tileset.tileheight * sj

        const di = destIndex % dest_columns
        const dj = Math.floor(destIndex / dest_columns)
        const dx = tileset.tilewidth * di
        const dy = tileset.tileheight * dj

        PNG.bitblt(images[tileset_index], dest_png, sx, sy, tileset.tilewidth, tileset.tileheight, dx, dy)                
    })
    return dest_png
}
/*
const tiled_map_path = "./output.tiled.map.json"
const tilemap = JSON.parse(fs.readFileSync(tiled_map_path))

const read_tileset_image = tileset => fs.readFileSync(tileset.image)
const png = make_png_of_used_tiles(tilemap, read_tileset_image)

fs.writeFileSync('output.png',PNG.sync.write(png))
*/
