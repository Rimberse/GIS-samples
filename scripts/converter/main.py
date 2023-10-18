import sys
import json
from geojson import load, Point, Feature, FeatureCollection
from geometry_constructor import create_feature_collection, create_geojson_file, map_property_and_filter_features
from coordinate_generator import generate_random_coordinates

def main():
    csv_file = sys.argv[1]                  # Or update with your CSV file path
    output_file_path = sys.argv[2]          # Or update with your output file path
    geojson_file_path = sys.argv[3]         # Or update with your geojson file containing zones
        
    # Create FeatureCollection using CSV file column names as property names and column values of property values of Features
    result = create_feature_collection(csv_file)
    # Create .geojson file to create FeatureCollection object
    create_geojson_file(result, output_file_path)
    
    # Open GeoJSON file containing geometry zones
    with open(geojson_file_path) as file:
        geojson_file = load(file)
        
    feature_collection = FeatureCollection(geojson_file)
    
    # Map each feature of created FeatureCollection to opened Features of GeoJSON file
    for feature in result.features:
        # Extract Property values from FeatureCollection
        pu_location_id = int(feature.properties['PULocationID']) if feature.properties['PULocationID'].isdigit() else feature.properties['PULocationID']        # Update with your property name
        do_location_id = int(feature.properties['DOLocationID']) if feature.properties['DOLocationID'].isdigit() else feature.properties['DOLocationID']        # Update with your property name
        
        # Filter Polygons of FeatureCollection based on Property
        pu_filtered_features = map_property_and_filter_features(feature_collection, 'LocationID', pu_location_id)
        do_filtered_features = map_property_and_filter_features(feature_collection, 'LocationID', do_location_id)
        
        if (pu_filtered_features):
            pu_random_coodinates = generate_random_coordinates(1, pu_filtered_features[0].geometry)
            # Parse the JSON string
            pu__random_point_data = json.loads(pu_random_coodinates[0])
            # Update coordinates of Feature with randomized coordinates
            #feature.geometry.coordinates[0] = [1008117.81473218, 192600.584061398]
            feature.geometry.coordinates[0] = pu__random_point_data['coordinates']
            feature.properties['pu_x'] = pu__random_point_data['coordinates'][0]
            feature.properties['pu_y'] = pu__random_point_data['coordinates'][1]
            #print(pu_random_coodinates)
            #print(Point(pu__random_point_data['coordinates']))
            
        if (do_filtered_features):
            do_random_coodinates = generate_random_coordinates(1, do_filtered_features[0].geometry)
            # Parse the JSON string
            do__random_point_data = json.loads(do_random_coodinates[0])
            #feature.geometry.coordinates[1] = [1011379.34422483, 172578.416898179]
            feature.geometry.coordinates[1] = do__random_point_data['coordinates']
            feature.properties['do_x'] = do__random_point_data['coordinates'][0]
            feature.properties['do_y'] = do__random_point_data['coordinates'][1]
            #print(do_random_coodinates[0])
            
    # Create resulting GeoJSON file
    create_geojson_file(result, output_file_path)

if __name__ == "__main__":
    main()
