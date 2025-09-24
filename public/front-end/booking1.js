class TimeoutError extends Error {
  constructor() {
    super("Operation timed out");
  }
}

// error handling
const withTimeout = (promise, delay) => {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(), delay);
    });
  });

  return Promise.race([promise, timeoutPromise]);
};

// business logic
function tallySchedules(schedules) {
  let tally = {};

  schedules.forEach(({ staff_id }) => {
    let key = `staff ${staff_id}`;
    tally[key] = (tally[key] || 0) + 1;
  });

  return tally;
}

//GET fetch request for schedules
async function retrieveSchedules() {
  try {
    let response = await withTimeout(
      fetch("http://localhost:3000/api/schedules"),
      3000
    );
    let schedules = await response.json();

    if (schedules.length > 0) {
      let tally = tallySchedules(schedules);
      alert(
        Object.entries(tally)
          .map(([id, count]) => {
            return `${id}: ${count}`;
          })
          .join(`\n`)
      );
    } else {
      alert("There are currently no schedules available for booking.");
    }
  } catch (err) {
    if (err instanceof TimeoutError) {
      alert("It is taking longer than usual, please try again later.");
    } else {
      console.error(err.message);
    }
  } finally {
    alert("The request has completed.");
  }
}

retrieveSchedules();
