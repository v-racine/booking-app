const errDiv = document.querySelector("#error-message");
const templates = {
  scheduleOptions(schedules) {
    return schedules
      .map(
        ({ id, staff_name, date, time }) =>
          `<option value="${id}">${staff_name} | ${date} | ${time}</option>`
      )
      .join("");
  },
};

//fetchers
async function fetchSchedules() {
  let response = await fetch("/api/schedules");
  let schedules = await response.json();
  let schedulesWithNoStudentEmails = schedules.filter((schedule) => {
    return !schedule.student_email;
  });
  return schedulesWithNoStudentEmails;
}

async function fetchStaff() {
  let response = await fetch("/api/staff_members");
  if (!response.ok) {
    throw new Error(
      `Failed to fetch staff members. Status: ${response.status}`
    );
  }
  return response.json();
}

function mapStaffNamesToSchedules(schedules, staff) {
  let idMap = Object.fromEntries(staff.map(({ id, name }) => [id, name]));

  schedules.forEach((schedule) => {
    schedule.staff_name = idMap[schedule.staff_id];
  });
}

async function populateScheduleOptions() {
  let schedulesPromise = fetchSchedules();
  let staffMembersPromise = fetchStaff();

  try {
    let [schedules, staffMembers] = await Promise.all([
      schedulesPromise,
      staffMembersPromise,
    ]);
    mapStaffNamesToSchedules(schedules, staffMembers);
  } catch (err) {
    console.error(err);
    errDiv.textMessage = "Sorry, something went wrong. Please try again later.";
  }

  const scheduleList = document.querySelector("#id");
  scheduleList.innerHTML = templates.scheduleOptions(schedules);
}

function displayNewStudentForm(data) {
  let form = document.getElementById("newStudentForm");
  form.querySelector("#email").value = data.email;
  form.querySelector("#booking_sequence").value = data.bookingSequence;

  form.style.display = "block";
}

function formDataToJson(formData) {
  return Object.fromEntries(formData.entries());
}

async function handleNewBooking(e) {
  e.preventDefault();
  let form = e.target;
  let json = JSON.stringify(formDataToJson(new FormData(form)));

  let response = await fetch(form.action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });

  switch (response.status) {
    case 204:
      alert("Booked");
      form.reset();
      break;
    case 404: {
      let body = await response.text();
      alert(body);
      let bookingSequence = body.split(":")[1].trim();
      displayNewStudentForm({
        email: form.student_email.value,
        bookingSequence,
      });
    }
  }
}

async function handleNewStudent(e) {
  e.preventDefault();
  let newStudentForm = e.target;
  let newBookingForm = document.getElementById("newBookingForm");

  let json = JSON.stringify(formDataToJson(new FormData(newStudentForm)));

  let response = await fetch(newStudentForm.action, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json,
  });

  let body = await response.text();
  alert(body);

  if (response.status === 201) {
    newBookingForm.student_email.value = newStudentForm.email.value;
    newStudentForm.reset();
    newBookingForm.dispatchEvent(new Event("submit", { cancelable: true }));
    newStudentForm.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateScheduleOptions();

  const newBookingForm = document.getElementById("newBookingForm");
  const newStudentForm = document.getElementById("newStudentForm");

  newBookingForm.addEventListener("submit", handleNewBooking);
  newStudentForm.addEventListener("submit", handleNewStudent);
});
