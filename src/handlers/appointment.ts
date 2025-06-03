import { APIGatewayProxyHandler } from "aws-lambda";
import { saveAppointment } from "../utils/dynamo";
import { publishAppointmentEvent } from "../utils/sns";
import { SQSHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.APPOINTMENTS_TABLE!;

export const register: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body!);
    const { insuredId, scheduleId, countryISO } = body;

    if (!insuredId || !scheduleId || !["PE", "CL"].includes(countryISO)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Datos inválidos" }),
      };
    }

    const result = await saveAppointment({ insuredId, scheduleId, countryISO });

    await publishAppointmentEvent(result);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Appointment saved and published", data: result }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno", details: err }),
    };
  }
};

export const updateStatus: SQSHandler = async (event) => {
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

export const getByInsuredId: APIGatewayProxyHandler = async (event) => {
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