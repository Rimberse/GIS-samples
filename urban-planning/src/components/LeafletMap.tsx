import React, { useEffect, useRef, RefObject,} from "react";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";

const LeafletMap = () => {
  let mapElement: RefObject<HTMLDivElement> = useRef(null);
  let map = useRef<Map | null>();

  const initMap = (element: HTMLElement) => {
    const map: Map = L.map(element, {
      // options
    }).setView([48.858373738258386, 2.3518390365783475], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return map;
  };

  const removeMap = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

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
};

export default LeafletMap;
