/* ================= CẤU HÌNH & DỮ LIỆU GỐC ================= */
const STORAGE_KEY = "students_v2";
const THEME_KEY = "theme_v2";

const defaultData = [
    { id: "SV001", name: "Nguyễn Huy Đạt", className: "CNTT01", email: "a@gmail.com", grade: 8.5 },
    { id: "SV002", name: "Trần Phi Long", className: "CNTT02", email: "b@gmail.com", grade: 7.0 }
];

let students = loadStudents();
let editModeId = null; // Quản lý trạng thái edit

// Khởi tạo ứng dụng
initApp();

function initApp() {
    renderTable(students);
    loadTheme();
    setupEventListeners();
    setupKeyboardShortcuts(); // Feature 06
}

/* ================= FEATURE 01: CRUD NÂNG CAO & VALIDATE ================= */
function loadStudents() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function setupEventListeners() {
    // Form Submit (Add & Edit)
    document.getElementById("addForm").addEventListener("submit", function(e) {
        e.preventDefault();
        handleFormSubmit(this);
    });
}

function handleFormSubmit(form) {
    const id = document.getElementById("inputId").value.trim();
    const name = document.getElementById("inputName").value.trim();
    const className = document.getElementById("inputClass").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const grade = parseFloat(document.getElementById("inputGrade").value);

    // Validation cơ bản
    if (students.some(s => s.id === id && s.id !== editModeId)) {
        showToast("Mã sinh viên đã tồn tại!", "error");
        return;
    }

    const newStudent = { id, name, className, email, grade };

    if (editModeId) {
        // Update
        const index = students.findIndex(s => s.id === editModeId);
        students[index] = newStudent;
        showToast("Cập nhật thành công!");
        exitEditMode();
    } else {
        // Create
        students.push(newStudent);
        showToast("Thêm sinh viên thành công!");
    }

    saveStudents();
    applyFilterAndSort();
    form.reset();
}
/* ================= FEATURE 05: UX POLISH (TOAST) ================= */
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}