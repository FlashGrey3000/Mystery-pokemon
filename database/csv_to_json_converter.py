import csv
import json
import ast  # Added for literal_eval

csv_file_path = 'Pokemon_Database.csv'
json_file_path = 'output.json'

csv_data = []
with open(csv_file_path, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        # Convert the dictionary-like strings to actual dictionaries
        for key in ['Stats', 'Abilities', 'Evolution_condition']:
            if key in row and row[key].startswith('{') and row[key].endswith('}'):
                # Replace single quotes with double quotes and use ast.literal_eval
                row[key] = ast.literal_eval(row[key].replace("'", '"'))

        # Convert the string representation of the tuple back to a tuple
        if 'Region' in row and row['Region'].startswith('(') and row['Region'].endswith(')'):
            # Use ast.literal_eval to safely evaluate the string as a tuple
            row['Region'] = ast.literal_eval(row['Region'])

        csv_data.append(row)

with open(json_file_path, 'w') as json_file:
    json.dump(csv_data, json_file, indent=2)
