import { SNS } from "aws-sdk";

const sns = new SNS();
const TOPIC_ARN = process.env.APPOINTMENTS_TOPIC_ARN!;

export const publishAppointmentEvent = async (payload: any) => {
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
