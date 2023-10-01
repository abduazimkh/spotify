const LikedTrackId = JSON.parse(localStorage.getItem("likedTrack"));
const playlistTracks = document.querySelector("#playlists-tracks");

const ACCESS_TOKEN = localStorage.getItem("access_token");

LikedTrackId.forEach(el => {
    console.log(el.track_href);
    fetch(`${el.track_href}`,{
        headers: {
            "Authorization": ACCESS_TOKEN
        }
    }).then(response => response.json())
    .then(data => renderPlayListInfo(data))
})

function renderPlayListInfo(likedPlaylistData){
    console.log(likedPlaylistData);
    const trackItemElement = document.createElement("div");
        trackItemElement.className = " p-[10px] text-[#fff] gap-x-[10px]"
        trackItemElement.innerHTML = `
            <div class="flex items-center gap-x-[10px]">
            <p class="text-[22px] text-[gray] mr-[15px]">${""}</p>
            <img data-track-number="${""}"  class="w-[80px] rounded-lg play-from-list" src="${likedPlaylistData.album.images[1].url}"/>
            <div class="flex-1">
                <h3 class="text-[22px]">${likedPlaylistData.name}</h3>
                <p class="text-[gray]">${likedPlaylistData.artists[0].name}</p>
            </div>
            <div class="flex gap-x-[10px] text-[20px]">
                <i data-liked-track="${likedPlaylistData.id}" class="bi bi-heart-fill text-[#fff] text-[20px]"></i>
                <p class="text-[gray]">${Math.floor(likedPlaylistData.duration_ms / 1000 / 60) + " : " + Math.floor(likedPlaylistData.duration_ms / 1000 % 60)}</p>
            </div>
            </div>
        `;
    playlistTracks.appendChild(trackItemElement)





    if(likedPlaylistData !== localStorage.getItem("lastPlayListId")){
        localStorage.removeItem('currentAudioNumber')
    }
    let currentAudioNumber = +localStorage.getItem("currentAudioNumber") || 0;
    let currentTrackURL = tracks[currentAudioNumber].track.preview_url

    playBtn.addEventListener("click", () => {
        localStorage.setItem("currentAudioNumber", localStorage.getItem("currentAudioNumber") || 0);
        if(!audio.getAttribute("src")){
            audio.src = currentTrackURL
        }
        audio.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "flex";
        audio.volume = +localStorage.getItem("currentAudioVolume") || 0.5;
        renderPlayerInfo(+localStorage.getItem("currentAudioNumber"))
    })

    pauseBtn.addEventListener("click", () => {
        audio.pause();
        playBtn.style.display = "flex";
        pauseBtn.style.display = "none";
        renderPlayerInfo(+localStorage.getItem("currentAudioNumber"))
    })

    nextTrackBtn.addEventListener("click", () => {
        let nextTrackURL = tracks[+localStorage.getItem("currentAudioNumber") + 1].track.preview_url;
        localStorage.setItem("currentAudioNumber", +localStorage.getItem("currentAudioNumber") + 1)
        audio.src = nextTrackURL;
        audio.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "flex";
        renderPlayerInfo(+localStorage.getItem("currentAudioNumber"))
    })

    prevTrackBtn.addEventListener("click", () => {
        if(+localStorage.getItem("currentAudioNumber") >= 1){
            var prevTrackURL = tracks[+localStorage.getItem("currentAudioNumber") - 1].track.preview_url;
            localStorage.setItem("currentAudioNumber", +localStorage.getItem("currentAudioNumber") - 1);
        }else{
            var prevTrackURL = tracks[0].track.preview_url;
            localStorage.setItem("currentAudioNumber", 0);
        }
        audio.src = prevTrackURL;
        audio.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "flex";
        renderPlayerInfo(+localStorage.getItem("currentAudioNumber"));
    })

    shuffleTrackbtn.addEventListener("click", () => {
        let shuffledTrackId = Math.floor(Math.random() * tracks.length)
        let shuffledTrackURL = tracks[shuffledTrackId].track.preview_url;
        localStorage.setItem("currentAudioNumber", shuffledTrackId);
        audio.src = shuffledTrackURL;
        audio.play()
        playBtn.style.display = "none";
        pauseBtn.style.display = "flex";
        renderPlayerInfo(+localStorage.getItem("currentAudioNumber"))

    })
    localStorage.setItem("lastPlayListId", new URLSearchParams(location.search).get("playlistId"));
    function renderPlayerInfo(currentPlayingTrackNumber){
        let playingTrack = tracks[currentPlayingTrackNumber];
        playerTrackImage.src = playingTrack.track.album.images[0].url
        playerTrackName.innerHTML = playingTrack.track.name
        playerTrackArtist.innerHTML = playingTrack.track.artists[0].name;
        // playNextTrackAfterTimeline(currentPlayingTrackNumber)
    }
    renderPlayerInfo(+localStorage.getItem("currentAudioNumber"))

    playlistTracks.addEventListener("click", (e) => {
        if(e.target.classList.contains("play-from-list")){
            let chosenTrackNumber = +e.target.dataset.trackNumber;
            localStorage.setItem("currentAudioNumber", chosenTrackNumber);
            let chosenTrackURL = tracks[chosenTrackNumber].track.preview_url;
            audio.src = chosenTrackURL;
            audio.play()
            playBtn.style.display = "none";
            pauseBtn.style.display = "flex";
            renderPlayerInfo(+localStorage.getItem("currentAudioNumber"))
        }
    })

    timeline.addEventListener("click", (e) => {
        const offsets = e.target.getBoundingClientRect();
        const x = e.clientX - offsets.left;
        let selectedPart = 100 / 500 * x;
        timelineFill.style.width = selectedPart + "%"
        if(!audio.getAttribute("src")){
            audio.src = currentTrackURL
        }
        audio.currentTime = 29 / 100 * selectedPart;
        audio.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "flex";
    })

    setInterval(() => {
        timelineFill.style.width = audio.currentTime * 3.36 + "%";
    }, 100)





}

playerVolumeAdjuster.addEventListener("input", (e) => {
    audio.volume = +e.target.value / 100
    localStorage.setItem("currentAudioVolume", +e.target.value / 100);
})
