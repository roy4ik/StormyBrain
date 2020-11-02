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
    console.log(parentElement)
        // Determine parent placement
    parentWidth = parentElement.getBoundingClientRect().width
    x = window.scrollX + parentElement.getBoundingClientRect().x
    y = window.scrollY + parentElement.getBoundingClientRect().y

    console.log(x + ": Left") // position of parentElement
    console.log(y + ": Top")
    coords = circleSelection(data) // get positions for subnodes (top, left)
    nodes = []
    for (element = 0; element < data.length; ++element) {
        word = data[element]['word']
            // console.log('Creating node for :' + word)
        subnode = create_subNode(word)
            // add positioning to subnode
        subNode.style.left = x + (coords[0][element]) + "px"
        subNode.style.top = y + (coords[1][element]) + "px"
        subNode.style.width = parentWidth + 'px'
            // adding dataset
        subNode.dataset.word = word
        subNode.dataset.rel_score = data[element]['score']
        parentElement.appendChild(subNode)
        nodes.push(subNode, coords)
    }
    return nodes
};

create_subNode = (word) => {
    subNode = document.createElement("div")
    subNode.innerHTML = subNode.dataset.word
    subNode.classList.add('subNode')
    subNode.id = word
    subNode.style.height = 1.5 + 'em';
    subNode.style.position = 'relative'
    subNode.addEventListener('click', function clicked() { searchAndAddWords(subNode) })
    return subNode
}

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

make_parent = (searchNode) => {
    // turning new parent from subNode to parentElement
    searchNode.classList.remove('subNode')
    searchNode.classList.add('parentNode')
    searchNode.removeEventListener("click", searchAndAddWords);
    return searchNode
}

async function searchAndAddWords(searchNode) {
    // searchWord(this.dataset.word, this.dataset.rel_score)
    words = await getWordObjects(searchNode.dataset.word)
    parentElement = make_parent(searchNode)
    nodes = createSubNodes(words, parentElement)
    remove_non_parentElements()
    remove_parent_events()
    add_relation(searchNode)
    console.log("Adding words completed for " + searchNode.dataset.word)
}

function catalyze() {
    canvasNode = document.getElementById('canvas')
    search = document.getElementById('search-input')
        // console.log('Creating node for :' + parentElement.innerHTML)
    x = window.scrollX + search.getBoundingClientRect().x
    y = window.scrollY + search.getBoundingClientRect().y - 25
    parentWidth = search.getBoundingClientRect().width
    subnode = create_subNode(search.value)
    subNode.style.left = x + "px"
    subNode.style.top = y + "px"
    subNode.style.width = parentWidth + 'px'
        // adding data to subnode
    subNode.dataset.word = search.value
    save_word(subNode.dataset.word)
    canvasNode.appendChild(subNode)
    searchAndAddWords(subNode)
    return subNode
}

add_relation = async(searchNode) => {
    // console.log("searching word for elementID :" + elementID)
    if (next_word_node.dataset.rel_score != null && initial_word_node != undefined) {
        next_word_node = searchNode;
        initial_word_node = next_word_node.parentElement;
        console.log("initial :" + initial_word_node.dataset.word);
        console.log("next :" + next_word_node.dataset.word);
        // updates the word_relation when selecting a word
        update = await update_cloud(initial, next_word_node);
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
    parents = document.querySelectorAll('.parentNode:not(.search)')
    for (parent of parents.values()) {
        parent.removeEventListener("click", searchAndAddWords);
    }
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


update_cloud = async(initial_word_node, next_word_node) => {
    next_word = next_word_node.dataset.word
    rel_score = next_word_node.dataset.rel_score
    apiUrl = storm + '/update-userword_rel/initial=' + initial_word_node.dataset.word + '&next=' + next_word + '&rel=' + rel_score;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))
    return resp
}