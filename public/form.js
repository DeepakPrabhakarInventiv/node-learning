const weatherForm = document.querySelector('form')
const username = document.getElementById('username');
const email = document.getElementById('email');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    axios.post('/submit', {
        username: username.value,
        email: email.value,
    })
    .then(function (response) {
        document.getElementById("result").innerHTML = response.data;
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

})