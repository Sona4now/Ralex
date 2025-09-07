// Load data from localStorage or fallback to data.json
let data = JSON.parse(localStorage.getItem("clothesData")) || null;

async function loadData() {
  if (!data) {
    const res = await fetch("data.json");
    data = await res.json();
    saveData();
  }
}
function saveData() {
  localStorage.setItem("clothesData", JSON.stringify(data));
}

// Login/Register
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!data.users[username]) {
      if (Object.keys(data.users).length >= 3) {
        alert("Only 3 users allowed.");
        return;
      }
      data.users[username] = password;
      saveData();
    }

    if (data.users[username] === password) {
      localStorage.setItem("currentUser", username);
      window.location.href = "home.html";
    } else {
      alert("Wrong password.");
    }
  };
}

// Home page
const addItemForm = document.getElementById("addItemForm");
if (addItemForm) {
  document.getElementById("welcome").innerText = 
    "Welcome " + localStorage.getItem("currentUser") + " 👋";

  // Populate sections
  const sectionSelect = document.getElementById("sectionSelect");
  for (let s in data.sections) {
    let opt = document.createElement("option");
    opt.text = s;
    sectionSelect.add(opt);
  }

  // Add item
  addItemForm.onsubmit = (e) => {
    e.preventDefault();
    const form = new FormData(addItemForm);

    const newItem = {
      name: form.get("name"),
      section: form.get("section"),
      subsection: form.get("subsection"),
      house: form.get("house"),
      washed: form.get("washed") ? true : false,
      ironed: form.get("ironed") ? true : false,
      images: form.get("images").split(",").map(s => s.trim())
    };

    data.items.push(newItem);
    saveData();
    renderItems();
    addItemForm.reset();
  };

  function renderItems() {
    const container = document.getElementById("items");
    container.innerHTML = "";
    data.items.forEach(item => {
      let div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h4>${item.name} (${item.section} - ${item.subsection})</h4>
        <p>House: ${item.house} | ${item.washed ? "Washed" : "Not washed"} | ${item.ironed ? "Ironed" : "Not ironed"}</p>
        ${item.images.map(img => `<img src="${img}">`).join("")}
      `;
      container.appendChild(div);
    });
  }

  renderItems();
}

// Initial load
loadData();
