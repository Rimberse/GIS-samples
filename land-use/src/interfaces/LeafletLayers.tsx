import { LayerGroup, TileLayer } from "leaflet";

// Used to keep track of created TileLayers
interface TileLayers {
  mundialis_TOPO_OSM_WMS?: TileLayer,
  mundialis_SRTM30_Colored_Hillshade?: TileLayer,
  mundialis_TOPO_WMS_OSM_Overlay_WMS?: TileLayer
}

// Used to keep track of created layers
interface Layers {
  layer?: LayerGroup;
  // more user-defines layers..
}

// Used with Leaflet's Control Layer
enum LayersControl {
  mainTileLayer = 'Mapbox',
  mundialis_TOPO_OSM_WMS = 'Mundialis TOPO-OSM-WMS',
  mundialis_SRTM30_Colored_Hillshade = 'SRTM30-Colored-Hillshade',
  mundialis_TOPO_WMS_OSM_Overlay_WMS = 'TOPO-WMS and OSM-Overlay-WMS',
  layer = 'Layer'
  // more user-defines mappings for layer names in Control pane
}

export type { TileLayers, Layers };
export { LayersControl };
