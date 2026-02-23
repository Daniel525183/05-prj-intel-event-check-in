//Get all need DOM elements
const form = document.getElementById("checkInForm");
const attendeeCount = document.getElementById("attendeeCount");
const attendeeProgress = document.getElementById("progressBar");
const attendeeName = document.getElementById("attendeeName");
const attendeeTeam = document.getElementById("teamSelect");
const checkInGreeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebration");

//Track attendence
let count = 0;
const maxCount = 50;
const storageKey = "intelCheckInData";

function updateProgress() {
  const percentage = Math.round((count / maxCount) * 100) + "%";
  attendeeProgress.style.width = percentage;
  return percentage;
}

function saveCounts() {
  const data = {
    count: count,
    teamCounts: {
      water: parseInt(document.getElementById("waterCount").textContent),
      zero: parseInt(document.getElementById("zeroCount").textContent),
      power: parseInt(document.getElementById("powerCount").textContent),
    },
  };

  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadCounts() {
  const saved = localStorage.getItem(storageKey);
  let data = null;

  if (saved) {
    data = JSON.parse(saved);
  }

  if (data && typeof data.count === "number") {
    count = data.count;
  }

  attendeeCount.textContent = count;

  if (data && data.teamCounts) {
    if (typeof data.teamCounts.water === "number") {
      document.getElementById("waterCount").textContent = data.teamCounts.water;
    }
    if (typeof data.teamCounts.zero === "number") {
      document.getElementById("zeroCount").textContent = data.teamCounts.zero;
    }
    if (typeof data.teamCounts.power === "number") {
      document.getElementById("powerCount").textContent = data.teamCounts.power;
    }
  }

  updateProgress();
}

loadCounts();

//Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); //Prevent form from submitting normally

  const name = attendeeName.value;
  const team = attendeeTeam.value;
  const teamName = attendeeTeam.selectedOptions[0].text; //Get the text of the selected option
  console.log(name, team, teamName);

  //If the max has not been reached, allows the counts of each time, total count, and
  //the progress bar to be updated.
  if (count < maxCount) {
    //Increment count
    count++;
    console.log("Total check-ins: ", count);

    //Update progress bar
    const percentage = updateProgress();
    console.log(`Progress: ${percentage}`);

    //Update team counter
    const teamCounter = document.getElementById(`${team}Count`);
    console.log(teamCounter);
    teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

    //Update total counter
    attendeeCount.textContent = parseInt(attendeeCount.textContent) + 1;

    //Show welcome message
    const message = `🎉 Welcome, ${name} from ${teamName}!`;
    checkInGreeting.style.display = "block";
    checkInGreeting.textContent = message;

    console.log(checkInGreeting.textContent);

    saveCounts();
  }

  if (count == maxCount) {
    //Get the counts from each team
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent,
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent,
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent,
    );

    //Declare variables to keep track of which team had the most people
    let teamMaxCount = "";
    let maxCard;

    if (waterCount > zeroCount && waterCount > powerCount) {
      teamMaxCount = "🌊 Team Water Wise";
      maxCard = document.getElementById("water-card");
    } else if (zeroCount > waterCount && zeroCount > powerCount) {
      teamMaxCount = "🌿 Team Net Zero";
      maxCard = document.getElementById("zero-card");
    } else if (powerCount > waterCount && powerCount > zeroCount) {
      teamMaxCount = "⚡ Team Renewables";
      maxCard = document.getElementById("power-card");
    } else {
      alert("Error");
    }
    //Highlight the team which had the most people and congratulate them
    maxCard.style.border = "8px solid gold";

    let cMessage =
      "Congratulations to " + teamMaxCount + " on having the most people!";
    celebrationMessage.style.display = "block";
    celebrationMessage.textContent = cMessage;
  }

  form.reset(); //Reset form fields
});