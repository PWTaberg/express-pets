async function start() {
  try {
    const weatherPromise = await fetch(
      "https://api.weather.gov/gridpoints/MFL/110,50/forecast"
    );
    const weatherData = await weatherPromise.json();

    const ourTemperature = weatherData.properties.periods[0].temperature;
    document.querySelector("#temperature-output").textContent = ourTemperature;
  } catch (err) {
    console.log("something went wrong accessing weather API");
    document.querySelector("#temperature-output").textContent = "--";
  }
}

start();

// pet filter button code
const allButtons = document.querySelectorAll(".pet-filter button");

allButtons.forEach(el => {
  el.addEventListener("click", handleButtonClick);
});

function handleButtonClick(e) {
  // remove active class from any and all buttons
  allButtons.forEach(el => el.classList.remove("active"));

  // add active class to the specific button that just got clicked
  e.target.classList.add("active");

  // actually filter the pets down below, compare filter with species of pet-card
  const currentFilter = e.target.dataset.filter;
  document.querySelectorAll(".pet-card").forEach(el => {
    if (currentFilter == el.dataset.species || currentFilter == "all") {
      el.style.display = "grid";
    } else {
      el.style.display = "none";
    }
  });
}

// Handle Overlay

document.querySelector(".form-overlay").style.display = "";

function openOverlay(el) {
  document.querySelector(".form-content").dataset.id = el.dataset.id;

  document.querySelector(".form-photo p strong").textContent =
    el.closest(".pet-card").querySelector(".pet-name").textContent.trim() + ".";

  document.querySelector(".form-photo img").src = el
    .closest(".pet-card")
    .querySelector(".pet-card-photo img").src;

  document
    .querySelector(".form-overlay")
    .classList.add("form-overlay--is-visible");

  // Prevent scrolling under overlay
  document.querySelector(":root").style.overflowY = "hidden";
}

document
  .querySelector(".close-form-overlay")
  .addEventListener("click", closeOverlay);

function closeOverlay() {
  document
    .querySelector(".form-overlay")
    .classList.remove("form-overlay--is-visible");

  // allow scrolling again
  document.querySelector(":root").style.overflowY = "";
}

document
  .querySelector(".form-content")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const userValues = {
      petId: e.target.dataset.id,
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      secret: document.querySelector("#secret").value,
      comment: document.querySelector("#comment").value
    };

    //console.log(userValues);

    // Adding wait for response
    // Also adding spinner, static failure message

    // Show thank-you
    // Make success/failure messages invisible
    // Start spinner
    // Fetch
    // wait
    // Hide spinner
    // If OK show success message
    // If not OK show failure message

    // Turn off success/failure message
    document
      .querySelector(".thank-you__success")
      .classList.add("thank-you--invisible");
    document
      .querySelector(".thank-you__failure")
      .classList.add("thank-you--invisible");

    // Show thank-you overlay
    // Start spinner
    document.querySelector(".thank-you").classList.add("thank-you--visible");
    // turn on spinner
    document
      .querySelector(".thank-you__spinner")
      .classList.remove("thank-you--invisible");

    let successFulResponse = false;

    try {
      const submitPromise = await fetch("/submit-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userValues)
      });

      const submitData = await submitPromise.json();
      //console.log(submitData);

      if (submitData.message !== "Success") {
        successFulResponse = false;
      } else {
        successFulResponse = true;
      }
    } catch (err) {
      console.log("Something went wrong, sending email / updating petContacts");
      successFulResponse = false;
    }

    // turn off spinner
    document
      .querySelector(".thank-you__spinner")
      .classList.add("thank-you--invisible");

    // Turn on success/failure message
    if (successFulResponse) {
      // Make success message visible
      document
        .querySelector(".thank-you__success")
        .classList.remove("thank-you--invisible");
    } else {
      console.log("Show failure");
      // Make failure message visible
      document
        .querySelector(".thank-you__failure")
        .classList.remove("thank-you--invisible");
    }

    // Set timer for removing overlay
    setTimeout(closeOverlay, 2500);

    // Set timer to remove visible class, also reset old values to ""
    setTimeout(() => {
      document
        .querySelector(".thank-you")
        .classList.remove("thank-you--visible");

      document.querySelector("#name").value = "";
      document.querySelector("#email").value = "";
      document.querySelector("#secret").value = "";
      document.querySelector("#comment").value = "";
    }, 2900);
  });
