import React, { useRef } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/Leaflet';
import geojson from './arrondissements.json';

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);
  console.log(geojson);

  return (
    <div className="App">
      <header>Urban planning</header>
      <LeafletMap ref={leafletMap} />
      <button onClick={() => {
        if (leafletMap.current) {
          leafletMap.current?.addGeoJSON()
        }
      }}>Click</button>
    </div>
  );
}

export default App;
