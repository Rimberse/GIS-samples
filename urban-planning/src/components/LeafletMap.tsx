import React, { useEffect, useRef, RefObject, forwardRef, useImperativeHandle } from "react";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapCreateLayers {
  addGeoJSON(): void;
}

const LeafletMap = forwardRef<LeafletMapCreateLayers, {}>((props, ref) => {
  let mapElement: RefObject<HTMLDivElement> = useRef(null);
  let map = useRef<Map | null>(null);

  useImperativeHandle(ref, () => ({
    addGeoJSON() {
      addGeoJSONLayer();
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

  const addGeoJSONLayer = () => {
    console.log("It works");
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
