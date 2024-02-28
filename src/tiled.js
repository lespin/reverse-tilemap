export const FLIPPED_HORIZONTALLY_FLAG  = 0x80000000;
export const FLIPPED_VERTICALLY_FLAG    = 0x40000000;
export const FLIPPED_DIAGONALLY_FLAG    = 0x20000000;
export const ROTATED_HEXAGONAL_120_FLAG = 0x10000000;

export const make_json_tiled_tileset = (image, imagewidth, imageheight, columns, tilewidth, tileheight, tilecount, firstgid, name) => ({
    columns,
    image,
    imageheight,
    imagewidth,
    firstgid,
    "margin": 0,
    name,
    "spacing": 0,
    tilecount,
    tileheight,
    tilewidth,
})

export const make_json_tiled_layer = (width, height, data) => ({
    width,
    height,
    data,
    "id": 1,
    "name": "Calque de Tuiles 1",
    "opacity": 1,
    "type": "tilelayer",
    "visible": true,
    "x": 0,
    "y": 0
})
export const make_json_tiled_map = (width, height, tilewidth, tileheight, layers, tilesets) => ({
    width,
    height,
    tilewidth,
    tileheight,
    "compressionlevel": -1,
    "infinite": false,
    layers,
    "nextlayerid": 2,
    "nextobjectid": 1,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tiledversion": "1.10.2",
    "type": "map",
    "version": "1.10",
    tilesets
})