
"use strict";

const messages = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("question");
const clearButton = document.getElementById("clearChat");
const sendButton = document.getElementById("sendButton");
const quickButtons = document.querySelectorAll(".quick-btn");

const welcomeMessage =
  "Assalam-o-Alaikum! Welcome to Bright Future Academy. Aap admission, classes, timing ya fee ke bare mein sawal pooch sakte hain.";

let replyTimer = null;
let isReplying = false;

function getAnswer(text) {
  const q = text.toLowerCase().trim();

  if (/fee|fees|فیس|monthly|tuition|charges/.test(q)) {
    return "Fee abhi confirm nahi hai. Barah-e-karam school office se maloom karein.";
  }

  if (/sunday|saturday|haft|holiday|chhutti|چھٹی/.test(q)) {
    return "Chhuttiyon aur weekend ke schedule ki maloomat available nahi. School office se confirm karein.";
  }

  if (/timing|time|waqt|kitne baje|khulta|band hota|schedule/.test(q)) {
    return "School ki timing subah 8 baje se dopahar 1 baje tak hai.";
  }

  if (/admission|dakhla|class|classes|grade|کلاس|داخلہ/.test(q)) {
    return "Bright Future Academy mein Class 1 se Class 10 tak admission hota hai.";
  }

  if (/contact|rabta|phone|number|office|رابطہ/.test(q)) {
    return "Mazeed maloomat ke liye school office se rabta karein. Phone number abhi available nahi hai.";
  }

  if (/\b(salam|assalam|hello|hi|hey)\b/.test(q)) {
    return "Wa-Alaikum-Assalam! Aap admission, classes, timing ya fee ke bare mein pooch sakte hain.";
  }

  return "Maazrat, is sawal ki maloomat mere paas nahi hai. Barah-e-karam school office se confirm karein.";
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function scrollToLatest() {
  messages.scrollTop = messages.scrollHeight;
}

function addMessage(text, type) {
  const row = document.createElement("div");
  row.className = "message-row " + (type === "user" ? "user-row" : "bot-row");

  if (type !== "user") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "🏫";
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message " + type;

  const content = document.createElement("div");
  content.className = "message-text";
  content.textContent = text;

  const time = document.createElement("time");
  time.className = "message-time";
  time.textContent = getCurrentTime();

  bubble.appendChild(content);
  bubble.appendChild(time);
  row.appendChild(bubble);
  messages.appendChild(row);

  scrollToLatest();
}

function setBusy(busy) {
  isReplying = busy;
  sendButton.disabled = busy;
  input.disabled = busy;
  quickButtons.forEach(button => {
    button.disabled = busy;
  });
}

function showTypingAnswer(question) {
  if (isReplying) return;

  setBusy(true);

  const row = document.createElement("div");
  row.className = "message-row bot-row";
  row.id = "typingMessage";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "🏫";

  const bubble = document.createElement("div");
  bubble.className = "message bot";

  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.setAttribute("role", "status");
  typing.setAttribute("aria-label", "Assistant is typing");

  for (let i = 0; i < 3; i++) {
    typing.appendChild(document.createElement("span"));
  }

  bubble.appendChild(typing);
  row.appendChild(avatar);
  row.appendChild(bubble);
  messages.appendChild(row);

  scrollToLatest();

  replyTimer = setTimeout(() => {
    row.remove();
    addMessage(getAnswer(question), "bot");
    setBusy(false);
    input.focus();
    replyTimer = null;
  }, 600);
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const text = input.value.trim();

  if (!text || isReplying) return;

  addMessage(text, "user");
  input.value = "";
  showTypingAnswer(text);
});

quickButtons.forEach(button => {
  button.addEventListener("click", function() {
    if (isReplying) return;

    const question = button.dataset.question;
    if (!question) return;

    addMessage(question, "user");
    showTypingAnswer(question);
  });
});

clearButton.addEventListener("click", function() {
  if (replyTimer !== null) {
    clearTimeout(replyTimer);
    replyTimer = null;
  }

  setBusy(false);
  messages.replaceChildren();
  addMessage(welcomeMessage, "bot");
  input.value = "";
  input.focus();
});
