const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const map = {};
  formData.forEach((value, key) => {
    map[key] = value;
  });

  const dataForSubmission = JSON.stringify(map);

  try {
    let submission = await fetch(form.action, {
      method: form.method,
      headers: { "Content-Type": "application/json" },
      body: dataForSubmission,
    });

    if (submission.status === 201) {
      let data = await submission.json();
      alert(`Successfully created staff with id: ${data.id}`);
      form.reset();
    } else if (submission.status >= 400 || submission.status < 600) {
      alert(await submission.text());
    }
  } catch (err) {
    alert("Sorry, something went wrong. Please try again later.");
    console.log(err);
  }
});
