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
// calculates position of parentnode and adds it to inline style of subnodes
createSubNodes = (data, parentID = 'search-input') => {

    canvasNode = document.getElementById('canvas')
    parentNode = document.getElementById(parentID)
        // turning new parent from subNode to parentNode
    console.log(parentNode.classList)
    parentNode.classList.remove('subNode')
    parentNode.classList.add('parentNode')

    parentWidth = parentNode.getBoundingClientRect().width
    x = window.scrollX + parentNode.getBoundingClientRect().x
    console.log(parentNode)
    remove_non_parentNodes()
    if (parentID == "search-input") {
        // node for catalyst if parentID = 'search-input')
        console.log('Creating node for :' + parentNode.innerHTML)
        y = window.scrollY + parentNode.getBoundingClientRect().y - 25
        subNode = document.createElement("div")
        subNode.innerHTML = parentNode.value
        subNode.classList.add('parentNode-catalyst' + parentID)
        subNode.id = subNode.innerHTML
        subNode.style.left = x + 'px'
        subNode.style.top = y + 'px'
        subNode.style.height = 1.5 + 'em';
        subNode.style.width = parentWidth + 'px'
        subNode.style.position = 'absolute'
        canvasNode.appendChild(subNode)
        parentNode = subNode
    } else {
        y = window.scrollY + parentNode.getBoundingClientRect().y
    }
    console.log(x + ": Left") // position of parentnode
    console.log(y + ": Top")
    coords = circleSelection(data) // get positions for subnodes (top, left)
    nodes = []
    for (element = 0; element < data.length; ++element) {
        // console.log('Parentnode for onclick ' + parentNode.id)
        word = data[element]['word']
        console.log('Creating node for :' + word)
        subNode = document.createElement("div")
        subNode.innerHTML = word
        subNode.classList.add('subNode')
        subNode.id = word
        subNode.style.left = (coords[0][element]) + "px"
        subNode.style.top = (coords[1][element]) + "px"
        subNode.style.height = 1.5 + 'em';
        subNode.style.width = parentWidth + 'px'
        subNode.style.position = 'relative'
        subNode.data = word
        subNode.addEventListener('click', function() { searchWord(this.data) })
        parentNode.appendChild(subNode)
        nodes.push(subNode)
    }
    return nodes
};

// removes all subNodes that are not parentNodes too
remove_non_parentNodes = () => {
    subNodes = document.querySelectorAll('.subNode:not(.parentNode-cloud)')
    console.log(subNodes)
    for (node of subNodes.values()) {
        node.remove()
    }
}


searchWord = async(elementID = 'search-input') => {
    console.log("searching word for elementID :" + elementID)
    if (elementID == 'search-input') {
        console.log("found input")
        save_word(document.getElementById('search-input').value)
        data = await getWordObjects(document.getElementById('search-input').value)
    } else {
        save_word(elementID)
        data = await getWordObjects(elementID)
    }
    return createSubNodes(data, parentID = elementID)
};

circleSelection = (data) => {
    radius = 200
    steps = data.length
    xValues = []
    yValues = []
    for (let angle = 0; angle < steps; ++angle) {
        xValues[angle] = (Math.round(((radius * -Math.cos(Math.PI / steps * angle)))))
        yValues[angle] = (Math.round(radius * -Math.sin(Math.PI * 0.85 / steps * angle)))
            // console.log('Coordinates are: ' + xValues[angle] + " : " + yValues[angle])
    }
    coords = [xValues, yValues]
    return coords
};


//save data to storm
// Search word> save initial word
// select next word > word relation - save next word in userword and rel_score.
save_word = async(word_to_save) => {
    apiUrl = storm + '/save-word/word=' + word_to_save;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))
    return word_to_save
};


// todo: create subnode selector
// initial call should be: createSubNodes(searchWord("Boat",parentNode='search-input')) 
// todo: save_next function

// search function