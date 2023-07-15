import { union } from '@turf/turf';
import { GeoJSON, Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';

class TurfUtils {
    static union(geojson: GeoJSON): Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon | unknown { 
        return(geojson as FeatureCollection).features.reduce(
            (accumulator: unknown, currentValue: unknown) => union(accumulator as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon, currentValue as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon),
            (geojson as FeatureCollection).features[0] as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
        );
    }
}

export default TurfUtils;
