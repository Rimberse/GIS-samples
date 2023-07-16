import { difference, intersect, union } from '@turf/turf';
import { GeoJSON, Feature, FeatureCollection, Polygon, MultiPolygon } from 'geojson';

// Utility class to to perform operations on geometry using Turf.js
class TurfUtils {
    // Finds the difference between two polygons
    static difference(geojson: GeoJSON): Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon | unknown {
        return(geojson as FeatureCollection).features.reduce(
            (accumulator: unknown, currentValue: unknown) => difference(accumulator as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon, currentValue as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon),
            (geojson as FeatureCollection).features[0] as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
        );
    }

    // Takes two polygon or multi-polygon geometries and finds their polygonal intersection
    static intersect(geojson: GeoJSON): Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon | unknown {
        return(geojson as FeatureCollection).features.reduce(
            (accumulator: unknown, currentValue: unknown) => intersect(accumulator as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon, currentValue as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon),
            (geojson as FeatureCollection).features[0] as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
        );
    }

    // Takes two (Multi)Polygon(s) and returns a combined polygon
    static union(geojson: GeoJSON): Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon | unknown {
        return(geojson as FeatureCollection).features.reduce(
            (accumulator: unknown, currentValue: unknown) => union(accumulator as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon, currentValue as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon),
            (geojson as FeatureCollection).features[0] as Feature<Polygon | MultiPolygon> | Polygon | MultiPolygon
        );
    }

    // to be completed with other user-defined functions...
}

export default TurfUtils;
