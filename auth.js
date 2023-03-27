const client_id = "40e0eacdf8d744fe8bb0946f7091daf8";
const redirect_uri = "http://127.0.0.1:5555/index.html";
const scope = [
  "user-read-email",
  "app-remote-control",
  "streaming",
  "user-read-private",
  "user-read-playback-state",
];

const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${scope}`;

const params = new URLSearchParams(window.location.hash.substring(1));
const accessToken = params.get("access_token");
// const accessToken =
//"BQDHedXbxx7sZe3IrAmInR_DeV28BLYwuNUprhlIeTMhdlTcM71vDM_vpQXlxSR7Yl-VeYVxlGRN0c6fnj4qLwmlKNVhfDLFtwKBWMtFlWjYq3zbU9Lj6EPuAKEark5pLh83NwTfLA_S3-hMaTOxK7WDbAFjdvYlJr8K9TUceQDzG5Pw3Vf7qPKcqj8GVAbXJy3ucOzrYP5jmZvkY59w8uHY";

//to get the correct permissions for that specific user
function author() {
  console.log("hello");
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}&scope=${scope}`;
  // Get the access token from the URL
}

// console.log(accessToken)

// Create an instance of the Spotify Web API
var spotifyApi = new SpotifyWebApi();

// Set the access token
spotifyApi.setAccessToken(accessToken);

//defining an object player in the Spotify SDK Library api thing
let player;
window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: "My Web Player",
    getOAuthToken: (cb) => {
      cb(accessToken);
    },
    volume: 0.5,
  });
  // player.connect();
  console.log("player has been defined");
};

// define the query parameters
var options = {
  limit: 10, // set the limit to 10 playlists
};

// call the searchPlaylists method with the query and options
spotifyApi
  .searchPlaylists("workout", options)
  .then(function (data) {
    console.log(data);
    // the data object contains an array of playlists
    var playlists = data.playlists.items;
    // iterate through the playlists array and display them on the screen
    var playlistsDiv = document.getElementById("playlists");
    playlistsDiv.innerHTML = "";
    playlists.forEach(function (playlists) {
      var playlistDiv = document.createElement("div");
      playlistDiv.innerHTML = `<h3 onclick=playplaylist(this)>${playlists.name}
      <p style="display:none" id="playlisturl">${playlists.uri}</p></h3>`;
      playlistsDiv.appendChild(playlistDiv);
    });
  })
  .catch(function (error) {
    console.error(error);
  });

//search function for playlists
function search() {
  let searchs = document.getElementById("search-input").value;
  spotifyApi
    .searchPlaylists(searchs, options)
    .then(function (data) {
      console.log(data);
      // the data object contains an array of playlists
      var playlists = data.playlists.items;
      // iterate through the playlists array and display them on the screen
      var playlistsDiv = document.getElementById("playlists");
      playlistsDiv.innerHTML = "";
      playlists.forEach(function (playlists) {
        var playlistDiv = document.createElement("div");
        playlistDiv.innerHTML = `<h3 onclick=playplaylist(this)>${playlists.name}
        <p style="display:none" id="playlisturl">${playlists.uri}</p></h3>`;
        playlistsDiv.appendChild(playlistDiv);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}

//search function for songs
function searchtrack() {
  let searchsd = document.getElementById("search-input").value;
  spotifyApi
    .searchTracks(searchsd, options)
    .then(function (data) {
      console.log("hello");
      console.log(data);
      // the data object contains an array of playlists
      var tracksn = data.tracks.items;
      console.log(tracksn);
      // iterate through the playlists array and display them on the screen
      var playlistsDivd = document.getElementById("playlists");
      playlistsDivd.innerHTML = "";
      tracksn.forEach(function (tracksn) {
        console.log(tracksn.name);
        var playlistDiv = document.createElement("div");
        playlistDiv.innerHTML = `<h3 onclick=playtrack(this)>${tracksn.name}
     <p style="display:none" id="trackurl">${tracksn.uri}</p></h3>
     `;
        playlistsDivd.appendChild(playlistDiv);
      });
    })
    .catch(function (error) {
      console.error(error);
    });
}

//function to play a track once it's clicked on
function playtrack(track) {
  // console.log("player has been defined");
  let turl = track.querySelector("#trackurl").innerHTML;
  console.log(turl);
  const token = accessToken;
  // let device_id = '0d1841b0976bae2a3a310dd74c0f3df354899bc8';
  let mydevice;
  console.log("before player conn");

  player.connect().then((success) => {
    console.log("after player conn");
    if (success) {
      console.log("success acheived");

      //getting the current device id the user is on
      player.addListener("ready", ({ device_id }) => {
        console.log("Connected with Device ID", device_id);
        mydevice = device_id;
      });
      player.addListener("ready", () => {
        // console.log("in funcn");
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${mydevice}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uris: [turl],
            }),
          }
        )
          .then((response) => console.log(response))
          .catch((error) => console.error(error));
      });
    } else {
      console.log("Connection to Spotify Failed");
    }
  });
}

//play a playlist once it is clicked on
function playplaylist(e) {
  console.log("hi im in playplaylist function");
  let mydeviced;
  const token = accessToken;
  let playlisturl = e.querySelector("#playlisturl").innerHTML;
  player.connect().then((success) => {
    if (success) {
      player.addListener("ready", ({ device_id }) => {
        console.log("Connected with Device ID", device_id);
        mydeviced = device_id;
      });
      player.addListener("ready", () => {
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${mydeviced}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              context_uri: playlisturl,
            }),
          }
        )
          .then((response) => {
            console.log(response);
            if (response.ok) {
              console.log("Playlist has started playing");
            } else {
              throw new Error("Failed to start playing playlist");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
    } else {
      console.log("Player not connected successfully");
    }
  });
}

//function to pause the current song
function pause() {
  console.log("in pause funcn");
  let pausebtn = document.getElementById("pause");
  let mydeviceds;
  const tokens = accessToken;
  player.connect().then((success) => {
    if (success) {
      console.log("Player successfully connected");

      fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: "Bearer " + tokens,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log(response);
            return response.json();
          }
          throw new Error("Failed to fetch current playback state");
        })
        .then((data) => {
          let trackUri = data.item.uri;
          let isPlaying = data.is_playing;
          console.log(data);

          // Pause the current playback
          if (isPlaying) {
            fetch("https://api.spotify.com/v1/me/player/pause", {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + tokens,
              },
            }).then((response) => {
              if (!response.ok) {
                throw new Error("Failed to pause playback");
              }
            });
          }

          // Resume the playback
          else {
            fetch("https://api.spotify.com/v1/me/player/play", {
              method: "PUT",
              headers: {
                Authorization: "Bearer " + tokens,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uris: [trackUri] }),
            }).then((response) => {
              if (!response.ok) {
                throw new Error("Failed to resume playback");
              }
            });
          }
        });
    } else {
      console.log("Player has failed to connect");
    }
  });
}

//function to play the next track
function next(){
  const tokend = accessToken;
  fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokend
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to skip to next track');
    }
  })
  .catch(error => {
    console.error(error);
  });
}

//function to play previous track
function previous(){
  const tokenpr = accessToken
  fetch('https://api.spotify.com/v1/me/player/previous', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + tokenpr
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to skip to previous track');
    }
  })
  .catch(error => {
    console.error(error);
  });
}

//fetching user's available devices
//     fetch('	https://api.spotify.com/v1/me/player/devices', {
//   headers: {
//     'Authorization': 'Bearer ' + token
//   }
// }).then(response => {
//   if (response.ok) {
//     return response.json();
//   }
//   throw new Error('Failed to fetch devices');
// }).then(data => {
//   // Use the data to get the device ID and play a track
//   // const deviceId = data.devices[0].id;
//   console.log(data)
//   mydevice = data.devices[1].id;
//   console.log(mydevice);
// })
