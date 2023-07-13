import { Layer, LayerGroup, PathOptions, Icon, Marker } from "leaflet";
import { GeoJSON, Feature, Position } from "geojson";

interface LeafletMapCreateLayers {
  removeLayer(layer: Layer): boolean;
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(url: string, shadowUrl?: string): Icon;
  createMarker(coordinates: Position, icon?: Icon): Marker;
  createMarkers(geoJSON: GeoJSON, icon?: Icon): LayerGroup;
}

export type { LeafletMapCreateLayers };
