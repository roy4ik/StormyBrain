//stormy getting data from datamuse

getWordObjects = async(word, relCode = 'trg', max = 7) => {
    apiUrl = 'https://api.datamuse.com/words?rel_' + relCode + '=' + word + '&max=' + max
    data = []
    resp = await fetch(apiUrl) // Call API
    data = await resp.json() // Transform the data into json
        .catch(err => console.log(err))
        // console.log(data)
    return data;
};

createSubNodes = (data) => {
    parentNode = document.getElementById('canvas')
    coords = circleSelection(data) // calculate position and add it to inline style of node
    for (element = 0; element < data.length; ++element) {
        console.log(data[element])
        console.log('Creating node for :' + data[element]['word'])
        subNode = document.createElement("div")
        subNode.innerHTML = data[element]['word']
        subNode.classList.add('subNode')
        subNode.style.left = coords[0][element] + "px"
        subNode.style.top = coords[1][element] + "px"
        subNode.style.position = 'relative'
        parentNode.appendChild(subNode)
        data[element].coords = coords[element]
    }
};

searchWord = async(wordString = "happy") => {
    data = await getWordObjects(wordString)
    createSubNodes(data)
        // circleSelection(data)
};

circleSelection = (data) => {
    radius = 200
    steps = data.length
    originX = 200
    originY = 200
    xValues = []
    yValues = []
    for (let angle = 0; angle < steps; ++angle) {
        xValues[angle] = Math.round(originX + (radius + Math.floor(Math.random() * 50)) * -Math.cos(Math.PI / steps * angle))
        yValues[angle] = Math.round(originY + (radius + Math.floor(Math.random() * 50)) * -Math.sin(Math.PI / steps * angle))
            // console.log('Coordinates are: ' + xValues[angle] + " : " + yValues[angle])
    }
    coords = [xValues, yValues]
    return coords
};

//save data to user

// Search word> save initial word coords 0,0
// select next word > word relation - save next word in userword, inc coords, and rel_score.

save_word_initial = (word) => {
    apiUrl = '/'
    data = {}
    resp = await fetch(apiUrl) // Call API
    data = await resp.json() // Transform the data into json
        .catch(err => console.log(err))
        // console.log(data)
}