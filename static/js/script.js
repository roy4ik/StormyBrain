//stormy getting data from datamuse

getWordObjects = async(word, relCode = 'trg', max = 7) => {
    apiUrl = 'https://api.datamuse.com/words?rel_' + relCode + '=' + word + '&max=' + max
    data = []
    resp = await fetch(apiUrl) // Call API
        .catch(err => console.log(err))
    data = await resp.json() // Transform the data into json
    return data;
};

// creating subnodes for words searched and displaying in semi-circle
createSubNodes = (data, originXY) => {
    parentNode = document.getElementById('canvas')
    coords = circleSelection(data, originXY) // calculate position and add it to inline style of node
    nodes = []
    for (element = 0; element < data.length; ++element) {
        console.log('Creating node for :' + data[element]['word'])
        subNode = document.createElement("div")
        subNode.innerHTML = data[element]['word']
        subNode.classList.add('subNode')
        subNode.style.left = coords[0][element] + "px"
        subNode.style.top = coords[1][element] + "px"
        subNode.style.height = 1.5 + 'em';
        subNode.style.width = 6 + 'em';
        subNode.style.position = 'relative'
        parentNode.appendChild(subNode)
        nodes.push(subNode)
    }
    return nodes
};

searchWord = async(wordString, originXY) => {
    console.log("searching for word :" + wordString)
    data = await getWordObjects(wordString)
    return createSubNodes(data, originXY)
};

circleSelection = (data, originXY) => {
    radius = 200
    steps = data.length
    xValues = []
    yValues = []
    for (let angle = 0; angle < steps; ++angle) {
        xValues[angle] = Math.round(originXY[0] + (radius + Math.floor(Math.random() * 50)) * -Math.cos(Math.PI / steps * angle))
        yValues[angle] = Math.round(originXY[1] + (radius + Math.floor(Math.random() * 50)) * -Math.sin(Math.PI / steps * angle))
            // console.log('Coordinates are: ' + xValues[angle] + " : " + yValues[angle])
    }
    coords = [xValues, yValues]
    return coords
};

//save data to storm

// Search word> save initial word coords 0,0
// select next word > word relation - save next word in userword, inc coords, and rel_score.

save_word = async(subNode) => {
    word_to_save = subNode.innerHTML
    coords_x = subNode.offsetLeft
    console.log("width subnode:" + subNode.offsetLeft)
    coords_y = subNode.offsetTop
    console.log("height subnode:" + subNode.offsetTop)
    apiUrl = storm + '/save-word/word=' + word_to_save + '/coords=' + coords_x + '&' + coords_y;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))
    return subNode
};


display_catalyst = (catalyst) => {
    parentNode = document.getElementById('canvas')
        // calculate position and add it to inline style of node
    console.log('Creating node for :' + catalyst)
    subNode = document.createElement("div")
    subNode.innerHTML = catalyst
    subNode.classList.add('subNode')
    subNode.style.left = 0.5 * parentNode.clientWidth + 'px'
    console.log(0.5 * parentNode.clientWidth)
    subNode.style.top = 0.8 * parentNode.clientHeight + 'px'
    console.log(0.8 * parentNode.clientHeight)
    subNode.style.height = 1.5 + 'em'
    subNode.style.width = 6 + 'em'
    subNode.style.position = 'relative'
    parentNode.appendChild(subNode)
    return subNode
}

catalyze = (catalyst) => {
        newCatalyst = save_word(display_catalyst(catalyst))
        originXY = [newCatalyst.style.left, newCatalyst.style.top]
        results = searchWord(catalyst, originXY)
    }
    // todo: create subnode selector