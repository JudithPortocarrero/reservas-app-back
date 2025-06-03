import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE!;

export const saveAppointment = async (data: {
  insuredId: string;
  scheduleId: number;
  countryISO: string;
}) => {
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
