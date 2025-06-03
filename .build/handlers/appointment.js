"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByInsuredId = exports.updateStatus = exports.register = void 0;
const dynamo_1 = require("../utils/dynamo");
const sns_1 = require("../utils/sns");
const aws_sdk_1 = require("aws-sdk");
const dynamo = new aws_sdk_1.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE;
const register = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { insuredId, scheduleId, countryISO } = body;
        if (!insuredId || !scheduleId || !["PE", "CL"].includes(countryISO)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Datos inválidos" }),
            };
        }
        const result = await (0, dynamo_1.saveAppointment)({ insuredId, scheduleId, countryISO });
        await (0, sns_1.publishAppointmentEvent)(result);
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Appointment saved and published", data: result }),
        };
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno", details: err }),
        };
    }
};
exports.register = register;
const updateStatus = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body); // de SQS
        const detail = body.detail; // porque viene de EventBridge
        const { insuredId, scheduleId } = detail;
        console.log("Updating:", { insuredId, scheduleId });
        await dynamo.update({
            TableName: TABLE_NAME,
            Key: { insuredId, scheduleId },
            UpdateExpression: "set #s = :s",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":s": "completed" },
        }).promise();
    }
};
exports.updateStatus = updateStatus;
const getByInsuredId = async (event) => {
    const insuredId = event.pathParameters?.insuredId;
    if (!insuredId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Missing insuredId" }),
        };
    }
    const result = await dynamo.query({
        TableName: TABLE_NAME,
        KeyConditionExpression: "insuredId = :id",
        ExpressionAttributeValues: {
            ":id": insuredId,
        },
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify(result.Items),
    };
};
exports.getByInsuredId = getByInsuredId;
