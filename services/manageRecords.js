'use strict';
const GET_ALL_RECORDS = require('./getRecords.js');

module.exports.manageRecords = async () => {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        fetch("http://localhost:3000/v1/get-records", requestOptions)
            .then(response => response.text())
            .then(result => {
                let getRecords = result;
                let Ids = [];
                let Open, closed_count_array, ClosedCount, PreviousPage, NextPage;
                let response_json = {};
                _.each(getRecords, function (o) {
                    Ids.push(_.pick(o, 'id'));
                });
                Open = getRecords.filter(({ disposition }) => disposition == "open");
                closed_count_array = getRecords.filter(({ disposition }) => disposition == "closed");
                ClosedCount = closed_count_array.length;
                if (getRecords.ExclusiveStartKey) {
                    PreviousPage = getRecords.ExclusiveStartKey;
                } else {
                    PreviousPage = null;
                }
                if (getRecords.LastEvaluatedKey) {
                    NextPage = getRecords.LastEvaluatedKey;
                } else {
                    NextPage = null;
                }
                response_json.Ids = Ids;
                response_json.Open = Open;
                response_json.ClosedCount = ClosedCount;
                response_json.PreviousPage = PreviousPage;
                response_json.NextPage = NextPage;
                return {
                    statusCode: 200,
                    body: JSON.stringify({ "statusCode": 200, "status": "SUCCESS", "data": response_json })
                }
            })
            .catch(error => {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ "statusCode": 400, "status": "ERROR", "errMessage": error })
                }
            });
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "statusCode": 400, "status": "ERROR", "errMessage": error })
        }
    }
}