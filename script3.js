const incomeAddBtn = document.getElementById('income-add-btn') // Use getElementById
const expenseAddBtn = document.getElementById('expense-add-btn') // Use getElementById
const totalAmount = document.getElementById('total-amount') // Use getElementById
const sumIncomeDisplay = document.getElementById('income-sum') // Use getElementById
const sumExpenseDisplay = document.getElementById('expense-sum') // Use getElementById
const editPanel = document.getElementById('panel-container') // Use getElementById
const editNameInput = document.getElementById('name-edit') // Use getElementById
const editAmountInput = document.getElementById('value-edit') // Use getElementById
const editSaveBtn = document.getElementById('save-edit-btn') // Use getElementById
const editCancelBtn = document.getElementById('cancel-edit-btn') // Use getElementById
const transactionsContainer = document.getElementById('transactions') // Use getElementById

const incomeList = document.getElementById('income-list') // Use getElementById
const expenseList = document.getElementById('expense-list') // Use getElementById

let incomeArr = []
let expenseArr = []
let uniqueId = 0

const addNewTransaction = (name, amount, type) => {
	const transaction = { id: uniqueId++, name, amount: parseFloat(amount) }
	const listItem = document.createElement('li')
	listItem.classList.add('list-item')
	listItem.innerHTML = `
		<span class="${type}-name">${transaction.name}</span>
		<span class="${type}-value">${transaction.amount.toFixed(2)} zł</span>
		<div class="li-btns">
			<button class="edit-btn new-transaction-btn" data-id="${transaction.id}">Edytuj</button>
			<button class="delete-btn new-transaction-btn" data-id="${transaction.id}">Usuń</button>
		</div>`

	const listType = type === 'income' ? incomeList : expenseList
	listType.appendChild(listItem)
	const transactionArr = type === 'income' ? incomeArr : expenseArr
	transactionArr.push(transaction)
	updateSums()
}

const calculateSum = transactions => {
	return transactions.reduce((total, transaction) => total + transaction.amount, 0)
}

const updateSums = () => {
	const incomeSum = calculateSum(incomeArr)
	const expenseSum = calculateSum(expenseArr)
	sumIncomeDisplay.textContent = incomeSum.toFixed(2)
	sumExpenseDisplay.textContent = expenseSum.toFixed(2)

	const balance = incomeSum - expenseSum

	if (balance > 0) {
		totalAmount.textContent = `Możesz jeszcze wydać ${balance.toFixed(2)} złotych`
	} else if (balance < 0) {
		totalAmount.textContent = `Bilans jest ujemny. Jesteś na minusie ${(-balance).toFixed(2)} złotych`
	} else {
		totalAmount.textContent = `Bilans wynosi zero`
	}
}

const checkTransaction = type => {
	const nameInput = type === 'income' ? document.getElementById('income-name') : document.getElementById('expense-name')
	const amountInput =
		type === 'income' ? document.getElementById('income-amount') : document.getElementById('expense-amount')

	if (nameInput.value !== '' && amountInput.value !== '') {
		addNewTransaction(nameInput.value, parseFloat(amountInput.value), type)
		nameInput.value = ''
		amountInput.value = ''
	} else {
		alert(`Wypełnij nazwę i kwotę ${type === 'income' ? 'przychodu' : 'wydatku'}`)
	}
}

incomeAddBtn.addEventListener('click', event => {
	event.preventDefault()
	checkTransaction('income')
})

expenseAddBtn.addEventListener('click', event => {
	event.preventDefault()
	checkTransaction('expense')
})

transactionsContainer.addEventListener('click', event => {
	const target = event.target
	if (target.classList.contains('edit-btn')) {
		const id = parseInt(target.getAttribute('data-id'))
		const transaction = findTransactionByID(id)
		if (transaction) {
			editTransaction(transaction)
		}
	} else if (target.classList.contains('delete-btn')) {
		const id = parseInt(target.getAttribute('data-id'))
		const transaction = findTransactionByID(id)
		if (transaction) {
			deleteTransaction(transaction)
		}
	}
})

const findTransactionByID = id => {
	let transaction = incomeArr.find(item => item.id === id)
	if (!transaction) {
		transaction = expenseArr.find(item === id)
	}
	return transaction
}

const editTransaction = transaction => {
	editPanel.style.display = 'flex'
	editNameInput.value = transaction.name
	editAmountInput.value = transaction.amount
	editSaveBtn.onclick = () => {
		const newName = editNameInput.value
		const newAmount = parseFloat(editAmountInput.value)
		if (newName !== '' && newAmount !== '') {
			transaction.name = newName
			transaction.amount = newAmount
			updateSums()
			editPanel.style.display = 'none'
			const listItem = document.querySelector(`[data-id="${transaction.id}"]`).closest('.list-item')
			const type = incomeArr.includes(transaction) ? 'income' : 'expense'
			listItem.querySelector(`.${type}-name`).textContent = transaction.name
			listItem.querySelector(`.${type}-value`).textContent = `${transaction.amount.toFixed(2)} zł`
		} else {
			alert('Wypełnij oba pola')
		}
	}
	editCancelBtn.addEventListener('click', () => {
		editPanel.style.display = 'none'
	})
}

const deleteTransaction = transaction => {
	let index = incomeArr.indexOf(transaction)
	if (index !== -1) {
		incomeArr.splice(index, 1)
		updateSums()
		document.querySelector(`.income-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
	index = expenseArr.indexOf(transaction)
	if (index !== -1) {
		expenseArr.splice(index, 1)
		updateSums()
		document.querySelector(`.expense-list [data-id="${transaction.id}"]`).remove()
	}
}
