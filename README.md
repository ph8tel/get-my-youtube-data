# Welcome to get-my-youtube-data!
## This is a simple npde helper to get all of a user's data from the youtube API

## What you will need:
* node 7.4 or higher
  To use async await
* axios
```npm install axios --save```
* youtube api key
```https://developers.google.com/youtube/v3/getting-started```

## How it works:
* add the package
```
const getYouTubeData = require('get-my-youtube-data');
```
* get comments and video for a specific user
```
let allResults = await getYouTubeData.gimmeAll( <youtubeUserID>, <yourAPIkey>)

console.log('all videos for user', 
<youtubeUserId>, 'are: ', allResults)
```
* get videos for a specific channel
```
let channelVideos = await 
getYouTubeData.gimmeVideos(<channel-ID>, <yourAPIkey>)

console.log('all videos for channel', <channel-ID>, 'are: ', channelVideos)
```
* get all comments for a channel
```
let channelComments = await getYouTubeData.gimmeComments(<channel-ID>, <yourAPIkey>)

console.log('all comments for channel', <channel-ID>, 'are: ', channelComments)
```
* get all videos for a specific playlist (use uploads to get all)
```
let playlistVideos = await getYouTubeData.gimmePlaylist(<playlist-ID>, <yourAPIkey>)

console.log('all videos for playlist', <playlist-ID>, 'are: ', playlistVideos)
```
## Also:
* ```getPlaylists(<channel-ID>, <yourAPIkey>)```
* ```getChannelInfo(<channel-id>, <yourAPIkey>)```
These return promises.