"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentCompletedEvent = void 0;
const aws_sdk_1 = require("aws-sdk");
const eb = new aws_sdk_1.EventBridge();
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME;
const sendAppointmentCompletedEvent = async (payload) => {
    await eb.putEvents({
        Entries: [
            {
                EventBusName: EVENT_BUS_NAME,
                Source: "appointment.service",
                DetailType: "AppointmentCompleted",
                Detail: JSON.stringify(payload),
            },
        ],
    }).promise();
};
exports.sendAppointmentCompletedEvent = sendAppointmentCompletedEvent;
