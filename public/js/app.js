const signInUser = () => {
    //  e.preventDefault()
    // console.log('clicked');
    const data = {
        //name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password-field").value,
    }
    axios.post('/users/login', data)
        .then(function(response) {
            if (response.status == 200) {
                //alert(response.data.msg);
                window.location.href = '/posts'
            }
        })
        .catch(function(error) {
            if (error.response) {
                //alert(error.response.data.error);
                swal(error.response.data.error, "Please try again!", "error");
            }
        });
}
const createUser = () => {
    //  e.preventDefault()
    // console.log('clicked');
    const data = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password-field").value,
    }
    axios.post('/users/register', data)
        .then(function(response) {
            if (response.status == 200) {
                //alert(response.data.msg);
                window.location.href = '/users/login'
            }
        })
        .catch(function(error) {
            if (error.response) {
                swal(error.response.data.error, "Please try again!", "error");
            }
        });
}
const uploadImage = async() => {
    const input = document.querySelector('.drop-zone__input');
    const data = new FormData();
    if (!input.files[0]) {
        alert("Please upload an image")
        return
    }
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
                window.location.href = `/posts/${response.data.id}`
            }
        })
        .catch(function(error) {
            if (error.response) {
                alert(error.response.data.error);
            }
        });
}
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
  
    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
    });
  
    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
      }
    });
  
    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });
  
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });
  
    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
  
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      }
  
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
  
  /**
   * Updates the thumbnail on a drop zone element.
   *
   * @param {HTMLElement} dropZoneElement
   * @param {File} file
   */
  function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
  
    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }
  
    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }
  
    thumbnailElement.dataset.label = file.name;
  
    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
  }
  