async function handleCancellation(
  event,
  entityName,
  idFieldName,
  apiPath,
  method
) {
  event.preventDefault();
  const form = event.target;
  const entityId = form[idFieldName].value;

  try {
    const response = await fetch(`${apiPath}/${encodeURIComponent(entityId)}`, {
      method,
    });

    if (response.status === 204) {
      alert(`${entityName} cancelled successfully.`);
      form.reset();
    } else {
      alert(`Cancellation failed: ${await response.text()}`);
    }
  } catch (err) {
    console.error(err);
    alert("An unexpected error occurred. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("cancelBookingForm");
  const scheduleForm = document.getElementById("cancelScheduleForm");

  bookingForm.addEventListener("submit", (event) =>
    handleCancellation(event, "Booking", "booking_id", "/api/bookings", "PUT")
  );
  scheduleForm.addEventListener("submit", (event) =>
    handleCancellation(
      event,
      "Schedule",
      "schedule_id",
      "/api/schedules",
      "DELETE"
    )
  );
});
