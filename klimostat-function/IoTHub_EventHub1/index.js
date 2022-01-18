const { MongoClient, ObjectId } = require('mongodb');
const url = "mongodb://cosmosdb-klimostat.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb";

module.exports = function (context, IoTHubMessage){
    MongoClient.connect(url, {
        auth: {
            username: "cosmosdb-klimostat",
            password: "ul0gtBAFJtCp8gWf6QfuCeK8VQglMyqDs3wpqlE7nVLVP2VmwTmNG9kb2OMqOHDXoWqaCgD30H9Eg3edZPq6Qg=="
        },
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false
    }, function(err, client) {
        const db = client.db("klimostat");

        var jsonFile = {
            "timestamp": new Date(new Date(IoTHubMessage.timestamp).toISOString()),
            "temperature": IoTHubMessage.temperature,
            "humidity": IoTHubMessage.humidity,
            "co2": IoTHubMessage.co2,
            "station": ObjectId(IoTHubMessage.station)
        };

        if(jsonFile.temperature && jsonFile.timestamp && jsonFile.humidity && jsonFile.co2 && jsonFile.station) {
            db.collection('measurements').insertOne(jsonFile, function(err, res){
                if(err){
                    throw err
                } else {
                    context.log("Entry finished")
                }
            client.close();
            });
        }
    });
};