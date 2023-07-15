import { LayerGroup } from "leaflet";

interface Layers {
  geoJSONLayer?: LayerGroup;
  housingMarkersLayer?: LayerGroup;
  railwayMarkersLayer?: LayerGroup;
}

enum LayersControl {
  mainTileLayer = 'Mapbox',
  geojson = 'Arrondissements de Paris',
  housingMarkers = 'Logements sociaux financés à Paris',
  railwayMarkers = 'Gares et stations du réseau ferré d\'Île-de-France'
}

export type { Layers };
export { LayersControl };
