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
createSubNodes = (data, parentElement) => {
    canvasNode = document.getElementById('canvas')
    console.log(parentElement)
        // Determine parent placement
    parentElementHeight = parentElement.getBoundingClientRect().height
    parentElementWidth = parentElement.getBoundingClientRect().width
    xPosition = window.scrollX + parentElement.getBoundingClientRect().x
    yPosition = window.scrollY + parentElement.getBoundingClientRect().y

    //adjusting for boundary limits
    if (yPosition < 100) {
        yPosition += parentElementHeight * 10
    } else if (yPosition > document.getElementById('search-input').getBoundingClientRect().y + parentElementHeight / 2) {
        yPosition -= parentElementHeight * 10
    }

    console.log(x + ": Left") // position of parentElement
    console.log(y + ": Top")
    coords = circleSelection(data) // get positions for subnodes (top, left)
    nodes = []
    for (element = 0; element < data.length; ++element) {
        if (data[element]['word'] != null) {
            word = data[element]['word']
                // console.log('Creating node for :' + word)
            subnode = create_subNode(word)
                // adding dataset
            subNode.dataset.word = word
            subNode.dataset.initial = parentElement.dataset.word
            subNode.dataset.rel_score = data[element]['score']
            subNode.dataset.rel_pos = element
            subNode.addEventListener('click', clicked)
                // add positioning to subnode
            subNode.style.left = (coords[0][element]) + xPosition + "px"
            subNode.style.top = (coords[1][element]) + yPosition + "px"
            subNode.style.width = parentWidth + 'px'
            canvasNode.appendChild(subNode)
            nodes.push(subNode, coords)
        }
    }
    return nodes
};

create_subNode = (word) => {
    subNode = document.createElement("div")
    subNode.innerHTML = word
    subNode.classList.add('subNode')
    subNode.id = word
    subNode.style.height = 1.5 + 'em';
    subNode.style.position = 'absolute'
    return subNode
}

circleSelection = (data) => {
    radius = 180
    steps = data.length
    xValues = []
    yValues = []
    for (let angle = 0; angle < steps; ++angle) {
        xValues[angle] = (Math.round(radius * -Math.cos(Math.PI / steps * angle + (1 / 5))))
        yValues[angle] = (Math.round(radius * -Math.sin(Math.PI / steps * angle + (1 / 5))))
            // console.log('Coordinates are: ' + xValues[angle] + " : " + yValues[angle])
    }
    coords = [xValues, yValues]
    return coords
};

make_parent = (searchNode) => {
    // turning new parent from subNode to parentElement
    parents = document.querySelectorAll('[class^=parentNode]')
    searchNode.classList.remove('subNode')
    searchNode.classList.add('parentNode-' + parents.length)
    searchNode.removeEventListener("click", searchAndAddWords);
    remove_non_parentElements()
    return searchNode
}

async function searchAndAddWords(searchNode) {
    // searchWord(this.dataset.word, this.dataset.rel_score)
    parentElement = make_parent(searchNode)
    if (!catalyst) {
        words = await getWordObjects(searchNode.dataset.word)
    } else {
        level = Number([parentElement.classList[0][parentElement.classList[0].length - 1]][0])
        words = createDataFromCloud(cloud[level + 1], rel_positions[level], parentElement.dataset.rel_score)
    }
    nodes = createSubNodes(words, parentElement)
    remove_parent_events()
    if (!catalyst) {
        await add_relation(searchNode)
    }
    console.log("Adding words completed for " + searchNode.dataset.word)
}

function clicked() { searchAndAddWords(this) }

catalyze = async() => {
    canvasNode = document.getElementById('canvas')
    search = document.getElementById('search-input')
        // console.log('Creating node for :' + parentElement.innerHTML)
    x = window.scrollX + search.getBoundingClientRect().x
    y = window.scrollY + search.getBoundingClientRect().y - (search.offsetHeight * 2)
    parentWidth = search.getBoundingClientRect().width
    if (!catalyst) {
        subnode = create_subNode(search.value)
            // adding data to subnode
        subNode.dataset.word = search.value
    } else {
        subnode = create_subNode(catalyst)
            // adding data to subnode
        subNode.dataset.word = catalyst
    }
    subNode.style.left = x + "px"
    subNode.style.top = y + "px"
    subNode.style.width = parentWidth + 'px'
    if (!catalyst) {
        await save_word(subNode.dataset.word)
        await searchAndAddWords(subNode)
    }
    canvasNode.appendChild(subNode)
    return subNode
}

add_relation = async(searchNode) => {
    // console.log("searching word for elementID :" + elementID)
    if (searchNode.dataset.initial != null && searchNode.dataset.rel_score != null) {
        console.log("initial :" + searchNode.dataset.initial);
        console.log("next :" + searchNode.dataset.word);
        // updates the word_relation when selecting a word
        update = await update_cloud(searchNode);
        console.log("Rel score updated")
    };
};

// removes all subNodes that are not parentElements too
remove_non_parentElements = () => {
    subNodes = document.querySelectorAll('.subNode:not(.parentNode)')
        // console.log(subNodes)
    for (node of subNodes.values()) {
        node.remove()
    }
};

remove_parent_events = () => {
    parents = document.querySelectorAll('[class^=parentNode]')
    for (parent of parents.values()) {
        parent.removeEventListener("click", searchAndAddWords);
    }
};

// save data to storm
// Schema:
// Search word> save initial word
// select next word > word relation - save next word in userword and rel_score.

save_word = async(word_to_save) => {
    apiUrl = storm + '/save-word/word=' + word_to_save;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))
    return word_to_save
};


update_cloud = async(searchNode) => {
    apiUrl = storm + '/update-userword_rel/initial=' + searchNode.dataset.initial + '&next=' + searchNode.dataset.word + '&rel_score=' + searchNode.dataset.rel_score + '&rel_pos=' + searchNode.dataset.rel_pos;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))
    return resp
}

//creates data object from items in cluster, populates cluster item only on rel_pos, otherwise empty
createDataFromCloud = (cloudItem, rel_pos, rel_score) => {
    data = []
    if (cloudItem) {
        for (item = 0; item < 7; ++item) {
            if (item == rel_pos) {
                data[item] = { 'word': cloudItem, 'score': rel_score }
            } else {
                data[item] = { 'word': null }
            }
        }
    }
    return data
}
subNode = null
loadContent = () => {
    if (catalyst) {
        subNode = catalyze()
        for (i = 1; i < cloud.length; ++i) {
            subNode = document.getElementById(cloud[i - 1])
            console.log("cloud: " + cloud[i])
            searchAndAddWords(subNode)
        }
        catalyst = null
    }
    searchAndAddWords(subNode)
}

loadContent()