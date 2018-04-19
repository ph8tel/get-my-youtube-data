# Welcome to get-my-youtube-data!
## This is a simple node helper to get all of a user's data from the youtube API

## What you will need:
* node 7.4 or higher
  To use async await

* axios
```npm install axios --save```

* You Tube API key
  * [Tutorial](https://developers.google.com/youtube/v3/getting-started)

 put this API key somewhere safe. Do not publish it to github or deploy it. Bad things can happen. 
* Your You Tube id

  1. Sign in to your You Tube account.
  2. In the top right, click your account icon > settings .
  3. Next to your profile photo, click Advanced.
  4. You'll see your channel's user and channel IDs under "Account information."

## How it works:
[video Tutorial](https://youtu.be/03W_e71rsNk)

* add the package
```
const getYouTubeData = require('get-my-youtube-data');
```
* get comments and video for a specific user
This is where you should start. It will crawl the You Tube API and get all of the data you want.
```
let allResults = await getYouTubeData.gimmeAll( <youtubeUserID>, <yourAPIkey>)

console.log('all data for user', 
<youtubeUserId>, 'are: ', allResults)
```
this is what the results will look like:
```
allResults = {
  videos: [array of video objects],
  comments: [array of comment objects],
  uploadsPlaylist: "playlist ID string to get all videos,
  userId: "user ID string
}
```
* get videos for a specific channel
The channelId is usually the same as the userId. Unless the user has multiple channels

```
let channelVideos = await 
getYouTubeData.gimmeVideos(<channel-ID>, <yourAPIkey>)

console.log('all videos for channel', <uploads-ID>, 'are: ', channelVideos)
```
* get all comments for a channel
```
let channelComments = await getYouTubeData.gimmeComments(<channel-ID>, <yourAPIkey>)

console.log('all comments for channel', <channel-ID>, 'are: ', channelComments)
```
* get all videos for a specific playlist (use uploads to get all)

Every user has an "uploads" playlist. This playlist is made of every uploaded video.
This id is usually similar to your user id. Your user id can start with "UC...", your uploads
playlist can be the same, except it starts with "UU..."
```
let playlistVideos = await getYouTubeData.gimmePlaylist(<playlist-ID>, <yourAPIkey>)

console.log('all videos for playlist', <playlist-ID>, 'are: ', playlistVideos)
```
## Also:
* ```getPlaylists(<channel-ID>, <yourAPIkey>)```
* ```getChannelInfo(<channel-id>, <yourAPIkey>)```
These return promises.