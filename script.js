const addIncomeBtn = document.getElementById('income-add-btn')
const addExpenseBtn = document.getElementById('expense-add-btn')
const availableMeans = document.getElementById('available-means')
const sumIncomeDisplay = document.getElementById('income-sum')
const sumExpenseDisplay = document.getElementById('expense-sum')
const editPanel = document.getElementById('panel-container')
const editNameInput = document.getElementById('name-edit')
const editAmountInput = document.getElementById('value-edit')
const saveEditBtn = document.getElementById('save-edit-btn')
const cancelEditBtn = document.getElementById('cancel-edit-btn')
const incomeList = document.getElementById('income-list')
const expenseList = document.getElementById('expense-list')
const transactionsContianer = document.getElementById('transactions-container')

let incomeArr = []
let expenseArr = []
let uniqeId = 0

const addNewTransaction = (name, amount, type) => {
	const transaction = { id: uniqeId++, name, amount }
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
	const transactionArr = type == 'income' ? incomeArr : expenseArr
	transactionArr.push(transaction)
	updateSums()
}
function checkTransaction(type) {
	const nameInput = type === 'income' ? document.getElementById('income-name') : document.getElementById('expense-name')
	const amountInput =
		type === 'income' ? document.getElementById('income-amount') : document.getElementById('expense-amount')

	if (nameInput.value !== '' && amountInput.value !== '') {
		addNewTransaction(nameInput.value, amountInput.value, type)
		nameInput.value = ''
		amountInput.value = ''
	} else {
		alert(`Wypełnij nazwę i kwotę ${type === 'income' ? 'przychodu' : 'wydatku'}`)
	}
}

const calculateSum = transactions => {
	return transactions.reduce((total, newTransaction) => total + parseFloat(newTransaction.amount), 0)
}

const updateSums = () => {
	const incomeSum = calculateSum(incomeArr)
	const expenseSum = calculateSum(expenseArr)
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
	transaction = incomeArr.find(item => item.id === id)
	if (!transaction) {
		transaction = expenseArr.find(item => item.id === id)
	}
	return transaction
}

const editTransaction = transaction => {
	editPanel.style.display = 'flex'
	editNameInput.value = transaction.name
	editAmountInput.value = transaction.amount
	saveEditBtn.onclick = () => {
		const newName = editNameInput.value
		const newAmount = editAmountInput.value
		if (newName !== '' && newAmount !== '') {
			transaction.name = newName
			transaction.amount = newAmount
			updateSums()
			editPanel.style.display = 'none'
			const listItem = document.querySelector(`[data-id="${transaction.id}"]`).closest('.list-item')
			const type = incomeArr.includes(transaction) ? 'income' : 'expense'
			listItem.querySelector(`.${type}-name`).textContent = transaction.name
			listItem.querySelector(`.${type}-value`).textContent = `${transaction.amount} zł`
		} else {
			alert('Wypełnij oba pola')
		}
	}
	cancelEditBtn.addEventListener('click', () => {
		editPanel.style.display = 'none'
	})
}

const deleteTransaction = transaction => {
	const incomeTransactionIndex = incomeArr.indexOf(transaction)
	if (incomeTransactionIndex !== -1) {
		incomeArr.splice(incomeTransactionIndex, 1)
		updateSums()
		document.querySelector(`#income-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
	const expenseTransactionIndex = expenseArr.indexOf(transaction)
	if (expenseTransactionIndex !== -1) {
		expenseArr.splice(expenseTransactionIndex, 1)
		updateSums()
		document.querySelector(`#expense-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
}

addIncomeBtn.addEventListener('click', () => {
	event.preventDefault()
	checkTransaction('income')
})

addExpenseBtn.addEventListener('click', () => {
	event.preventDefault()
	checkTransaction('expense')
})

transactionsContianer.addEventListener('click', event => {
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
