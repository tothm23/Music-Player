const audio = document.getElementById("audio");
const source = document.getElementById("source");

const playButton = document.getElementById("playButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");

const songName = document.getElementById("songName");
const progressBar = document.getElementById("progressBar");
const buttons = document.getElementsByTagName("button");

const line = document.getElementsByClassName("line");

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

/**
 * Adatok inicializálása
 * @param {*} data
 * @param {*} index
 */
const setData = (data, index) => {
  songName.innerHTML = data.data[index].name;
  source.src = `http://docs.google.com/uc?export=open&id=${data.data[index].url}`;

  if (data.data[index].theme === "normal") {
    setStyle("normal", "#9E9BA0");
  } else if (data.data[index].theme === "edm") {
    setStyle("edm", "#79419F");
  } else if (data.data[index].theme === "hell") {
    setStyle("hell", "#B81E14");
  }

  audio.load();
};

/**
 * Stílust rendel a zene hangulatához megfelelően
 * @param {*} theme
 * @param {*} color
 */
const setStyle = (theme, color) => {
  const bg = document.querySelector("#bg");
  const main = document.querySelector("main");

  bg.style.backgroundImage = `url(${theme}.jpg)`;

  document.body.style.backgroundImage = `url(${theme}.jpg)`;
  document.getElementById("progress-background").style.backgroundColor = `${color}`;

  main.addEventListener("mouseenter", () => {
    bg.style.filter = "blur(3vh)";
  });

  main.addEventListener("mouseleave", () => {
    bg.style.filter = "";
  });

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].style.border = `1px solid ${color}`;
    buttons[i].style.color = "white";
    buttons[i].style.backgroundColor = `${color}`;

    buttons[i].addEventListener("mouseenter", () => {
      buttons[i].style.backgroundColor = "transparent";
      buttons[i].style.color = `${color}`;
    });

    buttons[i].addEventListener("mouseleave", () => {
      buttons[i].style.backgroundColor = `${color}`;
      buttons[i].style.color = "white";
    });
  }

  for (let i = 0; i < line.length; i++) {
    line[i].style.backgroundColor = `${color}`;
  }
};

/**
 * Esemény rendelése a lejátszáshoz/megállításhoz
 */
playButton.addEventListener("click", () => {
  const isPLaying = playButton.classList.contains("fa-play");

  isPLaying ? playSong() : pauseSong();
});

/**
 * Lejátsza a zenét, ikont cserél, elindítja az animációt
 */
const playSong = () => {
  playButton.classList.remove("fa-play");
  playButton.classList.add("fa-pause");

  for (let i = 0; i < line.length; i++) {
    line[i].style.animation = "wave infinite 0.7s alternate-reverse";
  }

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then().catch((error) => {
      console.log(error);
    });
  }
};

/**
 * Megállítja a zenét, ikont cserél, leállítja az animációt
 */
const pauseSong = () => {
  playButton.classList.remove("fa-pause");
  playButton.classList.add("fa-play");

  for (let i = 0; i < line.length; i++) {
    line[i].style.animation = "";
  }

  const pausePromise = audio.pause();

  if (pausePromise !== undefined) {
    pausePromise.then().catch((error) => {
      console.log(error);
    });
  }
};
