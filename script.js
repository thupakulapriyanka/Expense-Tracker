document.addEventListener('DOMContentLoaded', loadExpenses);

const addExpenseButton = document.getElementById('add-expense-button');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const categoryTotalsDiv = document.getElementById('category-totals');

addExpenseButton.addEventListener('click', addExpense);
expenseList.addEventListener('click', deleteExpense);

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(expense => displayExpense(expense));
    calculateCategoryTotals();
}

function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const category = expenseCategoryInput.value.trim();

    if (name !== '' && !isNaN(amount) && category !== '') {
        const expense = {
            name,
            amount,
            category
        };
        displayExpense(expense);
        saveExpense(expense);
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        expenseCategoryInput.value = '';
    }
}

function displayExpense(expense) {
    const expenseItem = document.createElement('li');
    expenseItem.textContent = `${expense.name}: $${expense.amount.toFixed(2)} (${expense.category})`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    expenseItem.appendChild(deleteButton);

    expenseList.appendChild(expenseItem);
}

function deleteExpense(e) {
    if (e.target.tagName === 'BUTTON') {
        const expenseItem = e.target.closest('li');
        expenseItem.remove();
        updateLocalStorage();
        calculateCategoryTotals();
    }
}

function saveExpense(expense) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    calculateCategoryTotals();
}

function updateLocalStorage() {
    const expenses = [];
    expenseList.querySelectorAll('li').forEach(expenseItem => {
        const [name, rest] = expenseItem.firstChild.textContent.split(': $');
        const [amount, category] = rest.split(' (');
        expenses.push({
            name,
            amount: parseFloat(amount),
            category: category.slice(0, -1)
        });
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function calculateCategoryTotals() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totals = {};
    expenses.forEach(expense => {
        if (!totals[expense.category]) {
            totals[expense.category] = 0;
        }
        totals[expense.category] += expense.amount;
    });

    categoryTotalsDiv.innerHTML = '';
    for (const [category, total] of Object.entries(totals)) {
        const totalDiv = document.createElement('div');
        totalDiv.textContent = `${category}: $${total.toFixed(2)}`;
        categoryTotalsDiv.appendChild(totalDiv);
    }
}
