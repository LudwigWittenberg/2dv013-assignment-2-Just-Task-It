import { sendRabbitMessage } from "../config/rabbitMq.js";

function rabbitEvent(eventType, data, username) {
	const message = {
		event_type: eventType,
		task_id: data.id,
		timestamp: new Date().toISOString(),
		standard_value: Math.random(),
		username
	};

	sendRabbitMessage(message);
}

export { rabbitEvent };
