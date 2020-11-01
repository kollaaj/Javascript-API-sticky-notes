/* ----- FUNCTIONS ----- */
const hidePages = () => {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hidden");
  });
};

const showPage = (page) => {
  hidePages();
  document.querySelector(page).classList.remove("hidden");
};

const showForbiddenPage = () => {
  showPage("#forbidden-page");

  let isSignedIn = localStorage.getItem("isSignedIn");
  if (isSignedIn === "true") {
    document.querySelector("#already-signed-in-message").classList.remove("hidden");
    document.querySelector("#not-signed-in-message").classList.add("hidden");
  } else {
    document.querySelector("#already-signed-in-message").classList.add("hidden");
    document.querySelector("#not-signed-in-message").classList.remove("hidden");
  }
};

const showSignInPage = () => {
  let isSignedIn = localStorage.getItem("isSignedIn");
  if (isSignedIn === "true") {
    showForbiddenPage();
  } else {
    showPage("#sign-in-page");
    document.querySelector("#username").focus();
  }

  window.history.pushState({}, "", "/#/sign-in");
};

const showNotesPage = () => {
  let isSignedIn = localStorage.getItem("isSignedIn");
  if (isSignedIn === "true") {
    showPage("#notes-page");

    let notes = localStorage.getItem("notes");
    if (notes) {
      notes = JSON.parse(notes);
      notes.forEach((note) => {
        addNote(note);
      });
    }
  } else {
    showForbiddenPage();
  }

  window.history.pushState({}, "", "/#/notes");
};

const addNote = (text) => {
  const template = document.querySelector("#note-container-template").cloneNode(true);
  template.removeAttribute("id");
  template.querySelector("p").innerText = text;
  template.querySelector(".delete-note-button").addEventListener("click", deleteNote);
  template.classList.add("user-note");
  document.querySelector("#note-board").insertBefore(template, document.querySelector(".note-container:nth-child(2)")); // don't fully understand
};

const closeAddNoteContainer = () => {
  document.querySelector("#note-text").value = "";
  document.querySelector("#add-note-container").classList.add("hidden");
};

const deleteNote = (e) => {
  let notes = localStorage.getItem("notes");
  if (notes) {
    notes = JSON.parse(notes);
    const text = e.target.closest(".note-container").querySelector(".note-content p").innerText;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i] === text) {
        notes.splice(i, 1);
        break;
      }
    }
    notes = JSON.stringify(notes);
    localStorage.setItem("notes", notes);
  }

  document.querySelector("#note-board").removeChild(e.target.closest(".note-container"));
};

/* ----- EVENTS ----- */
document.querySelector("#sign-in-page form").addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameElement = document.querySelector("#username");
  const passwordElement = document.querySelector("#password");

  const username = usernameElement.value;
  const password = passwordElement.value;

  if (username !== "monkey" || password !== "banana") {
    alert("invalid username or password");
    usernameElement.focus();
    return;
  }

  usernameElement.value = "";
  passwordElement.value = "";

  localStorage.setItem("isSignedIn", "true");

  showNotesPage();
});

document.querySelector("#sign-out-link").addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.setItem("isSignedIn", "false");

  document.querySelectorAll(".user-note").forEach((note) => {
    note.parentNode.removeChild(note);
  });

  showSignInPage();
});

document.querySelector("#add-note-button").addEventListener("click", () => {
  document.querySelector("#add-note-container").classList.remove("hidden");
  document.querySelector("#note-text").focus();
});

document.querySelector("#cancel-note-button").addEventListener("click", closeAddNoteContainer);

document.querySelector("#save-note-button").addEventListener("click", () => {
  const text = document.querySelector("#note-text").value;
  closeAddNoteContainer();

  let notes = localStorage.getItem("notes");
  if (!notes) {
    notes = [];
  } else {
    notes = JSON.parse(notes);
  }
  notes.push(text);
  notes = JSON.stringify(notes);
  localStorage.setItem("notes", notes);

  addNote(text);
});

document.querySelector("#not-signed-in-message a").addEventListener("click", (e) => {
  e.preventDefault();
  showSignInPage();
});

/* ----- ON PAGE LOAD ----- */
(() => {
  const url = window.location.href;
  const start = url.indexOf("#");

  if (start === -1) {
    let isSignedIn = localStorage.getItem("isSignedIn");
    if (isSignedIn === "true") {
      showNotesPage();
    } else {
      showSignInPage();
    }
    return;
  }

  const path = url.substring(start + 1);
  if (path === "/notes") {
    showNotesPage();
  } else if (path === "/sign-in") {
    showSignInPage();
  }
})();
