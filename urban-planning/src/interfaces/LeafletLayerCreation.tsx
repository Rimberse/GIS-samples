import { Layer, LayerGroup, PathOptions, Icon, Marker, LatLngExpression, MarkerClusterGroup, IconOptions } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  removeLayer(layer: Layer): boolean;
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(options: IconOptions): Icon;
  createMarker(coordinates: LatLngExpression, icon?: Icon, popup?: string): Marker;
  createMarkers(geoJSON: GeoJSON, icon?: Icon): MarkerClusterGroup;
}

export type { LeafletMapCreateLayers };
