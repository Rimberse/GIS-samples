import csv
from geojson import LineString, Feature, FeatureCollection

# Creates FeatureCollection of Features, using CSV column data as properties of Feature object
def create_feature_collection(csv_file_path):
    # Creates array holding Feature objects
    features = []
    
    # Reads given CSV file
    with open(csv_file_path, 'r') as file:
      reader = csv.DictReader(file)
      # Retrieves column names
      columns = reader.fieldnames
      
      # Iterates over rows of CSV file
      for row in reader:
        # Creates properties object, if column name is missing yields 'UNKNOWN' property name
        properties = {'UNKNOWN' if (len(column_name) == 0) else column_name: row[column_name] for column_name in columns}
        # Creates geometry object, of LineString type with specified coordinates
        geometry = {"type": "LineString", "coordinates": [[0, 0], [0, 0]]}  # Update with your data's geometry
        # Creates Feature object using given geometry and properties
        feature = Feature(geometry=geometry, properties=properties)
        # Stores resulted object in Features array
        features.append(feature)
    
    feature_collection = FeatureCollection(features)
    return feature_collection

# Create .geojson file using given FeatureCollection object at specified and specified file output path
def create_geojson_file(feature_collection, output_file_path):
    with open(output_file_path, "w") as f:
        f.write(str(feature_collection))
        
    print(f"GeoJSON file has been created: '{output_file_path}'")
    
# Maps given property value to property values of GeoJSON file, filters on mapped property value
def map_property_and_filter_features(geojson, property_name_to_map, property_value_to_filter_on):
    feature_collection = FeatureCollection(geojson)
    
    # Filter Features of FeatureCollection based on Property
    filtered_features = list(filter(lambda feature: (feature.properties[property_name_to_map] == property_value_to_filter_on), feature_collection.features))
    return filtered_features
    