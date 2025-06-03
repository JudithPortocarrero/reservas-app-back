import { EventBridge } from "aws-sdk";

const eb = new EventBridge();
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME!;

export const sendAppointmentCompletedEvent = async (payload: any) => {
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