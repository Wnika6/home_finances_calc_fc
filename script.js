const incomeForm = document.getElementById('income-form')
const expenseForm = document.getElementById('expense-form')
const addIncomeBtn = document.getElementById('income-add-btn')
const addExpenseBtn = document.getElementById('expense-add-btn')
const availableMeans = document.getElementById('available-means')
const incomeValidationAlert = document.getElementById('income-alert')
const expenseValidationAlert = document.getElementById('expense-alert')
const sumIncomeDisplay = document.getElementById('income-sum')
const sumExpenseDisplay = document.getElementById('expense-sum')
const editPanel = document.getElementById('panel-container')
const editNameInput = document.getElementById('name-edit')
const editAmountInput = document.getElementById('value-edit')
const editPanelForm = document.getElementById('edit-panel-form')
const cancelEditBtn = document.getElementById('cancel-edit-btn')
const editNameValidationAlert = document.getElementById('edit-name-alert')
const editAmountValidationAlert = document.getElementById('edit-amount-alert')
const incomeList = document.getElementById('income-list')
const expenseList = document.getElementById('expense-list')
const transactionsContainer = document.getElementById('transactions-container')

let incomeTransactions = []
let expenseTransactions = []
let uniqueId = 0

const addNewTransaction = (name, amount, type) => {
	const transaction = { id: uniqueId++, name, amount }
	const listItem = document.createElement('li')
	listItem.classList.add('list-item')
	listItem.innerHTML = `
	<span class="${type}-name list-item-text">${transaction.name}</span>
	<span class="${type}-value list-item-text">${transaction.amount} zł</span>
	<div class="li-btns">
	<button class="edit-btn li-btn" data-id="${transaction.id}">Edytuj</button>
	<button class="delete-btn li-btn" data-id="${transaction.id}">Usuń</button>
	</div>`
	const listType = type === 'income' ? incomeList : expenseList
	listType.appendChild(listItem)
	const transactionArr = type == 'income' ? incomeTransactions : expenseTransactions
	transactionArr.push(transaction)
	updateSums()
}

function validateTransactionInput(type) {
	const nameInput = document.getElementById(`${type}-name`)
	const amountInput = document.getElementById(`${type}-amount`)
	const validationAlertType = type === 'income' ? incomeValidationAlert : expenseValidationAlert

	if (nameInput.value === '') {
		validationAlertType.textContent = `Wypełnij nazwę ${type === 'income' ? 'przychodu' : 'wydatku'}`
	} else if (isNaN(amountInput.value) || amountInput.value <= 0) {
		validationAlertType.textContent = 'Kwota powinna zawierać liczbę większą od 0.'
	} else {
		addNewTransaction(nameInput.value.trim(), amountInput.value.trim(), type)
		nameInput.value = ''
		amountInput.value = ''
		validationAlertType.textContent = ''
	}
}

const calculateTotal = transactions => {
	return transactions.reduce((total, newTransaction) => total + parseFloat(newTransaction.amount), 0)
}

const updateSums = () => {
	const incomeSum = calculateTotal(incomeTransactions)
	const expenseSum = calculateTotal(expenseTransactions)
	sumIncomeDisplay.textContent = `${incomeSum.toFixed(2)} zł`
	sumExpenseDisplay.textContent = `${expenseSum.toFixed(2)} zł`

	const balance = incomeSum - expenseSum

	if (balance > 0) {
		availableMeans.textContent = `Możesz jeszcze wydać ${balance.toFixed(2)} złotych`
	} else if (balance < 0) {
		availableMeans.textContent = `Bilans jest ujemny. Jesteś na minusie ${(-balance).toFixed(2)} złotych`
	} else {
		availableMeans.textContent = `Bilans wynosi zero`
	}
}

const findTransactionByID = id => {
	let transaction
	transaction = incomeTransactions.find(item => item.id === id)
	if (!transaction) {
		transaction = expenseTransactions.find(item => item.id === id)
	}
	return transaction
}

const editTransaction = transaction => {
	editPanel.dataset.transactionId = transaction.id
	editPanel.style.display = 'flex'
	editNameInput.value = transaction.name
	editAmountInput.value = transaction.amount
}

const handleSaveEdit = event => {
	event.preventDefault()
	const newName = editNameInput.value.trim()
	const newAmount = parseFloat(editAmountInput.value.trim())

	const isValid = validateEditInputs(newName, newAmount)

	if (!isValid) {
		return
	}

	const transaction = findTransactionByID(parseInt(editPanel.dataset.transactionId))

	updateTransaction(transaction, newName, newAmount)
	updateTransactionList(transaction)
	updateSums()
	hideEditPanel()
}

const validateEditInputs = (name, amount) => {
	let isValid = true

	if (name === '') {
		editNameValidationAlert.textContent = 'Wpisz nazwę transakcji.'
		isValid = false
	} else {
		editNameValidationAlert.textContent = ''
	}

	if (isNaN(amount) || amount <= 0) {
		editAmountValidationAlert.textContent = 'Kwota musi być większa od zera.'
		isValid = false
	} else {
		editAmountValidationAlert.textContent = ''
	}

	return isValid
}

const updateTransaction = (transaction, newName, newAmount) => {
	transaction.name = newName
	transaction.amount = newAmount
}

const updateTransactionList = transaction => {
	const listItem = document.querySelector(`[data-id="${transaction.id}"]`).closest('.list-item')
	const type = incomeTransactions.includes(transaction) ? 'income' : 'expense'
	listItem.querySelector(`.${type}-name`).textContent = transaction.name
	listItem.querySelector(`.${type}-value`).textContent = `${transaction.amount.toFixed(2)} zł`
}

const hideEditPanel = () => {
	editPanel.style.display = 'none'
}

const handleCancelEdit = event => {
	event.preventDefault()
	editPanel.style.display = 'none'
}

const deleteTransaction = transaction => {
	const incomeTransactionIndex = incomeTransactions.indexOf(transaction)
	if (incomeTransactionIndex !== -1) {
		incomeTransactions.splice(incomeTransactionIndex, 1)
		updateSums()
		document.querySelector(`#income-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
	const expenseTransactionIndex = expenseTransactions.indexOf(transaction)
	if (expenseTransactionIndex !== -1) {
		expenseTransactions.splice(expenseTransactionIndex, 1)
		updateSums()
		document.querySelector(`#expense-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
}

const handleFormSubmit = (event, type) => {
	event.preventDefault()
	validateTransactionInput(type)
}

incomeForm.addEventListener('submit', event => handleFormSubmit(event, 'income'))
expenseForm.addEventListener('submit', event => handleFormSubmit(event, 'expense'))
editPanelForm.addEventListener('submit', handleSaveEdit)
cancelEditBtn.addEventListener('click', handleCancelEdit)

transactionsContainer.addEventListener('click', event => {
	const target = event.target
	const id = parseInt(target.getAttribute('data-id'))
	const transaction = findTransactionByID(id)

	if (transaction) {
		if (target.classList.contains('edit-btn')) {
			editTransaction(transaction)
		} else if (target.classList.contains('delete-btn')) {
			deleteTransaction(transaction)
		}
	}
})
