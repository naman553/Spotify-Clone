let songs;
let currFolder;
let currentSong = new Audio();
async function getSongs(folder) {
  currFolder = folder
  let a = await fetch(`http://192.168.29.207:3000/Spotify%20Clone/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  let songUL = document.querySelector(".songs ul");
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><div class="flex-row combo">
                                                <img src="assets/music.svg" alt="">
            <div class="about">
        <div>${song.split(`${currFolder}/`)[1].replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
        <div>Artist</div>
    </div>
    </div>
    <div class="flex-row combo1">
    <img src="assets/play.svg" alt="">
    <p>Play Now</p>
    </div></li>`;
  }
  Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {

      // console.log(e.querySelector(".about").firstElementChild.innerHTML);
      playMusic(e.querySelector(".about").firstElementChild.innerHTML);
    })
  });


}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}
const playMusic = (track) => {
  // let audio = new Audio("songs/" + track + ".mp3");
  // audio.play();
  currentSong.src = `${currFolder}/` + track + ".mp3";
  currentSong.play();

  play.src = "assets/pause.svg"
  document.querySelector(".songinfo").innerHTML = track
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
    // console.log(currentSong.duration)
    document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
  })
}
async function displasyAlbums() {
  let a = await fetch("http://192.168.29.207:3000/Spotify%20Clone/songs/");
  let response = await a.text();
  let div=  document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let container = document.querySelector(".container")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  
    if (e.href.includes("/songs")) {
      let folder= e.href.split("/").slice(-2)[0]
      let a = await fetch(`http://192.168.29.207:3000/Spotify%20Clone/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response)
      container.innerHTML = container.innerHTML + `  <div class="cards" data-folder=${folder}>
                        <div class="img">
                            <img class="cardimg" src="http://192.168.29.207:3000/Spotify%20Clone/songs/${folder}/cover.jpeg" alt="Happy hits">
                        </div>
                        <button class="play">
                            <img src="assets/play.svg" alt="play" class="greenbtn">
                        </button>
                        <div class="details">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
                    
                </div>`
    }
  }
  Array.from(document.getElementsByClassName("cards")).forEach(e => {
    e.addEventListener("click", async item => {
      // console.log(item.currentTarget, item.currentTarget.dataset)
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    })
  })
}
async function main() {
  await getSongs("songs/playlist1");
  currentSong.src = songs[0];
  displasyAlbums();
  currentSong.addEventListener('loadedmetadata', function () {
    document.querySelector(".songtime").innerHTML = `00:00/${formatTime(currentSong.duration)}`;
  });
  currentSong.addEventListener('timeupdate', function () {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
    document.querySelector(".line").style.width = currentSong.currentTime / currentSong.duration * 65.5 + "%";

  });

  
  document.querySelector(".songinfo").innerHTML = songs[0].split(`${currFolder}/`)[1].replaceAll("%20", " ").replaceAll(".mp3", "");

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "assets/pause.svg"
      play.style.width = "1.8rem";
    } else {
      currentSong.pause();
      play.src = "assets/play/pause.svg"
      play.style.width = " 1.8rem";

    }
  })

  let width = document.querySelector(".seekbar").getBoundingClientRect().width


  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / width * 100;
    document.querySelector(".circle").style.left = percent + "%";
    document.querySelector(".line").style.width = percent * 0.66 + "%";
    currentSong.currentTime = percent * currentSong.duration / 100;
    // console.log(percent)
  })

  window.addEventListener("keydown", (event) => {
    // console.log("Key pressed:", event.code); // Log all key presses
    if (event.code === "Space") {
      play.click()
    }
  });
  // document.querySelector(".circle").addEventListener("click", (e) => {
  //   let percent = e.offsetX / width *100;

  //   if (percent <= 0.5) {
  //     document.querySelector(".circle").style.left = document.querySelector(".circle").style.left-= (5-percent) + "%";
  //   }
  //   console.log(document.querySelector(".circle").style.left)
  // })

  // console.log(songs)

  // let c = (currentSong.src);
  // console.log(c)
}
// prev.addEventListener("click", () => {
// })
document.getElementById("prev").addEventListener("click", () => {
  let currentIndex = songs.findIndex(song => song === currentSong.src);
  if (currentIndex > 0) {
    currentIndex -= 1; // Move to the previous song
  } else {
    currentIndex = songs.length - 1; // Loop back to the last song
  }
  updateSong(currentIndex);
});

document.getElementById("next").addEventListener("click", () => {
  let currentIndex = songs.findIndex(song => song === currentSong.src);
  if (currentIndex < songs.length - 1) {
    currentIndex += 1; // Move to the next song
  } else {
    currentIndex = 0; // Loop back to the first song
  }
  updateSong(currentIndex);
});

function updateSong(index) {
  currentSong.src = songs[index];
  currentSong.play();
  play.src = "assets/pause.svg";
  document.querySelector(".songinfo").innerHTML = songs[index].split(`${currFolder}/`)[1]
    .replaceAll("%20", " ")
    .replaceAll(".mp3", "");

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    document.querySelector(".line").style.width = (currentSong.currentTime / currentSong.duration) * 65.5 + "%";
  });



}


document.querySelector(".vol>img").addEventListener("click", (e) => {
  console.log(e.target)
  if (e.target.src.includes("assets/volume.svg")) {
    e.target.src =  e.target.src.replace("assets/volume.svg", "assets/mute.svg");
    currentSong.volume = 0;
    document.getElementsByTagName("input")[0].value = 0
  }
  else {
    e.target.src = e.target.src.replace("assets/mute.svg", "assets/volume.svg");
    currentSong.volume = 0.2;
    document.getElementsByTagName("input")[0].value = 20

  }
})


vol.addEventListener("change", (e) => {
  // console.log(e.target.value)
  currentSong.volume = e.target.value / 100

  if (e.target.value == 0) {
    document.querySelector(".volseek").src = "assets/mute.svg";

  }
  else {
    document.querySelector(".volseek").src = "assets/volume.svg";
  }
}


)

main()
