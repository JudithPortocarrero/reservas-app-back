"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_1 = require("../utils/db");
const eventbridge_1 = require("../utils/eventbridge");
const handler = async (event) => {
    const connection = await (0, db_1.getConnection)();
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const { insuredId, scheduleId, countryISO, createdAt } = body;
        await connection.execute(`INSERT INTO appointments (insuredId, scheduleId, countryISO, createdAt) VALUES (?, ?, ?, ?)`, [insuredId, scheduleId, countryISO, createdAt]);
        await (0, eventbridge_1.sendAppointmentCompletedEvent)({ insuredId, scheduleId });
    }
    await connection.end();
};
exports.handler = handler;
