const weatherForm = document.querySelector('form')
const search = document.querySelector('input');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log();

    axios.post('/submit', {
        search: search.value,
    })
    .then(function (response) {
        console.log(response);
        document.getElementById('result').innerHTML = `<h2>Search Result:</h2><p>${response.data}</p>`;
    })
    .catch(function (error) {
        console.log(error);
    });

})