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
// calculates position of parentElement and adds it to inline style of subnodes
createSubNodes = (data, parentID = 'search-input') => {

    canvasNode = document.getElementById('canvas')
    parentElement = document.getElementById(parentID)
        // turning new parent from subNode to parentElement
    console.log(parentElement.classList)
    parentElement.classList.remove('subNode')
    parentElement.classList.add('parentNode')

    parentWidth = parentElement.getBoundingClientRect().width
    x = window.scrollX + parentElement.getBoundingClientRect().x
    console.log(parentElement)
    remove_non_parentElements()
    if (parentID == "search-input") {
        // node for catalyst if parentID = 'search-input')
        // console.log('Creating node for :' + parentElement.innerHTML)
        y = window.scrollY + parentElement.getBoundingClientRect().y - 25
        subNode = document.createElement("div")
        subNode.innerHTML = parentElement.value
        subNode.classList.add('parentNode')
        subNode.classList.add('parentNode-catalyst-' + parentID)
        subNode.id = parentElement.value
        subNode.style.left = x + 'px'
        subNode.style.top = y + 'px'
        subNode.style.height = 1.5 + 'em';
        subNode.style.width = parentWidth + 'px'
        subNode.style.position = 'absolute'
        canvasNode.appendChild(subNode)
        parentElement = subNode
    } else {
        y = window.scrollY + parentElement.getBoundingClientRect().y
    }
    console.log(x + ": Left") // position of parentElement
    console.log(y + ": Top")
    coords = circleSelection(data) // get positions for subnodes (top, left)
    nodes = []
    for (element = 0; element < data.length; ++element) {
        // console.log('parentElement for onclick ' + parentElement.id)
        word = data[element]['word']
            // console.log('Creating node for :' + word)
        subNode = document.createElement("div")
        subNode.innerHTML = word
        subNode.classList.add('subNode')
        subNode.id = word
        subNode.style.left = (coords[0][element]) + "px"
        subNode.style.top = (coords[1][element]) + "px"
        subNode.style.height = 1.5 + 'em';
        subNode.style.width = parentWidth + 'px'
        subNode.style.position = 'relative'
        subNode.dataset.word = word
        subNode.dataset.rel_score = data[element]['score']
        subNode.addEventListener('click', function() { searchWord(this.dataset.word, this.dataset.rel_score) })
        parentElement.appendChild(subNode)
        nodes.push(subNode)
    }
    return nodes
};

// removes all subNodes that are not parentElements too
remove_non_parentElements = () => {
    subNodes = document.querySelectorAll('.subNode:not(.parentNode)')
    console.log(subNodes)
    for (node of subNodes.values()) {
        node.remove()
    }
}

searchWord = async(elementID = 'search-input', rel_score = null) => {
    console.log("searching word for elementID :" + elementID)
    if (elementID == 'search-input') {
        console.log("found input")
        save_word(document.getElementById('search-input').value)
        data = await getWordObjects(document.getElementById('search-input').value)
    } else {
        data = await getWordObjects(elementID);
        next_word_node = document.getElementById(elementID);
        initial = next_word_node.parentElement.id;
        console.log("initial :" + initial);
        console.log("next :" + next_word_node.id);
        // updates the word_relation when selecting a word
        if (rel_score != null) {
            update = await update_cloud(initial, next_word_node);
        };
    }
    nodes = createSubNodes(data, parentID = elementID)
    return nodes
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


update_cloud = async(initial_word, next_word_node) => {
    next_word = next_word_node.id
    rel_score = next_word_node.dataset.rel_score
    apiUrl = storm + '/update-userword_rel/initial=' + initial_word + '&next=' + next_word + '&rel=' + rel_score;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))
    return resp
}