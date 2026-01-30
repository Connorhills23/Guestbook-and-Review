import "./style.css";

const display = document.getElementById("guestbookEntries");
const form = document.getElementById("form");
const darkModeToggle = document.getElementById("darkModeToggle");

// Fetch messages
async function fetchData() {
  const response = await fetch("https://guestbook-and-review.onrender.com/");
  return response.json();
}

// Format timestamps
function timeAgo(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const seconds = Math.floor((now - created) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// Display messages
async function displayMessages() {
  const messages = await fetchData();
  display.innerHTML = "";

  messages.forEach((message) => {
    const section = document.createElement("section");
    section.classList.add("entry");

    const userName = document.createElement("p");
    userName.classList.add("entry-name");
    userName.textContent = message.msg_name;

    const timestamp = document.createElement("span");
    timestamp.classList.add("entry-timestamp");
    timestamp.textContent = timeAgo(message.created_at);

    const messageContent = document.createElement("p");
    messageContent.classList.add("entry-content");
    messageContent.textContent = message.content;

    section.append(userName, timestamp, messageContent);
    display.appendChild(section);
  });
}

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const userInput = Object.fromEntries(formData);

  await fetch("https://guestbook-and-review.onrender.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInput),
  });

  form.reset();
  displayMessages();
}

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// Event listeners
form.addEventListener("submit", handleSubmit);

// Initial load
displayMessages();
