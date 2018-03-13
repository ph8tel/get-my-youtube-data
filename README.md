#Welcome to get-my-youtube-data!
##This is a simple npde helper to get all of a user's data from the youtube API

##What you will need:
* node 7.4 or higher
  To use async await
* axios
```npm install axios --save```
* youtube api key
```https://developers.google.com/youtube/v3/getting-started```

##How it works:

```const getYouTubeData = require('get-my-youtube-data');

let allResults = await getYouTubeData.gimmeAll( <youtubeUserID>, <yourAPIkey>)

console.log('all videos for user', <youtubeUserId>, 'are: ', allResults)

let channelVideos = await 
getYouTubeData.gimmeVideos(<channel-ID>, <yourAPIkey>)

console.log('all videos for channel', <channel-ID>, 'are: ', channelVideos)

let channelComments = await getYouTubeData.gimmeComments(<channel-ID>, <yourAPIkey>)

console.log('all comments for channel', <channel-ID>, 'are: ', channelComments)

let playlistVideos = await getYouTubeData.gimmePlaylist(<playlist-ID>, <yourAPIkey>)

console.log('all videos for playlist', <playlist-ID>, 'are: ', playlistVideos)
```
## Also:
* getPlaylists(<channel-ID>, <yourAPIkey>)
* getChannelInfo(<channel-id>, <yourAPIkey>)
These return promises.