import { Layer, LayerGroup, PathOptions, Icon, Marker, LatLngExpression, MarkerClusterGroup, IconOptions, Control, TileLayer, WMSOptions } from "leaflet";
import { GeoJSON, Feature } from "geojson";
import { WMTSLayerOptions } from "./LeafletLayers";

interface LeafletMapOperations {
  createTileLayer(URL: string, options?: WMTSLayerOptions): TileLayer;
  createWMSTileLayer(WMSURL: string, WMSOptions?: WMSOptions): TileLayer;
  getMainTileLayer(): TileLayer;
  createControlLayer(baseLayers?: Control.LayersObject, overlays?: Control.LayersObject): void;
  addLayer(layer: Layer): boolean;
  removeLayer(layer: Layer): boolean;
  createGeoJSONLayer(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature?: (feature: Feature, layer: Layer) => void): LayerGroup;
  createIcon(options: IconOptions): Icon;
  createMarker(coordinates: LatLngExpression, popup?: string, icon?: Icon): Marker;
  createMarkers(geoJSON: GeoJSON, popupFeatureProperties?: Map<string, string>, icon?: Icon): MarkerClusterGroup;
}

export type { LeafletMapOperations };
