import { LayerGroup, TileLayer } from "leaflet";

// Used to keep track of created TileLayers
interface TileLayers {
  mundialis_TOPO_OSM_WMS?: TileLayer,
  mundialis_SRTM30_Colored_Hillshade?: TileLayer,
  mundialis_TOPO_WMS_OSM_Overlay_WMS?: TileLayer,
  copernicus_GLS_LAI300_V1?: TileLayer,
  tileLayer?: TileLayer
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
}

// Used with Leaflet's Control Layer
enum LayersControl {
  mainTileLayer = 'Mapbox',
  mundialis_TOPO_OSM_WMS = 'Topography',
  mundialis_SRTM30_Colored_Hillshade = 'Colored Hillshade',
  mundialis_TOPO_WMS_OSM_Overlay_WMS = 'Topography, then places',
  copernicus_GLS_LAI300_V1 = 'GLS_LAI300_V1',
  layer = 'Layer'
  // more user-defines mappings for layer names in Control pane
}

export type { TileLayers, Layers, WMTSLayerOptions };
export { LayersControl };
