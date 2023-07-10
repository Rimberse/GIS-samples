import { Layer, PathOptions } from "leaflet";
import { GeoJSON, Feature } from "geojson";

interface LeafletMapCreateLayers {
  importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions): Layer;
}

export type { LeafletMapCreateLayers };
