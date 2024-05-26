document.addEventListener('DOMContentLoaded', () => {
	const incomeAddBtn = document.querySelector('.income-add-btn')
	const expenseAddBtn = document.querySelector('.expense-add-btn')
	const availableMeans = document.querySelector('.available-means')
	const sumIncomeDisplay = document.querySelector('.income-sum')
	const sumExpenseDisplay = document.querySelector('.expense-sum')
	const editPanel = document.querySelector('.panel-container')
	const editNameInput = document.querySelector('#name-edit')
	const editAmountInput = document.querySelector('#value-edit')
	const editSaveBtn = document.querySelector('.save-edit-btn')
	const editCancelBtn = document.querySelector('.cancel-edit-btn')
	const transactionsContianer = document.querySelector('.transactions')

	const incomeList = document.querySelector('.income-list')
	const expenseList = document.querySelector('.expense-list')

	let incomeArr = []
	let expenseArr = []
	let uniqeId = 0

	const addNewTransaction = (name, amount, type) => {
		const transaction = { id: uniqeId++, name, amount }
		console.log(transaction)
		const listItem = document.createElement('li')
		listItem.classList.add('list-item')
		listItem.innerHTML = `
            <span class="${type}-name">${transaction.name}</span>
            <span class="${type}-value">${transaction.amount} zł</span>
            <div class="li-btns">
                <button class="edit-btn trans-btn" data-id="${transaction.id}">Edytuj</button>
                <button class="delete-btn trans-btn" data-id="${transaction.id}">Usuń</button>
            </div>`

		const listType = type === 'income' ? incomeList : expenseList
		listType.appendChild(listItem)
		const transactionArr = type == 'income' ? incomeArr : expenseArr
		transactionArr.push(transaction)
		updateSums()
	}

	const calculateSum = transactions => {
		return transactions.reduce((total, newTransaction) => total + parseFloat(newTransaction.amount), 0)
	}

	const updateSums = () => {
		const incomeSum = calculateSum(incomeArr)
		const expenseSum = calculateSum(expenseArr)
		sumIncomeDisplay.textContent = incomeSum.toFixed(2)
		sumExpenseDisplay.textContent = expenseSum.toFixed(2)

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
		const nameInput =
			type === 'income' ? document.getElementById('income-name') : document.getElementById('expense-name')
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
				const listItem = document.querySelector(`[data-id="${transaction.id}"]`).closest('.list-item')
				const type = incomeArr.includes(transaction) ? 'income' : 'expense'
				listItem.querySelector(`.${type}-name`).textContent = transaction.name
				listItem.querySelector(`.${type}-value`).textContent = `${transaction.amount} zł`
			} else {
				alert('Wypełnij oba pola')
			}
		}
		editCancelBtn.addEventListener('click', () => {
			editPanel.style.display = 'none'
		})
	}

	const deleteTransaction = transaction => {
		const index = incomeArr.indexOf(transaction)
		if (index !== -1) {
			incomeArr.splice(index, 1)
			updateSums()
			document.querySelector(`.income-list [data-id="${transaction.id}"]`).parentElement.parentElement.remove()
			return
		}
		const index2 = expenseArr.indexOf(transaction)
		if (index2 !== -1) {
			expenseArr.splice(index2, 1)
			updateSums()
			document.querySelector(`.expense-list [data-id="${transaction.id}"]`).parentElement.parentElement.remove()
			return
		}
	}
})
