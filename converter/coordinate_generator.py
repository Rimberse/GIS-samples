import random
from shapely import to_geojson
from shapely.geometry import shape, Point

# Generates given number of random coordinate points (in lat/long format) within provided Polygon
def generate_random_coordinates(number, polygon):
    # Shape passed object to convert it into Shapely geometry
    polygon = shape(polygon)
    
    random_points = []
    # Retrieves boundaries of given Polygon
    min_x, min_y, max_x, max_y = polygon.bounds
    
    # Generates specified number of random coordinate points
    while len(random_points) < number:
        random_point = Point(random.uniform(min_x, max_x), random.uniform(min_y, max_y))
        
        # Out-of-bounds check
        if polygon.contains(random_point):
            random_points.append(to_geojson(random_point))
            
    return random_points
    