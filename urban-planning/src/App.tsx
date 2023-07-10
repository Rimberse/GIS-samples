import React, { useRef, useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/Leaflet';
import { GeoJSON, Feature } from 'geojson';
import geoJSON from './arrondissements.json';
import LoadingButton from "@mui/lab/LoadingButton";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Layer, PathOptions } from 'leaflet';

interface Layers {
  geoJSONLayer?: Layer
}

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);
  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState({});

  const style = (feature?: Feature): PathOptions => feature!.properties!.c_ar % 2 === 0 ? {color: "#ff0000"} : {color: "#0000ff"};

  return (
    <div className="App">
      <header id="header">Urban planning</header>
      <LeafletMap ref={leafletMap} />
      <LoadingButton id='arrondissementsBtn' 
      loading={loading}
      loadingPosition="start" 
      startIcon={<LocationCityIcon />} 
      variant="outlined"
      onClick={() => {
        if (leafletMap.current) {
          setLoading(true);
          
          setTimeout(() => {
            const layer = leafletMap.current?.importGeoJSON(geoJSON as GeoJSON, style);

            if (layer) {
              const newLayers: Layers = {
                geoJSONLayer: layer,
                ...layers
              };

              setLayers(newLayers);
            }

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
