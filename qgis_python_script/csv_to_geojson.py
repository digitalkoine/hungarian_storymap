input_uri = 'file:////Users/giovannipietrovitali/Desktop/storymaps_finali/hungarian/data/csv/'
output_uri = '/Users/giovannipietrovitali/Desktop/storymaps_finali/hungarian/data/geojson/'
list_csv = ['hungarian_covers_data']

for i in list_csv:
    file_name = i
    print(file_name)
    uri = input_uri+file_name+'.csv?delimiter=,&yField=lat&xField=lng&crs=epsg:4326'
    #Make a vector layer
    name_points_in_TOC = 'points_'+file_name
    data = QgsVectorLayer(uri,name_points_in_TOC,"delimitedtext")

    #Check if layer is valid
    if not data.isValid():
        print ("Layer not loaded")

    #Add CSV data    
    QgsProject.instance().addMapLayer(data)

    #set the parameters for the pointstopath processing algorithm
    alg_params = {
        'CLOSE_PATH': False,
        'GROUP_EXPRESSION': '',
        'INPUT': data, # name of the loaded csv layer
        'NATURAL_SORT': False,
        'ORDER_EXPRESSION': '',
        'OUTPUT':'memory:' # this saves the feature class to memory
    }
    # run and load it is useful because it loads immediately within the TOC
    linearisation = processing.run('native:pointstopath', alg_params) 

    line = QgsProject.instance().addMapLayer(linearisation['OUTPUT'])

    options = QgsVectorFileWriter.SaveVectorOptions()
    options.driverName = "geoJson"
    points_path_geojson = output_uri+file_name+".geojson"
    line_path_geojson = output_uri+file_name+"_line.geojson"

    # calls data and saves it as a geojson, using the options specified above
    QgsVectorFileWriter.writeAsVectorFormat(data,points_path_geojson,options)
    QgsVectorFileWriter.writeAsVectorFormat(line,line_path_geojson,options)