// script.js

let entries = JSON.parse(localStorage.getItem("entries")) || [];

// DOM Elements
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const entryList = document.getElementById("entry-list");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const addEntryButton = document.getElementById("add-entry");
const resetButton = document.getElementById("reset-form");
const filters = document.querySelectorAll("input[name='filter']");

// Add entry
addEntryButton.addEventListener("click", () => {
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!description || !amount || isNaN(amount)) {
    alert("Please enter valid details.");
    return;
  }

  const entry = { id: Date.now(), description, amount, type };
  entries.push(entry);
  saveEntries();
  updateUI();
  resetForm();
});

// Reset form
resetButton.addEventListener("click", resetForm);

function resetForm() {
  descriptionInput.value = "";
  amountInput.value = "";
  typeSelect.value = "income";
}

// Save entries to local storage
function saveEntries() {
  localStorage.setItem("entries", JSON.stringify(entries));
}

// Update UI
function updateUI() {
  const filter = document.querySelector("input[name='filter']:checked").value;

  const filteredEntries =
    filter === "all"
      ? entries
      : entries.filter((entry) => entry.type === filter);

  entryList.innerHTML = "";
  let totalIncome = 0;
  let totalExpense = 0;

  filteredEntries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = `entry ${entry.type}`;
    li.innerHTML = `
      <span>${entry.description} - $${entry.amount}</span>
      <div>
        <button onclick="editEntry(${entry.id})">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </div>
    `;

    entryList.appendChild(li);

    if (entry.type === "income") totalIncome += entry.amount;
    else totalExpense += entry.amount;
  });

  totalIncomeEl.textContent = totalIncome;
  totalExpenseEl.textContent = totalExpense;
  netBalanceEl.textContent = totalIncome - totalExpense;
}

// Edit entry
function editEntry(id) {
  const entry = entries.find((e) => e.id === id);
  if (entry) {
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    typeSelect.value = entry.type;
    entries = entries.filter((e) => e.id !== id);
    saveEntries();
    updateUI();
  }
}

// Delete entry
function deleteEntry(id) {
  entries = entries.filter((entry) => entry.id !== id);
  saveEntries();
  updateUI();
}

// Initial UI setup
filters.forEach((filter) => filter.addEventListener("change", updateUI));
updateUI();


