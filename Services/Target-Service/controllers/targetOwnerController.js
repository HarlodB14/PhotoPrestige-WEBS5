export function createTarget() {
// controllers/targetOwnerController.js
    async function notifyClockService(targetId, endTime) {
        // Implement RabbitMQ or HTTP call to Clock Service
        await axios.post('http://clock-service:5002/timers', {
            targetId,
            triggerTime: endTime
        });
    }
}

export function deleteTarget() {

}