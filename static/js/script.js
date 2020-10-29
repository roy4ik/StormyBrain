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
        subNode.style.left = (coords[0][element]) + "px"
        subNode.style.top = (coords[1][element]) + "px"
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
    radius = 170
    steps = data.length
    xValues = []
    yValues = []
    for (let angle = 0; angle < steps; ++angle) {
        xValues[angle] = originXY[0] + (Math.round(((radius + Math.floor(Math.random() * 25))) * -Math.cos(Math.PI / steps * angle)))
        yValues[angle] = originXY[1] - radius / 10 + (Math.round(((radius + Math.floor(Math.random() * 25))) * -Math.sin(Math.PI * 0.7 / steps * angle)))
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
    coords_x = subNode.style.left
    console.log("X subnode:" + subNode.style.left)
    coords_y = subNode.style.top
    console.log("Y subnode:" + subNode.style.top)
    apiUrl = storm + '/save-word/word=' + word_to_save + '/coords=' + Math.round(coords_x.replace('px', '')) + '&' + Math.round(coords_y.replace('px', ''));
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))

    return subNode = subNode
};


display_catalyst = (catalyst) => {
    parentNode = document.getElementById('canvas')
    searchDiv = document.getElementById('search-input')
    console.log(searchDiv)
        // calculate position and add it to inline style of node
        // reduce coordX by 0.5 * element width for centering
    elementWidth = 50
    coordY = window.scrollY + searchDiv.getBoundingClientRect().y - 100
    console.log(coordY + ": Height")
    coordX = window.scrollX + searchDiv.getBoundingClientRect().x + elementWidth
    console.log(coordX + ": Width")

    console.log('Creating node for :' + catalyst)
    subNode = document.createElement("div")
    subNode.innerHTML = catalyst
    subNode.classList.add('subNode')
    subNode.id = subNode.innerHTML
    subNode.style.left = coordX + 'px'
    subNode.style.top = coordY + 'px'
    subNode.style.height = 16 + 'px'
    subNode.style.width = elementWidth + 'px'
    subNode.style.position = 'absolute'
    parentNode.appendChild(subNode)
    originXY = [coordX, coordY]
    return [subNode, originXY]
}

catalyze = (catalyst) => {
        displayCat = display_catalyst(catalyst)
        originXY = displayCat[1]
        console.log("OriginXY: " + displayCat[1][0] + "-" + displayCat[1][0])
        newCatalyst = save_word(displayCat[0])
        results = searchWord(catalyst, originXY)
    }
    // todo: create subnode selector