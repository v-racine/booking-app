async function handleCancelBooking(event) {
  event.preventDefault();
  let form = event.target;
  let bookingId = form.booking_id.value;

  try {
    let response = await fetch(
      `/api/bookings/${encodeURIComponent(bookingId)}`,
      {
        method: "PUT",
      }
    );

    if (response.status === 204) {
      alert("Booking deleted.");
      form.reset();
    } else {
      alert(`Deleting failed: ${await response.text()}`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleCancelSchedule(event) {
  event.preventDefault();
  let form = event.target;
  let scheduleId = form.schedule_id.value;

  try {
    let response = await fetch(
      `/api/schedules/${encodeURIComponent(scheduleId)}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      alert("Schedule deleted.");
      form.reset();
    } else {
      alert(`Deleting failed: ${await response.text()}`);
    }
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let bookingForm = document.getElementById("cancelBookingForm");
  let scheduleForm = document.getElementById("cancelScheduleForm");

  bookingForm.addEventListener("submit", handleCancelBooking);
  scheduleForm.addEventListener("submit", handleCancelSchedule);
});
