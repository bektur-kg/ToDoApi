// ==================== BASE ======================

const BASE_URL = 'https://todo-itacademy.herokuapp.com/api'

// ===================== IMPORTS =====================

const $email = document.querySelector('.email')
const $password = document.querySelector('.password')
const $submit = document.querySelector('.submitBtn')

// ===================== STATES ======================

// ====================================================

$password.addEventListener('click', () => {
	$email.style.borderColor = 'lightgray'
	$password.style.borderColor = '#F09727'
})

$email.addEventListener('click', () => {
	$password.style.borderColor = 'lightgray'
	$email.style.borderColor = '#F09727'
})

$submit.addEventListener('click', (e) => {
	e.preventDefault()
	if ($email.value.length === 0 || $password.value.length === 0) {
		if ($email.value.length === 0) {
			$email.style.borderColor = 'red'
		}
		if ($password.value.length === 0) {
			$password.style.borderColor = 'red'
		}
	} else {
		getRegister('login')
	}
})

function getRegister(endPoint) {
	fetch(`${BASE_URL}/${endPoint}`, {
		method: 'POST',
		body: JSON.stringify({
			email: $email.value,
			password: $password.value,
		}),
		headers: { 'Content-type': 'application/json' },
	})
		.then((response) => {
			response.json()
		})
		.then((res) => {
			console.log(res)
			localStorage.setItem('accessToken', res.accessToken)
			localStorage.setItem('refreshToken', res.refreshToken)
			localStorage.setItem('userId', res.user.id)
		})
	// .catch((err) => {
	// 	console.log(err)
	// })
}
