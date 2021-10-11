const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

// let's store all current messages here
let allChat = [];

// the interval to poll at in milliseconds
const INTERVAL = 3000;

// a submit listener on the form in the HTML
chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = {
    user,
    text,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }

  await fetch("/poll", options); 
}

async function getNewMsgs() {
  let json;
  try {
    const res = await fetch("/poll");
    json = await res.json();

  } catch(e) {
    // backoff code
    console.error("polling error", e);
  }
  allChat = json.msg;
  render();
  setTimeout(getNewMsgs, INTERVAL);
}

function render() {
  const html = allChat.map(({ user, text, time, id }) => template(user, text, time, id));

  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

//make the fist request
getNewMsgs();
