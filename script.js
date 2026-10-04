const movies = [
  {
    title: "The Last Horizon",
    year: "2026",
    rating: "8.9",
    duration: "2h 18m",
    genre: "Sci-Fi",
    description:
      "Beyond the edge of civilization lies a world nobody was meant to find. A cinematic journey through mystery, survival and the unknown.",
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=90"
  },
  {
    title: "Midnight City",
    year: "2026",
    rating: "8.6",
    duration: "2h 04m",
    genre: "Thriller",
    description:
      "When the city sleeps, secrets begin to move. One night changes everything.",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=90"
  },
  {
    title: "Dark Signal",
    year: "2025",
    rating: "8.4",
    duration: "1h 56m",
    genre: "Mystery",
    description:
      "A mysterious signal appears from somewhere beyond the known world.",
    poster:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=90"
  },
  {
    title: "After Earth",
    year: "2025",
    rating: "8.1",
    duration: "2h 11m",
    genre: "Adventure",
    description:
      "Humanity returns to a world that has forgotten them.",
    poster:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=900&q=90"
  },
  {
    title: "Neon Dreams",
    year: "2026",
    rating: "8.7",
    duration: "2h 01m",
    genre: "Drama",
    description:
      "A young dreamer discovers that the city has a secret side.",
    poster:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=90"
  },
  {
    title: "Lost Planet",
    year: "2025",
    rating: "8.3",
    duration: "2h 22m",
    genre: "Sci-Fi",
    description:
      "Lost millions of miles away from home, a crew searches for a way back.",
    poster:
      "https://images.unsplash.com/photo-1534791547706-3c7b0b5b5c0f?auto=format&fit=crop&w=900&q=90"
  }
];

let watchlist =
  JSON.parse(localStorage.getItem("cinerex_watchlist")) || [];

function saveWatchlist() {
  localStorage.setItem(
    "cinerex_watchlist",
    JSON.stringify(watchlist)
  );
}

function isInWatchlist(title) {
  return watchlist.some(movie => movie.title === title);
}

function showToast(message) {
  let toast = document.getElementById("cinerexToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cinerexToast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.cinerexToastTimer);

  window.cinerexToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function toggleWatchlist(movie) {
  if (isInWatchlist(movie.title)) {
    watchlist = watchlist.filter(
      item => item.title !== movie.title
    );

    showToast(`${movie.title} removed from My List`);
  } else {
    watchlist.push(movie);

    showToast(`${movie.title} added to My List`);
  }

  saveWatchlist();
}

function openMovie(title) {
  const movie = movies.find(
    item =>
      item.title.toLowerCase() ===
      title.toLowerCase()
  );

  if (!movie) return;

  let modal = document.getElementById("movieModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "movieModal";

    modal.innerHTML = `
      <div class="modal-backdrop"></div>

      <div class="movie-modal">

        <button class="modal-close">
          ×
        </button>

        <div class="modal-cover"></div>

        <div class="modal-content">

          <div class="modal-label">
            CINEREX ORIGINAL
          </div>

          <h2 class="modal-title"></h2>

          <div class="modal-meta">
            <span class="modal-year"></span>
            <span>•</span>
            <span class="modal-duration"></span>
            <span>•</span>
            <span class="modal-genre"></span>
            <span>•</span>
            <strong class="modal-rating"></strong>
          </div>

          <p class="modal-description"></p>

          <div class="modal-actions">

            <button class="modal-play">
              ▶ Play
            </button>

            <button class="modal-list">
              ＋ My List
            </button>

          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal
      .querySelector(".modal-backdrop")
      .addEventListener("click", closeMovie);

    modal
      .querySelector(".modal-close")
      .addEventListener("click", closeMovie);
  }

  modal.querySelector(".modal-cover").style.backgroundImage =
    `url("${movie.poster}")`;

  modal.querySelector(".modal-title").textContent =
    movie.title;

  modal.querySelector(".modal-year").textContent =
    movie.year;

  modal.querySelector(".modal-duration").textContent =
    movie.duration;

  modal.querySelector(".modal-genre").textContent =
    movie.genre;

  modal.querySelector(".modal-rating").textContent =
    `★ ${movie.rating}`;

  modal.querySelector(".modal-description").textContent =
    movie.description;

  const listButton =
    modal.querySelector(".modal-list");

  function updateListButton() {
    if (isInWatchlist(movie.title)) {
      listButton.textContent = "✓ In My List";
      listButton.classList.add("active");
    } else {
      listButton.textContent = "＋ My List";
      listButton.classList.remove("active");
    }
  }

  listButton.onclick = () => {
    toggleWatchlist(movie);
    updateListButton();
  };

  modal
    .querySelector(".modal-play")
    .onclick = () => {
      showToast(
        "Connect a licensed or public-domain video source to play."
      );
    };

  updateListButton();

  modal.classList.add("show");

  document.body.style.overflow = "hidden";
}

function closeMovie() {
  const modal =
    document.getElementById("movieModal");

  if (!modal) return;

  modal.classList.remove("show");

  document.body.style.overflow = "";
}

function setupMovieCards() {
  document
    .querySelectorAll(".movie")
    .forEach(card => {
      card.addEventListener("click", () => {
        const title = card.dataset.title;

        if (title) {
          openMovie(title);
        }
      });
    });
}

function setupSearch() {
  const search =
    document.getElementById("search");

  if (!search) return;

  search.addEventListener("input", () => {
    const query =
      search.value.toLowerCase().trim();

    document
      .querySelectorAll(".movie")
      .forEach(card => {
        const title =
          card.dataset.title?.toLowerCase() || "";

        card.style.display =
          !query || title.includes(query)
            ? ""
            : "none";
      });
  });
}

function setupScrollNavbar() {
  const navbar =
    document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background =
        "rgba(7,7,8,.94)";

      navbar.style.backdropFilter =
        "blur(16px)";
    } else {
      navbar.style.background =
        "linear-gradient(to bottom, rgba(0,0,0,.95), rgba(0,0,0,.35), transparent)";

      navbar.style.backdropFilter =
        "none";
    }
  });
}

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeMovie();
    }
  }
);

document.addEventListener(
  "DOMContentLoaded",
  () => {
    setupMovieCards();
    setupSearch();
    setupScrollNavbar();
  }
);
