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

    // Feature 02: Filter & Sort
    document.getElementById("classFilter").addEventListener("change", applyFilterAndSort);
    document.getElementById("sortOptions").addEventListener("change", applyFilterAndSort);
    document.getElementById("searchInput").addEventListener("input", applyFilterAndSort);

    // Feature 03: Import/Export
    document.getElementById("exportBtn").addEventListener("click", exportData);
    document.getElementById("importFile").addEventListener("change", importData);

    // Feature 04: Bulk actions
    document.getElementById("selectAll").addEventListener("change", toggleSelectAll);
    document.getElementById("bulkDeleteBtn").addEventListener("click", bulkDelete);
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

/* ================= FEATURE 02: BỘ LỌC + SẮP XẾP ================= */
function applyFilterAndSort() {
    const classVal = document.getElementById("classFilter").value;
    const searchVal = document.getElementById("searchInput").value.toLowerCase();
    const sortVal = document.getElementById("sortOptions").value;

    let filtered = students.filter(s => {
        const matchesClass = classVal === "" || s.className === classVal;
        const matchesSearch = s.name.toLowerCase().includes(searchVal) || s.id.toLowerCase().includes(searchVal);
        return matchesClass && matchesSearch;
    });

    // Sorting
    filtered.sort((a, b) => {
        if (sortVal === "name-asc") return a.name.localeCompare(b.name);
        if (sortVal === "name-desc") return b.name.localeCompare(a.name);
        if (sortVal === "grade-asc") return a.grade - b.grade;
        if (sortVal === "grade-desc") return b.grade - a.grade;
        return 0;
    });

    renderTable(filtered);
}

/* ================= FEATURE 04: BULK ACTIONS ================= */
function renderTable(list) {
    const tableBody = document.getElementById("studentTable");
    tableBody.innerHTML = "";

    list.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox" value="${student.id}" onclick="updateBulkBtn()"></td>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.className}</td>
            <td>${student.grade}</td>
            <td>${student.email}</td>
            <td>
                <button onclick="enterEditMode('${student.id}')">Sửa</button>
                <button class="btn-danger" onclick="deleteStudent('${student.id}')">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateBulkBtn();
}

function toggleSelectAll(e) {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach(cb => cb.checked = e.target.checked);
    updateBulkBtn();
}

function updateBulkBtn() {
    const selected = document.querySelectorAll(".row-checkbox:checked").length;
    const btn = document.getElementById("bulkDeleteBtn");
    btn.style.display = selected > 0 ? "inline-block" : "none";
    btn.textContent = `Xóa ${selected} mục`;
}

function bulkDelete() {
    if (!confirm("Bạn có chắc chắn muốn xóa các mục đã chọn?")) return;
    const selectedIds = Array.from(document.querySelectorAll(".row-checkbox:checked")).map(cb => cb.value);
    students = students.filter(s => !selectedIds.includes(s.id));
    saveStudents();
    applyFilterAndSort();
    showToast(`Đã xóa ${selectedIds.length} sinh viên`);
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

/* ================= FEATURE 06: KEYBOARD SHORTCUTS ================= */
function setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
        if (e.altKey && e.key === 's') { // Alt + S: Focus Search
            e.preventDefault();
            document.getElementById("searchInput").focus();
        }
        if (e.key === "Escape" && editModeId) { // Esc: Cancel Edit
            exitEditMode();
        }
    });
}

/* ================= CHỨC NĂNG PHỤ TRỢ ================= */
function deleteStudent(id) {
    if (confirm("Xóa sinh viên này?")) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        applyFilterAndSort();
        showToast("Đã xóa!");
    }
}

function enterEditMode(id) {
    const s = students.find(item => item.id === id);
    editModeId = id;
    document.getElementById("inputId").value = s.id;
    document.getElementById("inputId").readOnly = true;
    document.getElementById("inputName").value = s.name;
    document.getElementById("inputClass").value = s.className;
    document.getElementById("inputEmail").value = s.email;
    document.getElementById("inputGrade").value = s.grade;
    document.getElementById("submitBtn").textContent = "Cập nhật";
    document.getElementById("cancelEdit").style.display = "inline-block";
    window.scrollTo(0, 0);
}

function exitEditMode() {
    editModeId = null;
    document.getElementById("addForm").reset();
    document.getElementById("inputId").readOnly = false;
    document.getElementById("submitBtn").textContent = "Thêm";
    document.getElementById("cancelEdit").style.display = "none";
}

document.getElementById("cancelEdit").onclick = exitEditMode;

// Import/Export logic giữ nguyên nhưng thêm showToast
function exportData() {
    const data = { time: new Date(), students };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `students_${Date.now()}.json`;
    a.click();
    showToast("Đã xuất file JSON");
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (data.students) {
                students = data.students;
                saveStudents();
                applyFilterAndSort();
                showToast("Import thành công!");
            }
        } catch (err) {
            showToast("File không hợp lệ!", "error");
        }
    };
    reader.readAsText(file);
}

// Dark Mode
function loadTheme() {
    if (localStorage.getItem(THEME_KEY) === "dark") document.body.classList.add("dark-mode");
}

document.getElementById("themeBtn").onclick = function() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(THEME_KEY, document.body.classList.contains("dark-mode") ? "dark" : "light");
};