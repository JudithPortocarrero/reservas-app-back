"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAppointment = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamo = new aws_sdk_1.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE;
const saveAppointment = async (data) => {
    const item = {
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
    await dynamo
        .put({
        TableName: TABLE_NAME,
        Item: item,
    })
        .promise();
    return item;
};
exports.saveAppointment = saveAppointment;
