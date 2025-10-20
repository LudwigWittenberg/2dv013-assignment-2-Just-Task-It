import { sendRabbitMessage } from "../config/rabbitMq.js";

function rabbitEvent(eventType, data) {
	const message = {
		event_type: eventType,
		task_id: data.id,
    is_completed: data.done
	};

	sendRabbitMessage(message);
}

export { rabbitEvent };
