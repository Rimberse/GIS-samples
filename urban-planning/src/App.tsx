import React, { useRef } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/Leaflet';
import { GeoJSON } from 'geojson';
import geoJSON from './arrondissements.json';

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);

  return (
    <div className="App">
      <header>Urban planning</header>
      <LeafletMap ref={leafletMap} />
      <button onClick={() => {
        if (leafletMap.current) {
          leafletMap.current?.importGeoJSON(geoJSON as GeoJSON)
        }
      }}>Click</button>
    </div>
  );
}

export default App;
