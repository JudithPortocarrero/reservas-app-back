import { SQSEvent, SQSHandler } from "aws-lambda";
import { getConnection } from "../utils/db";
import { sendAppointmentCompletedEvent } from "../utils/eventbridge";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const connection = await getConnection();

  for (const record of event.Records) {
    const body = JSON.parse(record.body);

    const { insuredId, scheduleId, countryISO, createdAt } = body;

    await connection.execute(
      `INSERT INTO appointments (insuredId, scheduleId, countryISO, createdAt) VALUES (?, ?, ?, ?)`,
      [insuredId, scheduleId, countryISO, createdAt]
    );

    await sendAppointmentCompletedEvent({ insuredId, scheduleId });

  }

  await connection.end();
};
