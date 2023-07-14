import React, { useRef, useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/LeafletLayerCreation';
import { GeoJSON, Feature } from 'geojson';
import geoJSON from './resources/geojson/arrondissements.json';
import markers from './resources/geojson/logements-sociaux-finances-a-paris.json';
import LoadingButton from "@mui/lab/LoadingButton";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HouseIcon from '@mui/icons-material/House';
import { Layer, PathOptions, IconOptions, Control } from 'leaflet';
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
        "<b>Numéro d’arrondissement:</b> ",
        feature.properties.l_ar,
        "<br>"
      );
    }

    if (feature!.properties && feature!.properties!.l_aroff) {
      popup.push(
        "<b>Nom officiel de l’arrondissement:</b> ",
        feature.properties.l_aroff,
        "<br>"
      );
    }

    if (feature!.properties && feature!.properties!.perimetre) {
      popup.push(
        "<b>Périmètre:</b> ",
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
              const layer = leafletMap.current!.importGeoJSON(geoJSON as GeoJSON, style, onEachFeature);

              if (layer) {
                if ((layers as Layers).geoJSONLayer) {
                  if (!leafletMap.current?.removeLayer((layers as Layers).geoJSONLayer!))
                    alert('Unable to remove existing GeoJSON layer!');
                }

                const newLayers: Layers = (layers as Layers);
                newLayers.geoJSONLayer = layer;
                setLayers(newLayers);
              }

              setLoading(false);
            }, 500);
          }
        }}>
        Arrondissements
      </LoadingButton>

      <LoadingButton id='publicHousingBtn'
        loading={loading}
        loadingPosition="start"
        startIcon={<HouseIcon />}
        variant="outlined"
        onClick={() => {
          if (leafletMap.current) {
            setLoading(true);

            setTimeout(() => {
              const options: IconOptions = {
                iconUrl: require('./resources/img/building.png')
              };

              const popupFeatureProperties = new Map([
                ['nature_programme', 'Nature de programme'],
                ['mode_real', 'Mode de réalisation'],
                ['nb_logmt_total', 'Nombre total de logements financés'],
                ['nb_plai', 'Dont nombre de logements PLA I'],
                ['nb_plus', 'Dont nombre de logements PLUS'],
                ['nb_pluscd', 'Dont nombre de logements PLUS CD'],
                ['nb_pls', 'Dont nombre de logements PLS'],
                ['bs', 'Bailleur social'],
                ['adresse_programme', 'Adresse du programme']
              ]);

              const icon = leafletMap.current!.createIcon(options);
              const layer = leafletMap.current!.createMarkers(markers as GeoJSON, popupFeatureProperties, icon);

              if (layer) {
                if ((layers as Layers).markersLayer) {
                  if (!leafletMap.current?.removeLayer((layers as Layers).markersLayer!))
                    alert('Unable to remove existing GeoJSON layer!');
                }

                const newLayers: Layers = (layers as Layers);
                newLayers.markersLayer = layer;
                setLayers(newLayers);
              }

              setLoading(false);
            }, 500);
          }
        }}>
        Logements sociaux
      </LoadingButton>
    </div>
  );
}

export default App;
