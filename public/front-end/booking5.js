//html templates
const templates = {
  bookingListItem(content) {
    return `<li class="booking">${content}</li>`;
  },

  dateListItem(date) {
    return `<li class="date">${date}</li>`;
  },

  bookingsList(bookings) {
    let listItems = bookings
      .map(({ staffName, studentEmail, time }) => {
        const li = document.createElement("li");
        li.className = "booking";
        li.textContent = `${staffName} | ${studentEmail} | ${time}`;
        return li.outerHTML;
      })
      .join("");

    return `<ul>${listItems}</ul>`;
  },
};

//fetchers
async function fetchDatesWithBookings() {
  let response = await fetch("/api/bookings");
  return response.json();
}

async function fetchBookingsForDate(date) {
  let response = await fetch(`/api/bookings/${date}`);
  return response.json();
}

//display functions
function renderBookingsForDate(node, bookings) {
  const bookingsObject = bookings.map((booking) => ({
    staffName: booking[0],
    studentEmail: booking[1],
    time: booking[2],
  }));

  node.innerHTML += templates.bookingsList(bookingsObject);
}

function renderDatesWithBookings(dates) {
  const bookingList = document.querySelector("#bookings-list");

  const dateItemsHTML = dates
    .map((date) => {
      const li = document.createElement("li");
      li.className = "date";
      li.textContent = date;
      return li.outerHTML;
    })
    .join("");
  bookingList.innerHTML = dateItemsHTML;
}

//handler
async function handleListClick(event) {
  if (event.target.className !== "date" || event.target.childElementCount !== 0)
    return;

  try {
    let bookings = await fetchBookingsForDate(event.target.textContent);
    renderBookingsForDate(event.target, bookings);
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let bookingsList = document.getElementById("bookings-list");

  try {
    let datesWithBookings = await fetchDatesWithBookings();
    renderDatesWithBookings(datesWithBookings);
  } catch (err) {
    console.error(err);
  }

  bookingsList.addEventListener("click", handleListClick);
});
