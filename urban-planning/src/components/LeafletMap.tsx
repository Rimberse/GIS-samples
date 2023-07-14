import React, { useEffect, useRef, RefObject, forwardRef, useImperativeHandle } from "react";
import L, { Icon, LatLng, LatLngExpression, LatLngTuple, Layer, LayerGroup, Map as LMap, Marker, MarkerClusterGroup, PathOptions, IconOptions, Control } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster";
import { LeafletMapCreateLayers } from '../interfaces/LeafletLayerCreation';
import { CustomIcon } from "../classes/LeafletCustomClasses";
import { GeoJSON, Feature, FeatureCollection, Point } from 'geojson';

const LeafletMap = forwardRef<LeafletMapCreateLayers, {}>((props, ref) => {
  const mapElement: RefObject<HTMLDivElement> = useRef(null);
  const map = useRef<LMap | null>(null);
  const layerGroup = useRef<LayerGroup>();

  // Callable functions from Parent component
  useImperativeHandle(ref, () => ({
    createControlLayer(baseLayers?: Control.LayersObject, overlays?: Control.LayersObject): void {
      createControlLayer(baseLayers, overlays);
    },

    removeLayer(layer: Layer): boolean {
      return removeLayer(layer);
    },

    importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup {
        return createGeoJSONLayer(geoJSON, style, onEachFeature);
    },

    createIcon(options: IconOptions): Icon {
      return createIcon(options);
    },

    createMarker(coordinates: LatLngExpression, popup?: string, icon?: Icon): Marker {
      return createMarker(coordinates, popup, icon);
    },

    createMarkers(geoJSON: GeoJSON, popupFeatureProperties?: Map<string, string>, icon?: Icon): MarkerClusterGroup {
      return createMarkers(geoJSON, popupFeatureProperties, icon);
    }
  }));

  // Initializes Leaflet map with given tiles
  const initMap = (element: HTMLElement): LMap => {
    const map: LMap = L.map(element, {
      // options
    }).setView([48.858373738258386, 2.3518390365783475], 13);

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      maxZoom: 19,
      attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    }).addTo(map);

    return map;
  };

  // Removes Leaflet map
  const removeMap = (): void => {
    if (map.current) {
      clearLayers();
      map.current.remove();
      map.current = null;
    }
  };

  // Creates a new layer
  const createLayer = (): LayerGroup => L.layerGroup();

  // Removes given layer from main LayerGroup
  const removeLayer = (layer: Layer): boolean => {
    if (layerGroup.current && layerGroup.current.hasLayer(layer)) {
      if (layer instanceof LayerGroup)
        layer.clearLayers();

      layerGroup.current.removeLayer(layer)
      return true;
    } else
      return false;
  }

  // Creates GeoJSON layer
  const createGeoJSONLayer = (geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup => {
    if (map.current && layerGroup.current) {
      const layers: Array<Layer> = [];

      (geoJSON as FeatureCollection).features.forEach((feature: Feature) => {
        layers.push(L.geoJSON(feature, {
          style,
          onEachFeature
        }));
      });

      const layer: LayerGroup = L.layerGroup(layers);
      layer.addTo(layerGroup.current);
      return layer;
    } else
      throw new Error("Leaflet map is currently not being displayed");
  }

  // Clear layers contained within main LayerGroup
  const clearLayers = (): void => {
    if (layerGroup.current) {
      layerGroup.current.clearLayers();
    }
  }

  // Creates an Icon with specified options
  const createIcon = (options: IconOptions): Icon => {
    const icon: CustomIcon = new CustomIcon(options);
    return icon;
  }

  // Creates a LayerGroup, containing created Markers for given GeoJSON
  const createMarkers = (geoJSON: GeoJSON, popupFeatureProperties?: Map<string, string>, icon?: Icon): MarkerClusterGroup => {
    if (map.current && layerGroup.current) {
      const markers: MarkerClusterGroup = L.markerClusterGroup();

      (geoJSON as FeatureCollection).features.forEach((feature: Feature) => {
        if (feature.geometry && (feature.geometry as Point).coordinates) {
          // Converts GeoJSON's lng-lat (or easting-northing) coordinates to Leaflet's lat-lng (or northing-easting) coordinates
          const coordinates: LatLng = L.GeoJSON.coordsToLatLng((feature.geometry as Point).coordinates as LatLngTuple);
          const popup: Array<string> = [];
          let popupContent: string | undefined;

          // Builds popup content using given Map of feature properties
          if (feature.properties && popupFeatureProperties) {
            popupFeatureProperties.forEach((value: string, key: string) => {
              if (feature.properties![key]) {
                popup.push(
                  '<b>' + value + ':</b> ',
                  feature.properties![key],
                  '<br>'
                );
              }
            });

            popup.pop();
            popupContent = popup.join('');
          }

          markers.addLayer(icon ? createMarker(coordinates, popupContent, icon) : createMarker(coordinates, popupContent));
        }
      });

      markers.addTo(layerGroup.current);
      return markers;
    } else
      throw new Error("Leaflet map is currently not being displayed");
  }

  // Creates a Marker either with the default Icon or with the provided one
  const createMarker = (coordinates: LatLngExpression, popup?: string, icon?: Icon): Marker => {
    const marker: Marker = icon ? L.marker(coordinates, {icon}) : L.marker(coordinates);

    if (popup)
      marker.bindPopup(popup);

    return marker;
  }

  // Creates Control Layers, which let's to switch between existing base layers and/or overlays
  const createControlLayer = (baseLayers?: Control.LayersObject, overlays?: Control.LayersObject): void => {
    if (map.current && layerGroup.current) {
      const layerControl: Control.Layers = L.control.layers(baseLayers, overlays);
      layerControl.addTo(map.current);
    }
  }

  // Initializes Leaflet map and creates main LayerGroup
  useEffect(() => {
    if (mapElement.current) {
      map.current = initMap(mapElement.current);
      layerGroup.current = createLayer();
      map.current.addLayer(layerGroup.current);
    } else {
      removeMap();
      console.error("Error");
    }

    // Cleanup
    return () => {
      removeMap();
    };
  }, []);

  return (
    <div id="map" ref={mapElement}></div>
  );
});

export default LeafletMap;
