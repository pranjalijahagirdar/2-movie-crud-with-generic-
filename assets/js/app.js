const cl=console.log;

const movieContainer = document.getElementById('movieContainer')
const addMovie = document.getElementById('addMovie')
const closeForm = document.getElementById('closeForm')
const title = document.getElementById('title')
const description = document.getElementById('description')
const rating = document.getElementById('rating')
const genre = document.getElementById('genre')
const movieAddbtn = document.getElementById('movieAddbtn')
const UpdatemovieBtn = document.getElementById('UpdatemovieBtn')
const backDrop = document.getElementById('backDrop')
const spinner = document.getElementById('spinner')
const movieForm = document.getElementById('movieForm')
const formClose = document.querySelectorAll('.formClose')
const poster = document.getElementById('poster')
const movieFormTitle = document.getElementById('movieFormTitle')


const BASE_URL = `https://crud-6b7ce-default-rtdb.firebaseio.com`
const MOVIES_URL = `${BASE_URL}/movies.json`;

function showSpinner(){
    spinner.classList.remove('d-none')
}
function hideSpinner(){
    spinner.classList.add('d-none')
}

const state={
    moviesArr:[],
    editId:null
}

function setRating(rating){
    if(rating>=5 && rating <=10){
        return "badge badge-warning"
    }else if(rating>=3 && rating <=5){
        return "badge badge-success"
    }else{
        return "badge badge-danger"
    }
}

function snackbar(msg, icon){
    Swal .fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}

function ObjToArr(data){
    for(const key in data){
        data[key].id = key;
        state.moviesArr.unshift(data[key])
    }
}

function makeapicall(URL, methodName, body=null){
    return fetch(URL,{
        method:methodName,
        headers:{
            "Content-type":"application/json",
            "Auth":"TOKEN JWT form LS",
        },
        body : body?JSON.stringify(body):null
    })
    .then(res=>{
        if(!res.ok){
            throw new Error()
        }
        return res.json()
    })
}
fetchMovie()

//read

function fetchMovie(){
    showSpinner();
    makeapicall(MOVIES_URL, "GET")
        .then(data=>{
            cl(data);
            ObjToArr(data);
            oncreateMovie(state.moviesArr);
        })
        .catch(err=>{
            cl(err);
            snackbar(err, 'error');
        })
        .finally(()=>{
            hideSpinner();
        });
    }

function oncreateMovie(arr){
    let result = ``;
    arr.forEach((ele)=>{
        result += `
        <div class="col-md-3 mb-3" id="${ele.id}">
            <div class="card h-100 movieCard">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <h3 class="m-0">${ele.title}</h3>
                            <small class="text-right pr-3">
                                Updated at : ${ele.updatedAt}
                            </small>
                        </div>
                        <div class="col-2">
                            <h5 class="m-0">
                                <span class="badge ${setRating(ele.rating)}">
                                    ${ele.rating}
                                </span>
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="card-body py-0">
                    <figure class="m-0">
                        <img src="${ele.poster}" 
                             alt="${ele.title}">
                        <figcaption>
                            <h5>${ele.title}</h5>
                            <h4>Genre: ${ele.genre}</h4>
                            <p>${ele.description}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button 
                        onclick="EditMovie(this)"
                        class="btn btn-sm net-sec-btn"
                        type="button">
                        EDIT
                    </button>
                    <button 
                        onclick="DeleteMovie(this)"
                        class="btn btn-sm net-pri-btn"
                        type="button">
                        Remove
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    movieContainer.innerHTML = result;
}

//create

function onAddMovie(eve){
    eve.preventDefault()
    const movieObj={
        title:title.value,
        genre:genre.value,
        poster:poster.value,
        rating:rating.value,
        description:description.value,
        createdAt:new Date(),
        updatedAt:new Date()
    }
    showSpinner()
    makeapicall(MOVIES_URL, "POST", movieObj)
    .then(res=>{
        movieObj.id = res.name,
        state.moviesArr.unshift(movieObj)
        let newMovie = document.createElement('div')
        newMovie.className = "col-md-3 mb-3"
        newMovie.id = movieObj.id
        newMovie.innerHTML = `<div class="card movieCard h-100">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <h3 class="m-0">${movieObj.title}</h3>
                            <small class="text-right pr-3">
                                Updated at : ${movieObj.updatedAt}
                            </small>
                        </div>
                        <div class="col-2">
                            <h5 class="m-0">
                                <span class="badge ${setRating(movieObj.rating)}">
                                    ${movieObj.rating}
                                </span>
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="card-body py-0">
                    <figure class="m-0">
                        <img src="${movieObj.poster}" 
                             alt="${movieObj.title}">
                        <figcaption>
                            <h5>${movieObj.title}</h5>
                            <h4>Genre: ${movieObj.genre}</h4>
                            <p>${movieObj.description}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button 
                        onclick="EditMovie(this)"
                        class="btn btn-sm net-sec-btn"
                        type="button">
                        EDIT
                    </button>
                    <button 
                        onclick="DeleteMovie(this)"
                        class="btn btn-sm net-pri-btn"
                        type="button">
                        Remove
                    </button>
                </div>
            </div>`

            movieContainer.prepend(newMovie);
            movieForm.reset()
            movieForm.classList.remove('active')
            backDrop.classList.remove('active')

            snackbar('new movie card added successfully !!!', 'success')
    })
    .catch(err=>{
        snackbar(err, 'error')
    })
    .finally(()=>{
        hideSpinner()
    })
}

//edit

function EditMovie(ele){
    let EDIT_ID = ele.closest('.col-md-3').id;
    state.editId = EDIT_ID
    let EDIT_URL = `${BASE_URL}/movies/${EDIT_ID}.json`;
    showSpinner()
    makeapicall(EDIT_URL,"GET")
    .then(res=>{
        cl(res)
        title.value = res.title;
        poster.value = res.poster;
        description.value = res.description;
        genre.value = res.genre;
        rating.value = res.rating;
        movieFormTitle.innerHTML = "Update Movie"
        movieAddbtn.classList.add('d-none')
        UpdatemovieBtn.classList.remove('d-none')
        backDrop.classList.add('active');
        movieForm.classList.add('active');

    })
    .catch(err=>{
        snackbar(err, 'error')
    })
    .finally(()=>{
        hideSpinner()
    })
}

//update

function onUpdate(){
    let UPDATE_ID = state.editId;
    let UPDATE_URL = `${BASE_URL}/movies/${UPDATE_ID}.json`
    let oldObj = state.moviesArr.find(u => u.id === UPDATE_ID)
    cl(oldObj)
    let updateObj ={
        title :title.value,
        poster:poster.value,
        description:description.value,
        rating:rating.value,
        genre:genre.value,
        createdAt: oldObj.createdAt,
        updatedAt:new Date(),
        id:UPDATE_ID
    }
    showSpinner()
    makeapicall(UPDATE_URL,"PATCH",updateObj)
    .then(res =>{
        cl(res)
        let getIndex = state.moviesArr.findIndex(i=> i.id === UPDATE_ID)
        // state.editId = null;
        state.moviesArr[getIndex] = updateObj;
        let col = document.getElementById(UPDATE_ID)
        col.innerHTML = `<div class="card h-100 movieCard">
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <h3 class="m-0">${updateObj.title}</h3>
                            <small class="text-right pr-3">
                                Updated at : ${updateObj.updatedAt}
                            </small>
                        </div>
                        <div class="col-2">
                            <h5 class="m-0">
                                <span class="badge ${setRating(updateObj.rating)}">
                                    ${updateObj.rating}
                                </span>
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="card-body py-0">
                    <figure class="m-0">
                        <img src="${updateObj.poster}" 
                             alt="${updateObj.title}">
                        <figcaption>
                            <h5>${updateObj.title}</h5>
                            <h4>Genre: ${updateObj.genre}</h4>
                            <p>${updateObj.description}</p>
                        </figcaption>
                    </figure>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button 
                        onclick="EditMovie(this)"
                        class="btn btn-sm net-sec-btn"
                        type="button">
                        EDIT
                    </button>
                    <button 
                        onclick="DeleteMovie(this)"
                        class="btn btn-sm net-pri-btn"
                        type="button">
                        Remove
                    </button>
                </div>
            </div>`
    movieAddbtn.classList.remove('d-none')
    UpdatemovieBtn.classList.add('d-none')
     movieForm.reset()
     movieForm.classList.remove('active')
     backDrop.classList.remove('active')
    snackbar('Movie updated successfully !!!', 'success')
    })
    .catch(err=>{
        snackbar(err, 'error')
    })
    .finally(()=>{
        hideSpinner()
    })

}


//delete

function DeleteMovie(ele){
    let removeId = ele.closest('.col-md-3').id
    Swal.fire({
  title: "Are you sure?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, Remove it!"
}).then((result) => {
  if (result.isConfirmed) {
    showSpinner()
    let REMOVE_URL = `${BASE_URL}/movies/${removeId}.json`;
    makeapicall(REMOVE_URL,"DELETE")
    .then(res => {
        let getIndex = state.moviesArr.findIndex(m=>m.id === removeId)
        state.moviesArr.splice(getIndex,1)
        ele.closest('.col-md-3').remove()
        snackbar(`The movie is removed successfully !!`,'success')
    })
    .catch(err =>{
        snackbar(err,'error')
    })
    .finally(()=>{
        hideSpinner()
    })
  }
});

}

addMovie.addEventListener('click', function () {
    backDrop.classList.add('active')
    movieForm.classList.add('active')
})

formClose.forEach(function(ele){
    ele.addEventListener('click', function(){
        backDrop.classList.remove('active')
        movieForm.classList.remove('active')
        movieForm.reset()
    })
})
movieForm.addEventListener('submit', onAddMovie)
UpdatemovieBtn.addEventListener('click', onUpdate)