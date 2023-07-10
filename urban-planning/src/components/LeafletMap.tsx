import React, { useEffect, useRef, RefObject, forwardRef, useImperativeHandle } from "react";
import L, { LayerGroup, Map, PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LeafletMapCreateLayers } from '../interfaces/Leaflet';
import { GeoJSON, Feature } from 'geojson';

const LeafletMap = forwardRef<LeafletMapCreateLayers, {}>((props, ref) => {
  const mapElement: RefObject<HTMLDivElement> = useRef(null);
  const map = useRef<Map | null>(null);
  const layerGroup = useRef<LayerGroup>();

  // Callable functions from Parent component
  useImperativeHandle(ref, () => ({
    importGeoJSON(geoJSON: GeoJSON, style: (feature?: Feature) => PathOptions) {
      createGeoJSONLayer(geoJSON, style);
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

  // Creates GeoJSON layer
  const createGeoJSONLayer = (geoJSON: GeoJSON, style: (feature?: Feature) => {}) => {
    if (map.current && layerGroup.current) {
      console.log(geoJSON);
      L.geoJSON(geoJSON, {
        style
      }).addTo(layerGroup.current);
    }
  }

  // Clear layers contained within main LayerGroup
  const clearLayers = () => {
    if (layerGroup.current) {
      layerGroup.current.clearLayers();
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
