const BASE_URL = "http://localhost:5000"; // Ganti sesuai backend-mu

// Elemen DOM
const authSection = document.getElementById("auth-section");
const diarySection = document.getElementById("diary-section");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSubmit = document.getElementById("auth-submit");
const toggleAuth = document.getElementById("toggle-auth");
const toggleLink = document.getElementById("toggle-link");
const authMessage = document.getElementById("auth-message");

const diaryForm = document.getElementById("diary-form");
const tanggalInput = document.getElementById("tanggal");
const isiInput = document.getElementById("isi");
const diaryList = document.getElementById("diary-list");
const logoutBtn = document.getElementById("logout-btn");

let isLogin = true;  // true = login mode, false = register mode
let editId = null;   // ID diary yang sedang diedit

// Toggle login/register form
toggleAuth.addEventListener("click", () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? "Login" : "Register";
  authSubmit.textContent = isLogin ? "Login" : "Register";
  toggleLink.textContent = isLogin ? "Register di sini" : "Login di sini";
  authMessage.textContent = "";
});

// Simpan token di localStorage
function saveToken(token) {
  localStorage.setItem("token", token);
}
function getToken() {
  return localStorage.getItem("token");
}
function clearToken() {
  localStorage.removeItem("token");
}

// Setup axios header Authorization
function authAxios() {
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

// Submit login/register
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMessage.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    if (isLogin) {
      // Login
      const res = await axios.post(`${BASE_URL}/auth/login`, { username, password });
      saveToken(res.data.token);
      showDiarySection();
      loadDiary();
    } else {
      // Register
      await axios.post(`${BASE_URL}/auth/register`, { username, password });
      authMessage.style.color = "green";
      authMessage.textContent = "Registrasi berhasil, silakan login.";
      isLogin = true;
      authTitle.textContent = "Login";
      authSubmit.textContent = "Login";
      toggleLink.textContent = "Register di sini";
    }
  } catch (err) {
    authMessage.style.color = "red";
    authMessage.textContent = err.response?.data?.msg || "Terjadi kesalahan";
  }
});

// Tampilkan section diary, sembunyikan auth
function showDiarySection() {
  authSection.classList.add("hidden");
  diarySection.classList.remove("hidden");
}

// Tampilkan section auth, sembunyikan diary
function showAuthSection() {
  authSection.classList.remove("hidden");
  diarySection.classList.add("hidden");
}

// Logout
logoutBtn.addEventListener("click", () => {
  clearToken();
  showAuthSection();
});

// Load diary dari backend
async function loadDiary() {
  try {
    const res = await authAxios().get("/note");
    diaryList.innerHTML = "";

    res.data.forEach((diary) => {
      const div = document.createElement("div");
      div.classList.add("diary-entry");
      div.innerHTML = `
        <h3>${diary.tanggal}</h3>
        <p>${diary.isi}</p>
        <button data-id="${diary.id}" class="edit-btn">Edit</button>
        <button data-id="${diary.id}" class="delete-btn">Hapus</button>
      `;
      diaryList.appendChild(div);
    });

    setupDiaryButtons();
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
      // Token invalid atau expired, arahkan ke login
      clearToken();
      showAuthSection();
    }
  }
}

// Setup tombol edit & hapus diary
function setupDiaryButtons() {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      editId = btn.dataset.id;
      const entry = btn.parentElement;
      tanggalInput.value = entry.querySelector("h3").textContent;
      isiInput.value = entry.querySelector("p").textContent;
    })
  );

  deleteButtons.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await authAxios().delete(`/delete-note/${id}`);
        loadDiary();
      } catch (err) {
        console.error(err);
      }
    })
  );
}

// Submit tambah/update diary
diaryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tanggal = tanggalInput.value;
  const isi = isiInput.value;

  try {
    if (editId) {
      // Update diary
      await authAxios().put(`/edit-note/${editId}`, { tanggal, isi });
      editId = null;
    } else {
      // Tambah diary baru
      await authAxios().post("/add-note", { tanggal, isi });
    }
    tanggalInput.value = "";
    isiInput.value = "";
    loadDiary();
  } catch (err) {
    console.error(err);
  }
});

// Saat halaman dimuat, cek token dan tampilkan section sesuai
window.onload = () => {
  if (getToken()) {
    showDiarySection();
    loadDiary();
  } else {
    showAuthSection();
  }
};
