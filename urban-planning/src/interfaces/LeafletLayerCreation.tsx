import { Layer, LayerGroup, PathOptions, Icon, Marker, LatLngExpression, MarkerClusterGroup, IconOptions, Control } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  createControlLayer(baseLayers?: Control.LayersObject, overlays?: Control.LayersObject): void;
  removeLayer(layer: Layer): boolean;
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(options: IconOptions): Icon;
  createMarker(coordinates: LatLngExpression, popup?: string, icon?: Icon): Marker;
  createMarkers(geoJSON: GeoJSON, popupFeatureProperties?: Map<string, string>, icon?: Icon): MarkerClusterGroup;
}

export type { LeafletMapCreateLayers };
