import { LayerGroup } from "leaflet";

interface Layers {
  geoJSONLayer?: LayerGroup;
  housingMarkersLayer?: LayerGroup;
}

enum LayersControl {
  mainTileLayer = 'Mapbox',
  geojson = 'Arrondissements',
  housingMarkers = 'Logements sociaux'
}

export type { Layers };
export { LayersControl };
