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
                alert(response.data.msg);
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
const uploadImage = async() => {
    const input = document.getElementById('image');
    const data = new FormData();
    data.append('file', input.files[0]);
    data.append('upload_preset', cloudinary.preset);
    data.append('public_id', `posts/${user.id}${Math.floor(Math.random() * 1000000000)}`);
    data.append('api_key', cloudinary.apiKey);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.name}/image/upload`, {
        method: 'POST',
        body: data
    });

    const file = await res.json();
    if (file.secure_url) {
        document.querySelector(".image-container").innerHTML = `<img src=${file.secure_url} alt=${file.asset_id}>`
    }
    //console.log(file.secure_url);
    return file.secure_url;
}
const createPost = async() => {
    const image = await uploadImage()
    const data = {
        title: document.querySelector("#title").value,
        author: user.id,
        content: document.querySelector("#content").value,
        image,
        tag: document.querySelector('#selectInput').value,
        createdAt: new Date(),
    }
    axios.post('/posts/createPost', data)
        .then(function(response) {
            if (response.status == 200) {
                alert(response.data.msg);
            }
        })
        .catch(function(error) {
            if (error.response) {
                alert(error.response.data.error);
            }
        });
}