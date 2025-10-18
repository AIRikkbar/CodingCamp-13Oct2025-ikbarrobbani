// Ambil elemen dari HTML
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const addBtn = document.getElementById('addBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const taskList = document.getElementById('taskList');

const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');

const filterAll = document.getElementById('filterAll');
const filterPending = document.getElementById('filterPending');
const filterCompleted = document.getElementById('filterCompleted');

// Variabel data
let tasks = [];
let currentFilter = "all";

// === Fungsi render ===
function renderTasks() {
  taskList.innerHTML = "";

  // Filter tampilan
  let filteredTasks = [];
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else {
    filteredTasks = tasks;
  }

  // Jika kosong
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-500">No task found</td></tr>`;
  } else {
    filteredTasks.forEach((task, index) => {
      // Cari index asli di array tasks
      const originalIndex = tasks.indexOf(task);

      const tr = document.createElement("tr");
      tr.classList.add("border-b", "border-gray-700");

      tr.innerHTML = `
        <td class="p-3 ${task.completed ? 'line-through text-gray-500' : ''}">${task.name}</td>
        <td class="p-3">${task.date} ${task.time}</td>
        <td class="p-3">${task.completed ? '✅ Done' : '⏳ Pending'}</td>
        <td class="p-3 flex gap-2">
          <button onclick="toggleComplete(${originalIndex})" class="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs">${task.completed ? 'Undo' : 'Done'}</button>
          <button onclick="editTask(${originalIndex})" class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs">Edit</button>
          <button onclick="deleteTask(${originalIndex})" class="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs">Del</button>
        </td>
      `;
      taskList.appendChild(tr);
    });
  }

  updateStats();
}

// === Fungsi tambah ===
function addTask() {
  const name = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !date || !time) {
    alert("Please fill all fields!");
    return;
  }

  const newTask = {
    name,
    date,
    time,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  dateInput.value = "";
  timeInput.value = "";

  renderTasks();
}

// === Hapus task ===
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// === Hapus semua ===
function deleteAll() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
}

// === Toggle selesai/belum ===
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// === Edit task ===
function editTask(index) {
  const t = tasks[index];
  const newName = prompt("Edit task name:", t.name);
  const newDate = prompt("Edit date (yyyy-mm-dd):", t.date);
  const newTime = prompt("Edit time (hh:mm):", t.time);

  if (newName && newDate && newTime) {
    tasks[index] = { ...t, name: newName, date: newDate, time: newTime };
    renderTasks();
  }
}

// === Statistik ===
function updateStats() {
  totalTasks.textContent = `Total: ${tasks.length}`;
  completedTasks.textContent = `Completed: ${tasks.filter(t => t.completed).length}`;
  pendingTasks.textContent = `Pending: ${tasks.filter(t => !t.completed).length}`;
}

// === Filter ===
function setFilter(type) {
  currentFilter = type;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("filter-active"));

  if (type === "all") filterAll.classList.add("filter-active");
  else if (type === "pending") filterPending.classList.add("filter-active");
  else if (type === "completed") filterCompleted.classList.add("filter-active");

  renderTasks();
}

// === Event listener ===
addBtn.addEventListener("click", addTask);
deleteAllBtn.addEventListener("click", deleteAll);

filterAll.addEventListener("click", () => setFilter("all"));
filterPending.addEventListener("click", () => setFilter("pending"));
filterCompleted.addEventListener("click", () => setFilter("completed"));

// Enter untuk tambah juga
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

// Pertama kali tampil
setFilter("all");
renderTasks();
