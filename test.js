const yt = require(
    './app.js'
)
let f = async() => {
    // let data = await yt.gimmeAll('UCCooOt2LDAfz-5giM99biUQ', 'AIzaSyBWQ8TlTFX-NlJf-KELSfbtk_4ebMj1_3A')
    let data = await yt.gimmeComments('UCCooOt2LDAfz-5giM99biUQ', 'AIzaSyBWQ8TlTFX-NlJf-KELSfbtk_4ebMj1_3A')
    console.log('dfdfs', data.length) //.items.length)
        // return (data)
}
f()