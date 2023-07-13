import React, { useEffect, useRef, RefObject, forwardRef, useImperativeHandle } from "react";
import L, { Icon, LatLngExpression, Layer, LayerGroup, Map, Marker, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LeafletMapCreateLayers } from '../interfaces/LeafletLayerCreation';
import { GeoJSON, Feature, FeatureCollection, Point, Position } from 'geojson';

const LeafletMap = forwardRef<LeafletMapCreateLayers, {}>((props, ref) => {
  const mapElement: RefObject<HTMLDivElement> = useRef(null);
  const map = useRef<Map | null>(null);
  const layerGroup = useRef<LayerGroup>();

  // Callable functions from Parent component
  useImperativeHandle(ref, () => ({
    removeLayer(layer: Layer): boolean {
      return removeLayer(layer);
    },

    importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions | PathOptions, onEachFeature: (feature: Feature, layer: Layer) => void): LayerGroup {
        return createGeoJSONLayer(geoJSON, style, onEachFeature);
    },

    createIcon(url: string, shadowUrl?: string): Icon {
      return createIcon(url, shadowUrl);
    },

    createMarker(coordinates: Position, icon?: Icon): Marker {
      return createMarker(coordinates, icon);
    },

    createMarkers(geoJSON: GeoJSON, icon?: Icon): LayerGroup {
      return createMarkers(geoJSON, icon);
    }
  }));

  // Initializes Leaflet map with given tiles
  const initMap = (element: HTMLElement): Map => {
    const map: Map = L.map(element, {
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
  const removeMap = () => {
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
  const clearLayers = () => {
    if (layerGroup.current) {
      layerGroup.current.clearLayers();
    }
  }

  // Creates an Icon with
  const createIcon = (url: string, shadowUrl?: string): Icon => {
    const icon: Icon = L.icon({
      iconUrl: url,
      // shadowUrl: shadowUrl,
  
      iconSize:     [50, 50],   // size of the icon
      // shadowSize:   [50, 50],   // size of the shadow
      iconAnchor:   [25, 50],   // point of the icon which will correspond to marker's location
      // shadowAnchor: [3, 27],    // the same for the shadow
      popupAnchor:  [-7, -35]   // point from which the popup should open relative to the iconAnchor
    });

    return icon;
  }

  // Creates a LayerGroup, containing created Markers for given GeoJSON
  const createMarkers = (geoJSON: GeoJSON, icon?: Icon): LayerGroup => {
    if (map.current && layerGroup.current) {
      const markers: Array<Marker> = [];

      (geoJSON as FeatureCollection).features.forEach((feature: Feature) => {
        if ((feature.geometry! as Point).coordinates)
          markers.push(icon ? createMarker((feature.geometry! as Point).coordinates, icon) : createMarker((feature.geometry! as Point).coordinates));
      });

      const layer: LayerGroup = L.layerGroup(markers);
      layer.addTo(layerGroup.current);
      return layer;
    } else
      throw new Error("Leaflet map is currently not being displayed");
  }

  // Creates a Marker either with the default Icon or with the provided one
  const createMarker = (coordinates: Position, icon?: Icon): Marker => {
    const marker: Marker = icon ? L.marker(coordinates as LatLngExpression, {icon}) : L.marker(coordinates as LatLngExpression);
    return marker;
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
