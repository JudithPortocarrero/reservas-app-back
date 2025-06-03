"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishAppointmentEvent = void 0;
const aws_sdk_1 = require("aws-sdk");
const sns = new aws_sdk_1.SNS();
const TOPIC_ARN = process.env.APPOINTMENTS_TOPIC_ARN;
const publishAppointmentEvent = async (payload) => {
    await sns
        .publish({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify(payload),
        MessageAttributes: {
            countryISO: {
                DataType: "String",
                StringValue: payload.countryISO,
            },
        },
    })
        .promise();
};
exports.publishAppointmentEvent = publishAppointmentEvent;
