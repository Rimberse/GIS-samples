import { LayerGroup, TileLayer } from "leaflet";

// Used to keep track of created TileLayers
interface TileLayers {
  tileLayer?: TileLayer
  // more user-defines Tilelayers..
}

// Used to keep track of created layers
interface Layers {
  layer?: LayerGroup;
  // more user-defines layers..
}

// Represents WMTS TileLayer options
interface WMTSLayerOptions {
  Layer?: string, 
  TIME?: string, 
  TileMatrixSet?: string, 
  TileMatrix?: number, 
  TileRow?: number, 
  TileCol?: number, 
  maxZoom?: number,
  imageId?: string,
  apiKey?: string,
  bandsFormula?: string
}

// Used with Leaflet's Control Layer
enum LayersControl {
  mainTileLayer = 'Mapbox',
  tileLayer = 'TileLayer',
  layer = 'Layer'
  // more user-defines mappings for layer names in Control pane
}

export type { TileLayers, Layers, WMTSLayerOptions };
export { LayersControl };
