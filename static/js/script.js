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
// todo: save data to user

// todo: calcElementCoord(element)



// let items = document.querySelectorAll('.circle a');
// for (var i = 0, l = items.length; i < l; i++) {
//     items[i].style.left = (50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
//     items[i].style.top = (50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / l) * i * Math.PI)).toFixed(4) + "%";
// }

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