import React, { useEffect, useRef, RefObject, forwardRef, useImperativeHandle } from "react";
import L, { LayerGroup, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LeafletMapCreateLayers } from '../interfaces/Leaflet';
import { GeoJSON } from 'geojson';

const LeafletMap = forwardRef<LeafletMapCreateLayers, {}>((props, ref) => {
  const mapElement: RefObject<HTMLDivElement> = useRef(null);
  const map = useRef<Map | null>(null);
  const layerGroup = useRef<LayerGroup>();

  useImperativeHandle(ref, () => ({
    importGeoJSON(geoJSON: GeoJSON) {
      createGeoJSONLayer(geoJSON);
    }
  }));

  const initMap = (element: HTMLElement) => {
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

  const removeMap = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  const createGeoJSONLayer = (geoJSON: GeoJSON) => {
    console.log(geoJSON);
  }

  useEffect(() => {
    if (mapElement.current) {
      map.current = initMap(mapElement.current);
    } else {
      removeMap();
      console.error("Error");
    }

    return () => {
      removeMap();
    };
  }, []);

  return (
    <div id="map" ref={mapElement}></div>
  );
});

export default LeafletMap;
