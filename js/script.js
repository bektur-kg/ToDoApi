// ======================= BASE ========================

const BASE_URL = 'https://todo-itacademy.herokuapp.com/api'

// ======================= IMPORTS ========================
const $submit = document.querySelector('.btnSubmit')
const $todoTitle = document.querySelector('.todoTitle')
const $todoContent = document.querySelector('.todoContent')
const $todoDate = document.querySelector('.todoDate')
const $container = document.querySelector('.part2Container')
const $logout = document.querySelector('.logout')

// ======================= STATES =========================
const accessToken = localStorage.getItem('accessToken')

const requests = {
	get: (url) => {
		return fetch(url, {
			method: 'GET',
			headers: {
				'Content-type': 'applictaion/json',
				Authorization: `Bearer ${accessToken}`,
			},
		}).then((res) => res.json())
	},
	post: (url, body) => {
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		}).then((r) => r.json())
	},
	delete: (url) => {
		return fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-type': 'applitcation/json',
				Authorization: `Bearer ${accessToken}`,
			},
		}).then((r) => r.json())
	},
	put: (url, body) => {
		return fetch(url, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(body),
		})
	},
}
// ===========================================================

// <------------------------ CHECK UNAUTHORIZED --------------->
window.addEventListener('load', () => {
	const accessToken = localStorage.getItem('accessToken')
	if (!accessToken) {
		open('../auth.html', '_self')
	}
})

window.addEventListener('load', () => {
	getTodos()
})

$submit.addEventListener('click', () => {
	const title = $todoTitle.value
	const content = $todoContent.value
	const date = $todoDate.value
	if (title.length !== 0 && content.length !== 0 && date.length !== 0) {
		createTodos(title, content, date)
	}
})

$logout.addEventListener('click', (e) => {
	e.preventDefault()
	const refreshToken = localStorage.getItem('refreshToken')
	$logout.disabled = true
	fetch(`${BASE_URL}/logout`, {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify({ refreshToken }),
	})
		.then(() => {
			localStorage.clear()
			open('../auth.html', '_self')
		})
		.finally(() => {
			$logout.disabled = false
		})
})

function getTodos() {
	requests.get(`${BASE_URL}/todos`).then((r) => {
		const todos = r.todos
		cardTemlate(todos)
	})
}

function cardTemlate(base) {
	const template = base
		.reverse()
		.map(({ title, content, date, id, completed, edited }) => {
			return `
			<div class="card">
					<span class='complete'>${completed ? '✓' : ''}</span>
				<div class="cardTitle">
					<h3>${title}</h3>
				</div>
				<div class="cardDate">
					<span>${date}</span>
					<span>${edited.state ? `edited: ${edited.date}` : ''}</span>
					</div>
				<div class="cardBody">
					<p>
						${content}
					</p>
				</div>
				<div class="cardFooter">
					<button class="edit" onclick="editTodo('${id}')">Edit</button>
					<button class="completed" onclick="completeTodo('${id}')">Completed</button>
					<button class="delete" onclick="deleteTodo('${id}')">Delete</button>
				</div>
			</div>
		`
		})
		.join('')
	$container.innerHTML = template
}

function completeTodo(id) {
	requests.get(`${BASE_URL}/todos/${id}/completed`).then(getTodos)
}

function deleteTodo(id) {
	requests.delete(`${BASE_URL}/todos/${id}`).then(getTodos)
}

function getSingleTodo(id) {
	return requests.get(`${BASE_URL}/todos/${id}`)
}

function editTodo(id) {
	getSingleTodo(id).then((res) => {
		const newTitle = prompt('New Title')
		const newContent = prompt('New Content')
		requests
			.put(`${BASE_URL}/todos/${id}`, {
				title: newTitle || res.title,
				content: newContent || res.content,
			})
			.then(getTodos)
	})
}

function createTodos(title, content, date) {
	$submit.disabled = true

	const body = {
		title,
		content,
		date,
	}
	console.log(body)
	requests
		.post(`${BASE_URL}/todos/create`, body)
		.then(() => getTodos())
		.finally(() => ($submit.disabled = false))
}
