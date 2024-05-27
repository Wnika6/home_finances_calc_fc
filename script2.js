const incomeAddBtn = document.getElementById('income-add-btn')
const expenseAddBtn = document.getElementById('expense-add-btn')
const availableMeans = document.getElementById('available-means')
const sumIncomeDisplay = document.getElementById('income-sum')
const sumExpenseDisplay = document.getElementById('expense-sum')
const editPanel = document.getElementById('panel-container')
const editNameInput = document.getElementById('name-edit')
const editAmountInput = document.getElementById('value-edit')
const editSaveBtn = document.getElementById('save-edit-btn')
const editCancelBtn = document.getElementById('cancel-edit-btn')
const incomeList = document.getElementById('income-list')
const expenseList = document.getElementById('expense-list')
const transactionsContianer = document.getElementById('transactions-container')

let incomeArr = []
let expenseArr = []
let uniqeId = 0

const generateTransactionListItem = transaction => {
	const { id, name, amount } = transaction
	const type = incomeArr.includes(transaction) ? 'income' : 'expense'
	return `
      <li class="list-item">
          <span class="${type}-name">${name}</span>
          <span class="${type}-value">${amount} zł</span>
          <div class="li-btns">
              <button class="edit-btn new-transaction-btn" data-id="${id}">Edytuj</button>
              <button class="delete-btn new-transaction-btn" data-id="${id}">Usuń</button>
          </div>
      </li>`
}

const renderTransactions = (transactions, listType) => {
	const transactionListItems = transactions.map(generateTransactionListItem).join('')
	listType.innerHTML = transactionListItems
}

const addNewTransaction = (name, amount, type) => {
	const transaction = { id: uniqeId++, name, amount }
	const transactionArr = type === 'income' ? incomeArr : expenseArr
	transactionArr.push(transaction)
	renderTransactions(transactionArr, type === 'income' ? incomeList : expenseList)
	updateSums()
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

	editSaveBtn.onclick = () => {
		const newName = editNameInput.value
		const newAmount = editAmountInput.value
		if (newName !== '' && newAmount !== '') {
			transaction.name = newName
			transaction.amount = newAmount
			updateSums()
			editPanel.style.display = 'none'
			const type = incomeArr.includes(transaction) ? 'income' : 'expense'
			updateTransactionListItem(transaction, type)
		} else {
			alert('Wypełnij oba pola')
		}
	}

	editCancelBtn.addEventListener('click', () => {
		editPanel.style.display = 'none'
	})
}

const updateTransactionListItem = (transaction, type) => {
	const listItem = document.querySelector(`[data-id="${transaction.id}"]`)
	if (listItem) {
		const listItemParent = listItem.closest('.list-item')
		listItemParent.querySelector(`.${type}-name`).textContent = transaction.name
		listItemParent.querySelector(`.${type}-value`).textContent = `${transaction.amount} zł`
	}
}

const deleteTransaction = transaction => {
	const index = incomeArr.indexOf(transaction)
	if (index !== -1) {
		incomeArr.splice(index, 1)
		updateSums()
		document.querySelector(`#income-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
	const index2 = expenseArr.indexOf(transaction)
	if (index2 !== -1) {
		expenseArr.splice(index2, 1)
		updateSums()
		document.querySelector(`#expense-list [data-id="${transaction.id}"]`).closest('.list-item').remove()
		return
	}
}

incomeAddBtn.addEventListener('click', () => {
	event.preventDefault()
	checkTransaction('income')
})

expenseAddBtn.addEventListener('click', () => {
	event.preventDefault()
	checkTransaction('expense')
})

transactionsContianer.addEventListener('click', event => {
	const target = event.target
	if (target.classList.contains('edit-btn')) {
		const id = parseInt(target.getAttribute('data-id'))
		const transaction = findTransactionByID(id)
		if (transaction) {
			editTransaction(transaction)
			console.log(transaction)
		}
	} else if (target.classList.contains('delete-btn')) {
		const id = parseInt(target.getAttribute('data-id'))
		const transaction = findTransactionByID(id)
		if (transaction) {
			deleteTransaction(transaction)
		}
	}
})
