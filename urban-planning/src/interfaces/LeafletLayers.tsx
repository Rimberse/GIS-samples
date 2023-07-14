import { LayerGroup } from "leaflet";

interface Layers {
  geoJSONLayer?: LayerGroup;
  markersLayer?: LayerGroup;
}

enum LayersControl {
  geojson = 'Arrondissements',
  markers = 'Logements sociaux'
}

export type { Layers };
export { LayersControl };
