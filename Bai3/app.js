const STORAGE_KEY = "students_v2";
const THEME_KEY = "theme_v2";

const defaultData = [
    { id: "SV001", name: "Nguyễn Huy Đạt", className: "CNTT01", email: "a@gmail.com" },
  { id: "SV002", name: "Trần Phi Long", className: "CNTT02", email: "b@gmail.com" },
  { id: "SV003", name: "Lê Minh Quân", className: "CNTT01", email: "c@gmail.com" },
  { id: "SV004", name: "Phạm Tuấn Anh", className: "CNTT03", email: "d@gmail.com" },
  { id: "SV005", name: "Võ Thanh Bình", className: "CNTT02", email: "e@gmail.com" },
  { id: "SV006", name: "Đặng Thị Hồng", className: "CNTT04", email: "f@gmail.com" },
  { id: "SV007", name: "Hoàng Gia Huy", className: "CNTT01", email: "g@gmail.com" },
  { id: "SV008", name: "Ngô Trọng Nghĩa", className: "CNTT03", email: "h@gmail.com" },
  { id: "SV009", name: "Bùi Khánh Linh", className: "CNTT02", email: "i@gmail.com" },
  { id: "SV010", name: "Trương Quốc Nam", className: "CNTT04", email: "j@gmail.com" },
  { id: "SV011", name: "Phan Nhật Minh", className: "CNTT03", email: "k@gmail.com" },
  { id: "SV012", name: "Lý Thanh Tùng", className: "CNTT01", email: "l@gmail.com" }
  
];

let students = loadStudents();
renderTable(students);
loadTheme();

/* ================= LOAD / SAVE ================= */

function loadStudents() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

/* ================= RENDER ================= */

function renderTable(list) {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    list.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.className}</td>
            <td>${student.email}</td>
            <td><button onclick="deleteStudent('${student.id}')">X</button></td>
        `;

        table.appendChild(row);
    });
}
/* ================= ADD ================= */

document.getElementById("addForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("inputId").value.trim();
    const name = document.getElementById("inputName").value.trim();
    const className = document.getElementById("inputClass").value.trim();
    const email = document.getElementById("inputEmail").value.trim();
    const errorBox = document.getElementById("errorBox");

    errorBox.textContent = "";

    if (!id || !name || !className || !email) {
        errorBox.textContent = "Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    const exists = students.some(s => s.id.toLowerCase() === id.toLowerCase());
    if (exists) {
        errorBox.textContent = "Mã sinh viên đã tồn tại!";
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorBox.textContent = "Email không hợp lệ!";
        return;
    }

    const newStudent = { id, name, className, email };
    students.push(newStudent);
    saveStudents();
    renderTable(students);

    this.reset();
});