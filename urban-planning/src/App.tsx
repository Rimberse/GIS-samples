import React, { useRef, useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/Leaflet';
import { GeoJSON, Feature } from 'geojson';
import geoJSON from './arrondissements.json';
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { PathOptions } from 'leaflet';

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);
  const [loading, setLoading] = useState(false);

  const style = (feature?: Feature): PathOptions => feature!.properties!.c_ar % 2 === 0 ? {color: "#ff0000"} : {color: "#0000ff"};

  return (
    <div className="App">
      <header id="header">Urban planning</header>
      <LeafletMap ref={leafletMap} />
      <LoadingButton id='arrondissementsBtn' 
      loading={loading}
      loadingPosition="start" 
      startIcon={<SaveIcon />} 
      variant="outlined"
      onClick={() => {
        if (leafletMap.current) {
          setLoading(true);
          
          setTimeout(() => {
            leafletMap.current?.importGeoJSON(geoJSON as GeoJSON, style);
            setLoading(false);
          }, 500);
        }
      }}>
        Arrondissements
      </LoadingButton>
    </div>
  );
}

export default App;
