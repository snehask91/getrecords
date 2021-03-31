const AWS = require('aws-sdk');
AWS.config.logger = console;
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

module.exports.getAllRecords = async () => {
    let params = {
        TableName: process.env.RECORDS_TABLE,
        Limit: 10
    };
    var response;
    return new Promise((resolve, reject) => {
        dynamodb.scan(params, function scanUntilDone(err, data) {
            if (err) {
                response = err;
                reject(response);
            } else {
                if (data.LastEvaluatedKey) {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    dynamodb.scan(params, scanUntilDone);
                } else {
                    if (items.length === 0) {
                        response = "data not available";
                        reject(response);
                    } else {
                        response = data;
                        resolve(response);
                    }
                }
            }
        });
        return response;
    });
}
