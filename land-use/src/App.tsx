import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapOperations } from './interfaces/LeafletLayerOperations';
import { Layers, LayersControl, TileLayers } from './interfaces/LeafletLayers';
import { Layer, Control, PathOptions } from 'leaflet';
import { Feature } from 'geojson';

const App = () => {
  const leafletMap = useRef<LeafletMapOperations>(null);
  const [tileLayers, setTileLayers] = useState({});
  const [layers, setLayers] = useState({});

  // To be completed with each specific user-defines layers
  const syncBaseLayersAndOverlays = () => {
    const baseLayers: Control.LayersObject = {};
    const overlays: Control.LayersObject = {};
    const activeTileLayers: TileLayers = tileLayers as TileLayers;
    const activeLayers: Layers = layers as Layers;

    baseLayers[LayersControl.mainTileLayer] = leafletMap.current!.getMainTileLayer();

    if (activeTileLayers.copernicus_GLS_LAI300_V1)
      baseLayers[LayersControl.copernicus_GLS_LAI300_V1] = activeTileLayers.copernicus_GLS_LAI300_V1;

    if (activeTileLayers.spectatorEarthSentinel2)
      baseLayers[LayersControl.spectatorEarthSentinel2] = activeTileLayers.spectatorEarthSentinel2;

    if (activeTileLayers.mundialis_TOPO_OSM_WMS)
      baseLayers[LayersControl.mundialis_TOPO_OSM_WMS] = activeTileLayers.mundialis_TOPO_OSM_WMS;

    if (activeTileLayers.mundialis_SRTM30_Colored_Hillshade)
      baseLayers[LayersControl.mundialis_SRTM30_Colored_Hillshade] = activeTileLayers.mundialis_SRTM30_Colored_Hillshade;

    if (activeTileLayers.mundialis_TOPO_WMS_OSM_Overlay_WMS)
      baseLayers[LayersControl.mundialis_TOPO_WMS_OSM_Overlay_WMS] = activeTileLayers.mundialis_TOPO_WMS_OSM_Overlay_WMS;

    if (activeLayers.layer)
      overlays[LayersControl.layer] = activeLayers.layer;

    leafletMap.current!.createControlLayer(baseLayers, overlays);
  }

  // To be customized for specific user-defines use-case
  const style = (feature?: Feature): PathOptions => feature!.properties!.property === 'value' ? { color: "#ff0000" } : { color: "#0000ff" };

  // To be customized for specific user-defines use-case
  const onEachFeature = (feature: Feature, layer: Layer): void => {
    const popup: Array<string> = [];

    if (feature!.properties && feature!.properties!.property) {
      popup.push(
        "<b>Popup header:</b> ",
        feature.properties.property,
        "<br>"
      );
    }

    popup.pop();
    layer.bindPopup(popup.join(""));
  }

  useEffect(() => {
    const tileLayers: TileLayers = {
      copernicus_GLS_LAI300_V1: leafletMap.current!.createTileLayer('https://proba-v-mep.esa.int/applications/geo-viewer/app/mapcache/wmts/1.0.0/{Layer}/default/{TIME}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png', {
        Layer: "CGLS_LAI300_V1", 
        TIME: "2023-07-10", 
        TileMatrixSet: "g3857", 
        TileMatrix: 7, 
        TileRow: 20, 
        TileCol: 22, 
        maxZoom: 19,
      }),

      spectatorEarthSentinel2: leafletMap.current!.createTileLayer('https://api.spectator.earth/imagery/{imageId}/tiles/{z}/{x}/{y}/?bands_formula={bandsFormula}&api_key={apiKey}', {
        imageId: '32885258',
        apiKey: process.env.REACT_APP_SPECTATOR_EARTH_API_KEY,
        bandsFormula: encodeURIComponent('b04,b03,b02')
      }),

      mundialis_TOPO_OSM_WMS: leafletMap.current!.createWMSTileLayer('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-OSM-WMS'
      }),

      mundialis_SRTM30_Colored_Hillshade: leafletMap.current!.createWMSTileLayer('http://ows.mundialis.de/services/service?', {
        layers: 'SRTM30-Colored-Hillshade'
      }),

      mundialis_TOPO_WMS_OSM_Overlay_WMS: leafletMap.current!.createWMSTileLayer('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS,OSM-Overlay-WMS'
      })
    };

    setTileLayers(tileLayers);
  }, []);

  useEffect(() => {
    syncBaseLayersAndOverlays();
  }, [tileLayers, layers]);

  return (
    <div className="App">
      <header id="header">Land use analysis</header>
      <LeafletMap ref={leafletMap} />
    </div>
  );
}

export default App;
