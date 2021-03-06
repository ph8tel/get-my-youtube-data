const axios = require('axios')

module.exports = youtubeLogic = {

    replyToComment: (commentId, chanId, parentId, commentText, accessToken, refresh_token, YID, YSEC) => {

        return new Promise(resolve => {
            const google = require('googleapis')
            const youTubeDataApi = google.google.youtube('v3')

            const OAuth2 = google.google.auth.OAuth2

            const oauth2Client = new OAuth2(ID, YSEC, [])

            // put the tokens in the header
            oauth2Client.setCredentials({
                refresh_token: refresh_token,
                access_token: accessToken
            });

            //default set to tokens are in header
            google.google.options({ auth: oauth2Client })

            //build youtube commentResource object for request body
            let params = {
                auth: oauth2Client,
                part: "snippet",
                resource: {
                    snippet: {
                        channelId: chanId,
                        topLevelComment: {
                            snippet: {
                                textOriginal: commentText
                            }
                        },
                        videoId: parentId,
                        commentId: commentId,
                    }
                }
            }
            youTubeDataApi.commentThreads.insert(params, (err, info) => {
                if (err) {
                    console.log('Failure posting comment. This is how you messed up:', err.message);
                    resolve("failed posting comment");
                } else {
                    console.log('comment posted', info.statusText);
                    resolve("posted comment");
                }
            });
        })
    },

    addComment: (chanId, parentId, commentText, accessToken, refresh_token, YID, YSEC) => {

        return new Promise(resolve => {

            const google = require('googleapis')
            const youTubeDataApi = google.google.youtube('v3')
            const OAuth2 = google.google.auth.OAuth2
            const oauth2Client = new OAuth2(YID, YSEC, [])

            // put the tokens in the header
            oauth2Client.setCredentials({
                refresh_token: refresh_token,
                access_token: accessToken
            });

            //default set to tokens are in header
            google.google.options({ auth: oauth2Client })

            //build youtube commentResource object for request body
            let params = {
                auth: oauth2Client,
                part: "snippet",
                resource: {
                    snippet: {
                        channelId: chanId,
                        videoId: parentId,
                        topLevelComment: {
                            snippet: {
                                textOriginal: commentText
                            }
                        }
                    }
                }
            }

            youTubeDataApi.commentThreads.insert(params, (err, info) => {
                if (err) {
                    console.log('Failure posting comment. This is how you messed up:', err.message);
                    resolve("failed posting comment");
                } else {
                    console.log('comment posted', info.statusText);
                    resolve("posted comment");
                }
            })

        })

    },

    getPlaylistItems: (chanID, API_KEY, token) => {

        let params = {
            playlistId: chanID,
            maxResults: '50',
            part: 'snippet,contentDetails',
            key: API_KEY
        }

        if (token) {
            params.pageToken = token
        }

        return new Promise(resolve => {
            axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                params: params
            }).then(playlists => {
                let videoObjects = playlists.data.items.map(e => {
                    return {
                        channelId: e.snippet.channelId,
                        videoId: e.contentDetails.videoId,
                        title: e.snippet.title,
                        description: e.snippet.description,
                        thumbnails: e.snippet.thumbnails
                    }
                })

                youtubeLogic.videoHolder = youtubeLogic.videoHolder.concat(videoObjects)

                if (playlists.data.nextPageToken) {
                    console.log('Found another page of videos, current count:', youtubeLogic.videoHolder.length)
                    resolve(youtubeLogic.getPlaylistItems(chanID, API_KEY, playlists.data.nextPageToken))
                } else {
                    console.log('done getting all videos with', youtubeLogic.videoHolder.length)
                    resolve(youtubeLogic.videoHolder)
                }

            }).catch(err => {
                console.error('lists catch ran error', err.message)
                resolve(err)
            })
        })
    },

    videoHolder: [],

    getUploadedVideos: (uploadsID, API_KEY, token) => {

        return new Promise(resolve => {
            let params = {
                part: 'snippet,contentDetails',
                playlistId: uploadsID,

                maxResults: '50',
                key: API_KEY
            }

            if (token) {
                params.pageToken = token
            }

            axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                params: params
            }).then(allVideos => {
                let formattedVideos = allVideos.data.items.map(youtubeLogic.formattVideos)
                youtubeLogic.videoHolder = youtubeLogic.videoHolder.concat(formattedVideos)

                if (allVideos.data.nextPageToken) {
                    resolve(youtubeLogic.getUploadedVideos(uploadsID, API_KEY, token))
                } else {
                    resolve(youtubeLogic.videoHolder)
                }

            }).catch(err => {
                console.error('catch in get uploaded', err.response.data)
                resolve(err.message)
            })
        })
    },

    formattVideos: (e) => {
        return {
            title: e.snippet.title,
            description: e.snippet.description,
            thumbnails: e.snippet.thumbnails,
            videoId: e.contentDetails.videoId,
            date: e.contentDetails.videoPublishedAt
        }
    },

    getChannelInfo: function(id, API_KEY) {

        return new Promise(resolve => {
            axios.get('https://www.googleapis.com/youtube/v3/channels', {
                    params: {
                        id: id,
                        part: 'snippet,contentDetails,statistics',
                        maxResults: '50',
                        key: API_KEY
                    }
                })
                .then(deets => resolve(deets))
                .catch(err => console.log('error in get chan infoerr', err.message))
        })
    },



    commentHolder: [],

    getNextCommentPage: (pageToken, channelID, API_KEY) => {
        return new Promise(resolve => {
            axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                    params: {
                        allThreadsRelatedToChannelId: channelID,
                        part: 'snippet,replies',
                        maxResults: '100',
                        pageToken: pageToken,
                        key: API_KEY
                    }
                })
                .then(allComments => {
                    youtubeLogic.commentHolder = youtubeLogic.commentHolder.concat(allComments.data.items.map(this.commentFormatter))
                    if (allComments.data.nextPageToken) {
                        youtubeLogic.getNextCommentPage(allComments.data.nextPageToken, channelID, API_KEY)
                    } else {
                        resolve(youtubeLogic.commentHolder)
                    }
                }).catch(err => {
                    resolve(err.message)
                })
        })
    },
    getCommentsForVideo: async(videoId, API_KEY, token) => {

        return new Promise(resolve => {
            let commentHolder = []
            let params = {
                videoId: videoId,
                part: 'snippet,replies',
                maxResults: '100',
                key: API_KEY
            }
            if (token) {
                params.pageToken = token
            }
            axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                params: params
            }).then(async function(allComments) {

                if (allComments.data.nextPageToken) {

                    youtubeLogic.commentHolder = youtubeLogic.commentHolder.concat(allComments.data.items.map(youtubeLogic.commentFormatter))
                    console.log('found another page of comments, current count:', youtubeLogic.commentHolder.length)

                    resolve(youtubeLogic.getCommentsForVideo(channelID, API_KEY, allComments.data.nextPageToken))

                } else {
                    let formattedComments = allComments.data.items.map(youtubeLogic.commentFormatter)
                    console.log('finished gettting comments total:', formattedComments.length + youtubeLogic.commentHolder.length)
                    resolve(youtubeLogic.commentHolder.concat(formattedComments))
                }
            }).catch(err => {
                console.log('error here is', err.message)
                resolve(err.message)
            })
        })
    },
    getComments: async(channelID, API_KEY, token) => {

        return new Promise(resolve => {
            let commentHolder = []
            let params = {
                allThreadsRelatedToChannelId: channelID,
                part: 'snippet,replies',
                maxResults: '100',
                key: API_KEY
            }
            if (token) {
                params.pageToken = token
            }
            axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                params: params
            }).then(async function(allComments) {
                allComments.data.items.forEach(c => {
                    if (c.replies) {
                        console.log('found reply to comment')
                        let replies = c.replies.comments.map(youtubeLogic.commentReplyFormatter)
                        youtubeLogic.commentHolder = youtubeLogic.commentHolder.concat(replies)
                    }
                })
                if (allComments.data.nextPageToken) {

                    youtubeLogic.commentHolder = youtubeLogic.commentHolder.concat(allComments.data.items.map(youtubeLogic.commentFormatter))
                    console.log('found another page of comments, current count:', youtubeLogic.commentHolder.length)

                    resolve(youtubeLogic.getComments(channelID, API_KEY, allComments.data.nextPageToken))

                } else {
                    let formattedComments = allComments.data.items.map(youtubeLogic.commentFormatter)
                    console.log('finished gettting comments total:', formattedComments.length + youtubeLogic.commentHolder.length)
                    resolve(youtubeLogic.commentHolder.concat(formattedComments))
                }
            }).catch(err => {
                console.log('error here is', err.message)
                resolve(err.message)
            })
        })
    },

    commentFormatter: (e) => {
        let comment = e.snippet.topLevelComment.snippet.textDisplay
        let newFormat = {
            commentId: e.snippet.topLevelComment.id,
            author: e.snippet.topLevelComment.snippet.authorDisplayName,
            authorThumbnail: e.snippet.topLevelComment.snippet.authorProfileImageUrl,
            videoId: e.snippet.topLevelComment.snippet.videoId,
            comment: comment,
            likeCount: e.snippet.topLevelComment.snippet.likeCount,
            publishedAt: e.snippet.topLevelComment.snippet.publishedAt

        }
        if (comment.split('!').length > 1) {
            newFormat.color = 'rgb(255, 99, 132)'
        }
        if (comment.split('?').length > 1) {
            newFormat.color = 'rgb(54, 162, 235)'
        }
        return newFormat
    },
    commentReplyFormatter: (e) => {
        let comment = e.snippet.textDisplay
        let newFormat = {
            parentId: e.snippet.parentId,
            author: e.snippet.authorDisplayName,
            authorThumbnail: e.snippet.authorProfileImageUrl,
            videoId: e.snippet.videoId,
            comment: comment,
            likeCount: e.snippet.likeCount,
            publishedAt: e.snippet.publishedAt

        }
        if (comment.split('!').length > 1) {
            newFormat.color = 'rgb(255, 99, 132)'
        }
        if (comment.split('?').length > 1) {
            newFormat.color = 'rgb(54, 162, 235)'
        }
        return newFormat
    },
    getRepliesToComment: (commentId, API_KEY) => {
        //returns an array of replies to a comment by id
        return new Promise(resolve => {
            axios.get('https://www.googleapis.com/youtube/v3/comments', {
                    part: "snippet",
                    maxResults: 50,
                    parentId: commentId,
                    key: API_KEY
                })
                .then(comments => {
                    resolve(comments.data.items)
                }).catch(err => {
                    resolve(err.message)
                })
        })
    },

    getReplies: (commentId, API_KEY) => {
        //returns an array of replies to a comment by id
        return new Promise(resolve => {
            axios.get('https://www.googleapis.com/youtube/v3/comments', {
                    part: "snippet",
                    maxResults: 50,
                    parentId: commentId,
                    key: API_KEY
                })
                .then(comments => {
                    resolve(comments.data.items)
                }).catch(err => {
                    resolve(err.message)
                })
        })
    },
    gimmeVideos: async(chanID, API_KEY) => {
        let uploadsID = 'UU' + chanID.slice(2)
        let videos = await youtubeLogic.getPlaylistItems(uploadsID, API_KEY)

        return videos
    },

    gimmeComments: async(chanID, API_KEY) => {
        let commentObjects = await youtubeLogic.getComments(chanID, API_KEY)
        return commentObjects
    },

    gimmePlaylist: async(uploadsID, API_KEY) => {
        let videoObjects = await youtubeLogic.getPlaylists(uploadsID, API_KEY)
        return videoObjects
    },

    gimmeAll: async function(userID, API_KEY) {
        let channelInfo = await this.getChannelInfo(userID, API_KEY)
        if (channelInfo.data.items.length) {

            let uploadsID = channelInfo.data.items[0].contentDetails.relatedPlaylists.uploads;
            let channelId = channelInfo.data.items[0].id

            let commentObjects = await this.getComments(channelId, API_KEY)
            let videoObjects = await this.getPlaylistItems(uploadsID, API_KEY)

            let responseObject = {
                videos: videoObjects,
                comments: commentObjects
            }

            youtubeLogic.videoHolder = []
            youtubeLogic.commentHolder = []

            return responseObject

        } else {

            return {
                videos: [],
                comments: []
            }
        }
    }
}