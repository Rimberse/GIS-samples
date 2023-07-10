import { PathOptions } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions): void;
}

export type { LeafletMapCreateLayers };
