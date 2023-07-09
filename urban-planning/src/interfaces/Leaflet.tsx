import { GeoJSON } from "geojson";

interface LeafletMapCreateLayers {
  importGeoJSON(geoJSON: GeoJSON): void;
}

export type { LeafletMapCreateLayers };
