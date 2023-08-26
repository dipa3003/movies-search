// Code when click search-button
const searchButton = document.querySelector(".search-button");
const searchEnter = document.querySelector(".input-keyword");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value); //await sampai resolved
    updateUI(movies);
  } catch (err) {
    // if (err == "Incorrect IMDb ID.") {
    //   console.log("Harus mengisi nama film");
    // } else {
    //   console.log(err);
    // }
    // alert(err);
    const movieContainer = document.querySelector(".movie-container");
    movieContainer.innerHTML = `<h1> ${err}</h1>`;
  }
});

// Code when press Enter on-keyboard
searchEnter.addEventListener("keyup", async function (e) {
  if (e.key == "Enter") {
    try {
      const inputKeyword = document.querySelector(".input-keyword");
      const movies = await getMovies(inputKeyword.value); //await sampai resolved
      updateUI(movies);
    } catch (err) {
      const movieContainer = document.querySelector(".movie-container");
      movieContainer.innerHTML = `<h1> ${err}</h1>`;
    }
  }
});

//function untuk Fetch API
function getMovies(keyword) {
  return fetch("http://www.omdbapi.com/?apikey=e0e0d46a&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

// function looping 10 movies in card
function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// event binding
// harus di binding karna saat function ini dibuat, element dgn class "modal-detail-button" blm ada
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    // console.log(e.target);
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIModal(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch("http://www.omdbapi.com/?apikey=e0e0d46a&i=" + imdbid)
    .then((response) => response.json())
    .then((m) => m);
}

function updateUIModal(m) {
  const movieDetails = showMovieDetails(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetails;
}

// function showCards
function showCards(m) {
  return `<div class="col-md-4 my-3">
                <div class="card">
                <img src="${m.Poster}" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">${m.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                    <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal"
                    data-target="#movieDetailModal" data-imdbid="${m.imdbID}">Show Details</a>
                </div>
                </div>
            </div>`;
}

// function showMovieDetails
function showMovieDetails(m) {
  return `<div class="container-fluid">
                <div class="row">
                <div class="col-md-3">
                    <img src="${m.Poster}" class="img-fluid" />
                </div>
                <div class="col-md">
                    <ul class="list-group">
                    <li class="list-group-item"><h4>${m.Title} ${m.Year}</h4></li>
                    <li class="list-group-item">
                        <strong>Director : </strong>${m.Director}
                    </li>
                    <li class="list-group-item">
                        <strong>Actors : </strong>${m.Actors}
                    </li>
                    <li class="list-group-item">
                        <strong>Writter : </strong>${m.Writer}
                    </li>
                    <li class="list-group-item">
                        <strong>Plot : </strong>${m.Plot}
                    </li>
                    </ul>
                </div>
                </div>
            </div>`;
}
