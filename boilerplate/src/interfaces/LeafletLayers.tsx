import { LayerGroup } from "leaflet";

// Used to keep track of created layers
interface Layers {
  layer?: LayerGroup;
  // more user-defines layers..
}

// Used with Leaflet's Control Layer
enum LayersControl {
  mainTileLayer = 'Mapbox',
  layer = 'Layer'
  // more user-defines mappings for layer names in Control pane
}

export type { Layers };
export { LayersControl };
