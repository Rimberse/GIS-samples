import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap';
import { LeafletMapOperations } from './interfaces/LeafletLayerOperations';
import { Layers, LayersControl } from './interfaces/LeafletLayers';
import { Layer, Control, PathOptions } from 'leaflet';
import { Feature } from 'geojson';

const App = () => {
  const leafletMap = useRef<LeafletMapOperations>(null);
  const [layers, setLayers] = useState({});

  // To be completed with each specific user-defines layers
  const syncBaseLayersAndOverlays = () => {
    const baseLayers: Control.LayersObject = {};
    const overlays: Control.LayersObject = {};
    const activeLayers: Layers = layers as Layers;

    baseLayers[LayersControl.mainTileLayer] = leafletMap.current!.getMainTileLayer();

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
    leafletMap.current!.createWMSTileLayer('http://ows.mundialis.de/services/service?', {
      layers: 'TOPO-OSM-WMS'
  });
  }, []);

  return (
    <div className="App">
      <header id="header">Land use analysis</header>
      <LeafletMap ref={leafletMap} />
    </div>
  );
}

export default App;
