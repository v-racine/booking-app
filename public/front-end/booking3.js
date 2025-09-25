document.addEventListener("DOMContentLoaded", () => {
  let scheduleContainer;
  let btnAdd;
  let form;
  let staffs;
  let scheduleCount = 0;

  async function fetchStaffMembers() {
    try {
      const response = await fetch("/api/staff_members");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch staff members. Status: ${response.status}`
        );
      }
      return response.json();
    } catch (err) {
      console.error(err);
    }
  }

  // Template for creating a schedule
  function scheduleTemplate() {
    const staffOptions = staffs
      .map(({ id, name }) => `<option value="${id}">${name}</option>`)
      .join("");

    return `
    <fieldset id="schedule_${scheduleCount}">
      <legend>Schedule ${scheduleCount}</legend>

      <div>
        <label for="staff_${scheduleCount}">Staff Name:</label>
        <select id="staff_${scheduleCount}" name="staff_${scheduleCount}">${staffOptions}</select>
      </div>

      <div>
        <label for="date_${scheduleCount}">Date:</label>
        <input type="text" id="date_${scheduleCount}" name="date_${scheduleCount}" placeholder="mm-dd-yy">
      </div>

      <div>
        <label for="time_${scheduleCount}">Time:</label>
        <input type="text" id="time_${scheduleCount}" name="time_${scheduleCount}" placeholder="hh:mm">
      </div>

    </fieldset>`;
  }

  // Add new schedule on button click
  function addSchedule() {
    scheduleCount += 1;
    const scheduleHTML = scheduleTemplate();
    scheduleContainer.insertAdjacentHTML("beforeend", scheduleHTML);
  }

  // Convert form inputs to JSON
  function formInputsToJson() {
    const schedules = Array.from(
      document.querySelectorAll("#schedules fieldset")
    ).map((fieldset) => {
      return {
        staff_id: fieldset.querySelector('select[name^="staff_"]').value,
        date: fieldset.querySelector('input[name^="date_"]').value,
        time: fieldset.querySelector('input[name^="time_"]').value,
      };
    });
    return { schedules };
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const json = JSON.stringify(formInputsToJson(event.target));

    try {
      const response = await fetch(event.target.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });

      if (response.status === 201) form.reset();
      alert(await response.text());
    } catch (error) {
      console.error("Error submitting schedules:", error);
      alert(
        "An error occurred while submitting schedules. Please check your connection and try again."
      );
    }
  }

  async function main() {
    scheduleContainer = document.getElementById("schedules");
    btnAdd = document.getElementById("btnAdd");
    form = document.querySelector("form");

    staffs = await fetchStaffMembers();

    addSchedule();

    btnAdd.addEventListener("click", (event) => {
      event.preventDefault();
      addSchedule();
    });

    form.addEventListener("submit", handleSubmit);
  }

  main();
});
