const signInUser = () => {
    //  e.preventDefault()
    // console.log('clicked');
    const data = {
        //name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    }
    axios.post('/users/login', data)
        .then(function(response) {
            if (response.status == 200) {
                window.location.href = '/posts'
            }
        })
        .catch(function(error) {
            if (error.response) {
                alert(error.response.data.error);
            }
        });
}
const createUser = () => {
    //  e.preventDefault()
    // console.log('clicked');
    const data = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
    }
    axios.post('/users/register', data)
        .then(function(response) {
            if (response.status == 200) {
                alert(response.data.msg);
                window.location.href = '/users/login'
            }
        })
        .catch(function(error) {
            if (error.response) {
                alert(error.response.data.error);
            }
        });
}