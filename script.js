const audio = document.getElementById("audio");
const source = document.getElementById("source");
const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const songName = document.getElementById("songName");
const progressBar = document.getElementById("progressBar");

let index = 0;

// A JSON fájlra kapcsolódik
const connectDB = fetch("db.json").then((response) => response.json());

/**
 * Inicializálunk az oldal betöltésekor
 */
window.onload = () => {
  connectDB.then((data) => {
    setData(data, 0);
  });
};

/**
 * Következő zene, a hibakezelés megtörtént
 */
nextButton.addEventListener("click", () => {
  connectDB.then((data) => {
    if (index <= data.data.length - 2) {
      index++;
      setData(data, index);
      playSong();
    } else {
      alert("You've reached the end of the list!");
    }
  });
});

/**
 * Előző zene, a hibakezelés megtörtént
 */
prevButton.addEventListener("click", () => {
  connectDB.then((data) => {
    if (index !== 0) {
      index--;
      setData(data, index);
      playSong();
    } else {
      alert("You are at the top of the list!");
    }
  });
});

/**
 * Következő zene automatikusan, a hibakezelés megtörtént
 */
audio.onended = () => {
  connectDB.then((data) => {
    if (index <= data.data.length - 2) {
      index++;
      setData(data, index);

      playSong();
    } else {
      alert("You are at the top of the list!");
    }
  });
};

/**
 * Állapotjelző frissítése egy megadott arány szerint
 */
audio.addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
});

/**
 * Állapotjelzőbe kattintáskor belepörget a zenébe
 */
progressBar.addEventListener("click", (e) => {
  const width = this.clientWidth;
  const clientX = e.offsetX;

  audio.currentTime = (clientX / width) * audio.duration;
});

const setData = (data, index) => {
  songName.innerHTML = data.data[index].name;
  source.src = `http://docs.google.com/uc?export=open&id=${data.data[index].url}`;
  audio.load();
};

playButton.addEventListener("click", () => {
  const isPLaying = playButton.classList.contains("fa-play");

  isPLaying ? playSong() : pauseSong();
});

/**
 * Lejátsza a zenét és ikont cserél
 */
const playSong = () => {
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then().catch((error) => {
      console.log(error);
    });
  }
};

/**
 * Megállítja a zenét és ikont cserél
 */
const pauseSong = () => {
  const pausePromise = audio.pause();
  playButton.classList.remove("fa-pause");
  playButton.classList.add("fa-play");

  if (pausePromise !== undefined) {
    pausePromise.then().catch((error) => {
      console.log(error);
    });
  }
};