document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu ul li a');

  hamburgerMenu.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.style.display = 'none';
    });
  });

  fetchArtists();
  fetchStages();
  fetchSchedule();
});

const SPACE_ID = localStorage.getItem('space_id');
const ACCESS_TOKEN = localStorage.getItem('access_token');
const API_URL = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries`;

async function fetchData(contentType) {
  const url = `${API_URL}?access_token=${ACCESS_TOKEN}&content_type=${contentType}&include=2`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Could not fetch data from API:", error);
    return null;
  }
}

async function fetchArtists() {
  const data = await fetchData('artist');
  const artistContainer = document.querySelector(".artist-list");
  artistContainer.innerHTML = "";

  if (data && data.items.length > 0) {
    displayArtists(data);
  } else {
    artistContainer.innerHTML = "<p>Could not load artists or no artists available. Please try again later.</p>";
  }
}

function displayArtists(data) {
  const artistContainer = document.querySelector(".artist-list");
  artistContainer.innerHTML = "";

  const artists = data.items.map(item => {
    const artist = item.fields;
    const genre = data.includes.Entry.find(entry => entry.sys.id === artist.genre.sys.id)?.fields.name || "No genre available";
    const stage = data.includes.Entry.find(entry => entry.sys.id === artist.stage.sys.id)?.fields.name || "No stage available";
    const day = data.includes.Entry.find(entry => entry.sys.id === artist.day.sys.id)?.fields.name || "No day available";
    return { ...artist, genre, stage, day };
  });

  const distributedArtists = distributeDays(artists);

  distributedArtists.forEach(artist => {
    const artistHTML = `
      <div class="artist-card">
        <h3>${artist.name}</h3>
        <p>Genre: ${artist.genre}</p>
        <p>Stage: ${artist.stage}</p>
        <p>Day: ${artist.day}</p>
        <p>${artist.description}</p>
      </div>
    `;
    artistContainer.innerHTML += artistHTML;
  });
}

async function fetchStages() {
  const data = await fetchData('stage');
  const stageContainer = document.querySelector(".stage-list");
  stageContainer.innerHTML = "";

  if (data && data.items.length > 0) {
    displayStages(data);
  } else {
    stageContainer.innerHTML = "<p>Could not load stages or no stages available. Please try again later.</p>";
  }
}

function displayStages(data) {
  const stageContainer = document.querySelector(".stage-list");
  stageContainer.innerHTML = "";

  const stages = data.items.map(item => item.fields);

  const sortedStages = stages.sort((a, b) => {
    const order = ["Echo Stage", "Sunset Arena", "Skyline Stage", "Bassline Tent"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  sortedStages.forEach(stage => {
    const stageHTML = `
      <div class="stage-card">
        <h3>${stage.name}</h3>
        <p>${stage.description}</p>
        <p>Area: ${stage.area}</p>
      </div>
    `;
    stageContainer.innerHTML += stageHTML;
  });
}

async function fetchSchedule() {
  const data = await fetchData('artist');
  const scheduleBodyFriday = document.getElementById('schedule-body-friday');
  const scheduleBodySaturday = document.getElementById('schedule-body-saturday');
  scheduleBodyFriday.innerHTML = "";
  scheduleBodySaturday.innerHTML = "";

  if (data && data.items.length > 0) {
    displaySchedule(data);
  } else {
    scheduleBodyFriday.innerHTML = "<tr><td colspan='5'>Could not load schedule or no schedule available. Please try again later.</td></tr>";
    scheduleBodySaturday.innerHTML = "<tr><td colspan='4'>Could not load schedule or no schedule available. Please try again later.</td></tr>";
  }
}

function displaySchedule(data) {
  const scheduleBodyFriday = document.getElementById('schedule-body-friday');
  const scheduleBodySaturday = document.getElementById('schedule-body-saturday');
  scheduleBodyFriday.innerHTML = "";
  scheduleBodySaturday.innerHTML = "";

  const fridaySchedule = [
    { time: "12:00 PM", echo: "", sunset: "", skyline: "", bassline: "" },
    { time: "1:00 PM", echo: "", sunset: "", skyline: "", bassline: "The Lumineers" },
    { time: "2:00 PM", echo: "", sunset: "", skyline: "", bassline: "" },
    { time: "3:00 PM", echo: "", sunset: "Travis Scott", skyline: "", bassline: "" },
    { time: "4:00 PM", echo: "", sunset: "", skyline: "", bassline: "" },
    { time: "5:00 PM", echo: "", sunset: "", skyline: "", bassline: "Snarky Puppies" },
    { time: "6:00 PM", echo: "", sunset: "", skyline: "", bassline: "" },
    { time: "7:00 PM", echo: "Imagine Dragons", sunset: "", skyline: "", bassline: "" },
    { time: "8:00 PM", echo: "", sunset: "", skyline: "", bassline: "" },
    { time: "9:00 PM", echo: "", sunset: "", skyline: "Ariana Grande", bassline: "" },
    { time: "10:00 PM", echo: "", sunset: "", skyline: "", bassline: "" }
  ];

  fridaySchedule.forEach(slot => {
    const fridayRow = `
      <tr>
        <td>${slot.time}</td>
        <td class="${slot.echo ? 'stage-echo' : ''}">${slot.echo}</td>
        <td class="${slot.sunset ? 'stage-sunset' : ''}">${slot.sunset}</td>
        <td class="${slot.skyline ? 'stage-skyline' : ''}">${slot.skyline}</td>
        <td class="${slot.bassline ? 'stage-bassline' : ''}">${slot.bassline}</td>
      </tr>
    `;
    scheduleBodyFriday.innerHTML += fridayRow;
  });

  const saturdaySchedule = [
    { time: "12:00 PM", echo: "", sunset: "", skyline: "" },
    { time: "1:00 PM", echo: "", sunset: "", skyline: "Drake" },
    { time: "2:00 PM", echo: "", sunset: "", skyline: "" },
    { time: "3:00 PM", echo: "Slipknot", sunset: "", skyline: "" },
    { time: "4:00 PM", echo: "", sunset: "", skyline: "" },
    { time: "5:00 PM", echo: "", sunset: "", skyline: "Metallica" },
    { time: "6:00 PM", echo: "", sunset: "", skyline: "" },
    { time: "7:00 PM", echo: "The Weeknd", sunset: "", skyline: "" },
    { time: "8:00 PM", echo: "", sunset: "", skyline: "" },
    { time: "9:00 PM", echo: "", sunset: "Billie Eilish", skyline: "" },
    { time: "10:00 PM", echo: "", sunset: "", skyline: "" }
  ];

  saturdaySchedule.forEach(slot => {
    const saturdayRow = `
      <tr>
        <td>${slot.time}</td>
        <td class="${slot.echo ? 'stage-echo' : ''}">${slot.echo}</td>
        <td class="${slot.sunset ? 'stage-sunset' : ''}">${slot.sunset}</td>
        <td class="${slot.skyline ? 'stage-skyline' : ''}">${slot.skyline}</td>
      </tr>
    `;
    scheduleBodySaturday.innerHTML += saturdayRow;
  });
}

function getArtistAtTime(artists, time, stage) {
  const artist = artists.find(artist => artist.time === time && artist.stage === stage);
  return artist ? artist.name : "";
}

function distributeDays(artists) {
  const days = ["Friday", "Saturday"];
  const distribution = { "Friday": 0, "Saturday": 0 };
  const maxArtistsPerDay = 5;

  return artists.map((artist, index) => {
    const day = index < maxArtistsPerDay ? "Friday" : "Saturday";
    distribution[day]++;
    return { ...artist, day };
  });
}