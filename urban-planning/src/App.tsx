import React, { useRef, useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapCreateLayers } from './interfaces/LeafletLayerCreation';
import { GeoJSON, FeatureCollection, Feature } from 'geojson';
import geoJSON from './resources/geojson/arrondissements.json';
import housingMarkers from './resources/geojson/logements-sociaux-finances-a-paris.json';
import railwayMarkers from './resources/geojson/emplacement-des-gares-idf.json';
import LoadingButton from "@mui/lab/LoadingButton";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import HouseIcon from '@mui/icons-material/House';
import { Layer, LayerGroup, MarkerClusterGroup, PathOptions, Icon, IconOptions, Control } from 'leaflet';
import { Layers, LayersControl } from './interfaces/LeafletLayers';
import TurfUtils from './classes/TurfUtils';

function App() {
  const leafletMap = useRef<LeafletMapCreateLayers>(null);
  const [loading, setLoading] = useState(false);
  const [layers, setLayers] = useState({});

  const syncBaseLayersAndOverlays = () => {
    const baseLayers: Control.LayersObject = {};
    const overlays: Control.LayersObject = {};
    const activeLayers: Layers = layers as Layers;

    baseLayers[LayersControl.mainTileLayer] = leafletMap.current!.getMainTileLayer();

    if (activeLayers.parisGeoJSONLayer)
      overlays[LayersControl.parisGeoJSON] = activeLayers.parisGeoJSONLayer;

    if (activeLayers.arrondissementsGeoJSONLayer)
      overlays[LayersControl.arrondissementsGeoJSON] = activeLayers.arrondissementsGeoJSONLayer;

    if (activeLayers.housingMarkersLayer)
      overlays[LayersControl.housingMarkers] = activeLayers.housingMarkersLayer;

    if (activeLayers.railwayMarkersLayer)
      overlays[LayersControl.railwayMarkers] = activeLayers.railwayMarkersLayer;

    leafletMap.current!.createControlLayer(baseLayers, overlays);
  }

  const style = (feature?: Feature): PathOptions => feature!.properties!.c_ar % 2 === 0 ? { color: "#ff0000" } : { color: "#0000ff" };

  const onEachFeature = (feature: Feature, layer: Layer): void => {
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

      <LoadingButton id='parisBtn' loading={loading} loadingPosition="start" startIcon={<LocationCityIcon />} variant="outlined" onClick={() => {
          if (leafletMap.current) {
            setLoading(true);

            setTimeout(() => {
              const union: Feature = TurfUtils.union(geoJSON as GeoJSON) as Feature;
              const unionGeoJSON: GeoJSON = {
                type: "FeatureCollection",
                features: [union]
              };

              const layer: LayerGroup = leafletMap.current!.createGeoJSONLayer(unionGeoJSON, style);

              if (layer) {
                if ((layers as Layers).parisGeoJSONLayer) {
                  if (!leafletMap.current?.removeLayer((layers as Layers).parisGeoJSONLayer!))
                    alert('Unable to remove existing GeoJSON layer!');
                }

                const newLayers: Layers = (layers as Layers);
                newLayers.parisGeoJSONLayer = layer;
                setLayers(newLayers);
                syncBaseLayersAndOverlays();
              }

              setLoading(false);
            }, 500);
          }
        }}>Paris</LoadingButton>

      <LoadingButton id='arrondissementsBtn' loading={loading} loadingPosition="start" startIcon={<ApartmentIcon />} variant="outlined" onClick={() => {
          if (leafletMap.current) {
            setLoading(true);

            setTimeout(() => {
              const layer: LayerGroup = leafletMap.current!.createGeoJSONLayer(geoJSON as GeoJSON, style, onEachFeature);

              if (layer) {
                if ((layers as Layers).arrondissementsGeoJSONLayer) {
                  if (!leafletMap.current?.removeLayer((layers as Layers).arrondissementsGeoJSONLayer!))
                    alert('Unable to remove existing GeoJSON layer!');
                }

                const newLayers: Layers = (layers as Layers);
                newLayers.arrondissementsGeoJSONLayer = layer;
                setLayers(newLayers);
                syncBaseLayersAndOverlays();
              }

              setLoading(false);
            }, 500);
          }
        }}>Arrondissements</LoadingButton>

      <LoadingButton id='publicHousingBtn' loading={loading} loadingPosition="start" startIcon={<HouseIcon />} variant="outlined" onClick={() => {
          if (leafletMap.current) {
            setLoading(true);

            setTimeout(() => {
              const options: IconOptions = {
                iconUrl: require('./resources/img/Building.png')
              };

              const popupFeatureProperties: Map<string, string> = new Map([
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

              const icon: Icon = leafletMap.current!.createIcon(options);
              const layer: LayerGroup = leafletMap.current!.createMarkers(housingMarkers as GeoJSON, popupFeatureProperties, icon);

              if (layer) {
                if ((layers as Layers).housingMarkersLayer) {
                  if (!leafletMap.current?.removeLayer((layers as Layers).housingMarkersLayer!))
                    alert('Unable to remove existing GeoJSON layer!');
                }

                leafletMap.current!.addLayer(layer);
                const newLayers: Layers = (layers as Layers);
                newLayers.housingMarkersLayer = layer;
                setLayers(newLayers);
                syncBaseLayersAndOverlays();
              }

              setLoading(false);
            }, 500);
          }
        }}>Logements sociaux</LoadingButton>

      <LoadingButton id='railwayStopsBtn' loading={loading} loadingPosition="start" startIcon={<DirectionsSubwayIcon />} variant="outlined" onClick={() => {
          if (leafletMap.current) {
            setLoading(true);

            setTimeout(() => {
              const rerOptions: IconOptions = {
                iconUrl: require('./resources/img/RER.png')
              };

              const metroOptions: IconOptions = {
                iconUrl: require('./resources/img/Metro.png')
              };

              const trainOptions: IconOptions = {
                iconUrl: require('./resources/img/Transilien.png')
              };

              const tramwayOptions: IconOptions = {
                iconUrl: require('./resources/img/Tramway.png')
              };

              const valOptions: IconOptions = {
                iconUrl: require('./resources/img/VAL.png')
              };

              const popupFeatureProperties: Map<string, string> = new Map([
                ['nom_gares', 'Nom de la gare/arrêt'],
                ['mode', 'Type de mode desservant la gare'],
                ['res_com', 'Nom commercial du réseau desservant la gare/station'],
                ['exploitant', 'Nom de l\'exploitant de la gare'],
                ['idf', 'En Île-de-France - 1 [oui], 0 [non]'],
                ['principal', 'Principales gares - 1 [oui], 0 [non]'],
                ['tertrain', 'Terminus d\'une ligne (Train) - 1 [oui], 0 [non]'],
                ['terrer', 'Terminus d\'une ligne (RER) - 1 [oui], 0 [non]'],
                ['termetro', 'Terminus d\'une ligne (Metro) - 1 [oui], 0 [non]'],
                ['tertram', 'Terminus d\'une ligne (Tramway) - 1 [oui], 0 [non]'],
                ['terval', 'Terminus d\'une ligne (VAL ou funiculaire) - 1 [oui], 0 [non]']
              ]);

              const rerIcon: Icon = leafletMap.current!.createIcon(rerOptions);
              const metroIcon: Icon = leafletMap.current!.createIcon(metroOptions);
              const trainIcon: Icon = leafletMap.current!.createIcon(trainOptions);
              const tramwayIcon: Icon = leafletMap.current!.createIcon(tramwayOptions);
              const valIcon: Icon = leafletMap.current!.createIcon(valOptions);

              const rerGeoJSON: GeoJSON = {
                "features": (railwayMarkers as FeatureCollection).features.filter((feature: Feature) => feature.properties!.mode === 'RER'),
                "type": "FeatureCollection"
              }

              const metroGeoJSON: GeoJSON = {
                "features": (railwayMarkers as FeatureCollection).features.filter((feature: Feature) => feature.properties!.mode === 'METRO'),
                "type": "FeatureCollection"
              }

              const trainGeoJSON: GeoJSON = {
                "features": (railwayMarkers as FeatureCollection).features.filter((feature: Feature) => feature.properties!.mode === 'TRAIN'),
                "type": "FeatureCollection"
              }

              const tramwayGeoJSON: GeoJSON = {
                "features": (railwayMarkers as FeatureCollection).features.filter((feature: Feature) => feature.properties!.mode === 'TRAMWAY'),
                "type": "FeatureCollection"
              }

              const valGeoJSON: GeoJSON = {
                "features": (railwayMarkers as FeatureCollection).features.filter((feature: Feature) => feature.properties!.mode === 'VAL'),
                "type": "FeatureCollection"
              }

              const layer: MarkerClusterGroup = leafletMap.current!.createMarkers(rerGeoJSON, popupFeatureProperties, rerIcon);

              if (layer) {
                if ((layers as Layers).railwayMarkersLayer) {
                  if (!leafletMap.current?.removeLayer((layers as Layers).railwayMarkersLayer!))
                    alert('Unable to remove existing GeoJSON layer!');
                }

                layer.addLayers(leafletMap.current!.createMarkers(metroGeoJSON, popupFeatureProperties, metroIcon).getLayers());
                layer.addLayers(leafletMap.current!.createMarkers(trainGeoJSON, popupFeatureProperties, trainIcon).getLayers());
                layer.addLayers(leafletMap.current!.createMarkers(tramwayGeoJSON, popupFeatureProperties, tramwayIcon).getLayers());
                layer.addLayers(leafletMap.current!.createMarkers(valGeoJSON, popupFeatureProperties, valIcon).getLayers());
                leafletMap.current!.addLayer(layer);

                const newLayers: Layers = (layers as Layers);
                newLayers.railwayMarkersLayer = layer;
                setLayers(newLayers);
                syncBaseLayersAndOverlays();
              }

              setLoading(false);
            }, 500);
          }
        }}>Gares et stations</LoadingButton>
    </div>
  );
}

export default App;
