import { Layer, LayerGroup, PathOptions, Icon } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  removeLayer(layer: Layer): boolean;
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(url: string, shadowUrl?: string): Icon;
}

export type { LeafletMapCreateLayers };
