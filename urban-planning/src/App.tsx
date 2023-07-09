import React, { useRef, useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/Leaflet';
import { GeoJSON } from 'geojson';
import geoJSON from './arrondissements.json';
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <header>Urban planning</header>
      <LeafletMap ref={leafletMap} />
      <LoadingButton 
      loading={loading}
      loadingPosition="start" 
      startIcon={<SaveIcon />} 
      variant="outlined"
      onClick={() => {
        if (leafletMap.current) {
          setLoading(true);
          
          setTimeout(() => {
            leafletMap.current?.importGeoJSON(geoJSON as GeoJSON);
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
