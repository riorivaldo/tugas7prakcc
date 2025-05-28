 // Ganti sesuai backend-mu

// DOM Elements
const authContainer = document.getElementById("auth-container");
const registerContainer = document.getElementById("register-container");
const loginForm = document.getElementById("auth-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");
const diarySection = document.getElementById("diary-section");

const tanggalInput = document.getElementById("tanggal");
const isiInput = document.getElementById("isi");
const diaryList = document.getElementById("diary-list");
const diaryForm = diarySection.querySelector("form");

let editId = "";

// Token helper
function saveToken(token) {
  localStorage.setItem("token", token);
}
function getToken() {
  return localStorage.getItem("token");
}
function clearToken() {
  localStorage.removeItem("token");
}

// Axios instance with auth header
function authAxios() {
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

// Show/hide auth forms
document.getElementById("show-register").onclick = () => {
  authContainer.style.display = "none";
  registerContainer.style.display = "block";
};
document.getElementById("show-login").onclick = () => {
  authContainer.style.display = "block";
  registerContainer.style.display = "none";
};

// Login submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username-login").value.trim();
  const password = document.getElementById("password-login").value.trim();
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { username, password });
    saveToken(res.data.token);
    initAfterLogin();
  } catch (err) {
    alert(err.response?.data?.msg || "Login gagal");
  }
});

// Register submit
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username-register").value.trim();
  const password = document.getElementById("password-register").value.trim();
  try {
    await axios.post(`${BASE_URL}/auth/register`, { username, password });
    alert("Registrasi berhasil, silakan login.");
    registerContainer.style.display = "none";
    authContainer.style.display = "block";
  } catch (err) {
    alert(err.response?.data?.msg || "Registrasi gagal");
  }
});

// Logout
logoutBtn.onclick = () => {
  clearToken();
  diarySection.style.display = "none";
  logoutBtn.style.display = "none";
  authContainer.style.display = "block";
};

// Init after login
function initAfterLogin() {
  authContainer.style.display = "none";
  registerContainer.style.display = "none";
  diarySection.style.display = "block";
  logoutBtn.style.display = "inline-block";
  getDiary();
}

// Get diary list
async function getDiary() {
  try {
    const res = await authAxios().get("/note");
    diaryList.innerHTML = "";
    res.data.forEach((diary) => {
      const div = document.createElement("div");
      div.classList.add("diary-entry");
      div.innerHTML = `
        <h3>${diary.tanggal}</h3>
        <p>${diary.isi}</p>
        <button data-id="${diary.id}" class="btn-edit">Edit</button>
        <button data-id="${diary.id}" class="btn-hapus">Hapus</button>
      `;
      diaryList.appendChild(div);
    });
    setupDiaryButtons();
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
      alert("Token expired atau tidak valid, silakan login ulang.");
      logoutBtn.onclick();
    }
  }
}

// Setup edit & delete buttons
function setupDiaryButtons() {
  const btnEdits = document.querySelectorAll(".btn-edit");
  const btnHapuses = document.querySelectorAll(".btn-hapus");

  btnEdits.forEach((btn) =>
    btn.addEventListener("click", () => {
      editId = btn.dataset.id;
      const entry = btn.parentElement;
      tanggalInput.value = entry.querySelector("h3").textContent;
      isiInput.value = entry.querySelector("p").textContent;
    })
  );

  btnHapuses.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await authAxios().delete(`/delete-note/${id}`);
        getDiary();
      } catch (err) {
        console.error(err);
      }
    })
  );
}

// Submit diary add/update
diaryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tanggal = tanggalInput.value;
  const isi = isiInput.value;

  try {
    if (editId) {
      await authAxios().put(`/edit-note/${editId}`, { tanggal, isi });
      editId = "";
    } else {
      await authAxios().post("/add-note", { tanggal, isi });
    }
    tanggalInput.value = "";
    isiInput.value = "";
    getDiary();
  } catch (err) {
    console.error(err);
  }
});

// On load, check token
window.onload = () => {
  if (getToken()) {
    initAfterLogin();
  }
};
