import React, { useRef, useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/LeafletLayerCreation';
import { GeoJSON, Feature } from 'geojson';
import geoJSON from './arrondissements.json';
import LoadingButton from "@mui/lab/LoadingButton";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Content, Layer, PathOptions, Popup } from 'leaflet';
import { Layers } from './interfaces/LeafletLayers';

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);
  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState({});

  const style = (feature?: Feature): PathOptions => feature!.properties!.c_ar % 2 === 0 ? {color: "#ff0000"} : {color: "#0000ff"};

  const onEachFeature = (feature: Feature, layer: Layer) => {
    if (feature!.properties && feature.properties!.l_ar && feature.properties!.l_aroff && feature.properties.perimetre && feature.properties.surface) {
      const content = {
        districtNumber: feature.properties.l_ar,
        officialName: feature.properties.l_aroff,
        perimeter: feature.properties.perimetre,
        surface: feature.properties.surface
      }

      const popup: Array<String> = [];

      popup.push(
        "<b>Arrondissement:</b> ",
        content.districtNumber,
        "<br>",
        "<b>Official name:</b> ",
        content.officialName,
        "<br>",
        "<b>Perimeter:</b> ",
        content.perimeter,
        "<br>",
        "<b>Surface:</b> ",
        content.surface
      );
      
      layer.bindPopup(popup.join(""));
    }
}

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
            const layer = leafletMap.current?.importGeoJSON(geoJSON as GeoJSON, style, onEachFeature);

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
