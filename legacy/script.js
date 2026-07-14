const textElement = document.getElementById("typing-text");
const mainButton = document.getElementById("reveal-button");
const container = document.querySelector(".container");

const firstMessage = "Hello Sarah Rose";
const messages = [
  "Happy Birthdayy!!! 🎂",
  "Alles Gute zum Geburtstag! 🥳",
  "Pirannaal Aashamsakal!!  🌸",
  "Iniya Pirantha Naal Nalvaalthukal! 🎊",
];

let fakeClickCount = 0;
const maxFakeClicks = 3;

function typeMessage(message, callback) {
  textElement.textContent = "";
  let charIndex = 0;
  textElement.style.borderRight = "3px solid black";

  function typeChar() {
    if (charIndex < message.length) {
      textElement.textContent += message.charAt(charIndex);
      charIndex++;
      setTimeout(typeChar, 100);
    } else {
      textElement.style.borderRight = "none";
      if (callback) callback();
    }
  }

  typeChar();
}

typeMessage(firstMessage, () => {
  mainButton.style.display = "inline-block";
});

const promptMessages = [
  "Okay sorryyy 😅, now a real button will come!",
  "Hehe tricked youu!! 😜",
  "Lol just kidding 😂"
];

function spawnFakeButton() {
  const fakeBtn = document.createElement("button");
  fakeBtn.className = "fake-button";
  fakeBtn.textContent = "Inga Press Seiyavum";

  const x = Math.random() * (window.innerWidth - 150);
  const y = Math.random() * (window.innerHeight - 80);
  fakeBtn.style.left = `${x}px`;
  fakeBtn.style.top = `${y}px`;

  container.appendChild(fakeBtn);

  fakeBtn.addEventListener("click", () => {
    const message = promptMessages[fakeClickCount];
    alert(message);

    fakeBtn.remove();
    fakeClickCount++;

    if (fakeClickCount >= maxFakeClicks) {
      startConfetti();
      startRealSequence();
    } else {
      spawnFakeButton();
    }
  });
}

mainButton.addEventListener("click", () => {
  mainButton.style.display = "none";
  spawnFakeButton();
});

function startRealSequence() {
  let i = 0;

  function typeNext() {
    if (i < messages.length) {
      typeMessage(messages[i], () => {
        i++;
        setTimeout(typeNext, 2000);
      });
    }
  }

  typeNext();
}
