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

  const style = (feature?: Feature): PathOptions => feature!.properties!.c_ar % 2 === 0 ? { color: "#ff0000" } : { color: "#0000ff" };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const popup: Array<string> = [];

    if (feature!.properties && feature!.properties!.l_ar) {
      popup.push(
        "<b>Arrondissement:</b> ",
        feature.properties.l_ar,
        "<br>"
      );
    }

    if (feature!.properties && feature!.properties!.l_aroff) {
      popup.push(
        "<b>Official name:</b> ",
        feature.properties.l_aroff,
        "<br>"
      );
    }

    if (feature!.properties && feature!.properties!.perimetre) {
      popup.push(
        "<b>Perimeter:</b> ",
        feature.properties.perimetre,
        "<br>",
      );
    }

    if (feature!.properties && feature!.properties!.surface) {
      popup.push(
        "<b>Surface:</b> ",
        feature.properties.surface,
        "<br>"
      );
    }

    popup.pop();
    layer.bindPopup(popup.join(""));
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
