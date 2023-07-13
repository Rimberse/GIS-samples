import { Layer, LayerGroup, PathOptions, Icon, Marker, LatLngExpression, MarkerClusterGroup } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  removeLayer(layer: Layer): boolean;
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(url: string, shadowUrl?: string): Icon;
  createMarker(coordinates: LatLngExpression, icon?: Icon): Marker;
  createMarkers(geoJSON: GeoJSON, icon?: Icon): MarkerClusterGroup;
}

export type { LeafletMapCreateLayers };
