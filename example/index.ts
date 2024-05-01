import '../src/index.js'
import '../src/index.css'

let progress = 0
const indicator = document.querySelector('progress-indicator')

setInterval(() => {
    progress += 10
    indicator!.setAttribute('progress', '' + progress)

    if (progress === 100) {
        setTimeout(() => (progress = 0), 3000)
    }
}, 1000)
