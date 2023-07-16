import { LayerGroup } from "leaflet";

interface Layers {
  parisGeoJSONLayer?: LayerGroup;
  arrondissementsGeoJSONLayer?: LayerGroup;
  housingMarkersLayer?: LayerGroup;
  railwayMarkersLayer?: LayerGroup;
}

enum LayersControl {
  mainTileLayer = 'Mapbox',
  parisGeoJSON = 'Paris',
  arrondissementsGeoJSON = 'Arrondissements de Paris',
  housingMarkers = 'Logements sociaux financés à Paris',
  railwayMarkers = 'Gares et stations du réseau ferré'
}

export type { Layers };
export { LayersControl };
