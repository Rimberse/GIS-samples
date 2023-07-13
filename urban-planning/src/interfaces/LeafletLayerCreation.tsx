import { Layer, LayerGroup, PathOptions, Icon, LatLngExpression, Marker } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  removeLayer(layer: Layer): boolean;
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(url: string, shadowUrl?: string): Icon;
  createMarker(coordinates: LatLngExpression, icon?: Icon): Marker;
}

export type { LeafletMapCreateLayers };
