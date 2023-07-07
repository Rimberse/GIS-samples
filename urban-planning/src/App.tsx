import React, { useRef } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';

interface LeafletMapCreateLayers {
  addGeoJSON(): void;
}

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);

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
