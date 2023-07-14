import { LayerGroup } from "leaflet";

interface Layers {
  geoJSONLayer?: LayerGroup;
  markersLayer?: LayerGroup;
}

enum LayersControl {
  mainTileLayer = 'Mapbox',
  geojson = 'Arrondissements',
  markers = 'Logements sociaux'
}

export type { Layers };
export { LayersControl };
