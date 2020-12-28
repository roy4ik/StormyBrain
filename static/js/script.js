// set catalys to null to initiate catalyzing on search
let catalyst = null
    // set subnode to null for search initiation
let subNode = null

// sets catalyst to first element in cloud received from server
if (cloud.length > 0) {
    catalyst = cloud[0];
}

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
        // Determine parent placement
    parentPosition = getElementCenterPos(parentElement)

    //adjusting for boundary limits
    radius = 140
    margin = 00

    // if position out of bounds on top
    if (parentPosition[1] < window.innerHeight * margin + radius) {
        parentPosition[1] += radius + window.innerHeight * margin
    } else if (parentPosition[1] > window.innerHeight - radius) {
        parentPosition[1] -= radius + window.innerHeight * margin
    }
    // if position out of bounds on width
    if (parentPosition[0] < window.innerWidth * margin + radius) {
        parentPosition[0] += window.innerWidth * margin + radius
    }
    if (parentPosition[0] > window.innerWidth - radius) {
        parentPosition[0] -= window.innerWidth * margin + radius
    }

    // console.log(x + ": Left") // position of parentElement
    // console.log(y + ": Top")
    coords = circleSelection(data) // get positions for subnodes (top, left)
    nodes = []
    for (element = 0; element < data.length; ++element) {
        if (data[element]['word'] != null) {
            word = data[element]['word']
                // console.log('Creating node for :' + word)
            subNode = create_subNode(word)
                // adding dataset
            subNode.dataset.word = word
            subNode.dataset.initial = parentElement.dataset.word
            subNode.dataset.rel_score = data[element]['score']
            subNode.dataset.rel_pos = element + 1
            subNode.addEventListener('click', clicked)
                // add positioning to subnode
            subNode.style.left = (coords[0][element]) + parentPosition[0] + "px"
            subNode.style.top = (coords[1][element]) + parentPosition[1] + "px"
            subNode.style.width = parentElement.offsetWidth + 'px'
            canvasNode.appendChild(subNode)
            nodes.push(subNode, coords)
            line = connectElements(parentElement, subNode)
        }
    }

    return nodes
};

// creates subNode from word. args: str:word returns obj:subNode
create_subNode = (word) => {
    subNode = document.createElement("div")
    subNode.innerHTML = word
    subNode.classList.add('subNode')
    subNode.id = word
    subNode.style.height = 1.5 + 'em';
    subNode.style.position = 'absolute'

    return subNode
}

// adds connection-lines between two elements. args: obj:parentElement obj:childElement str:color
connectElements = (parentElement, childElement, color = randomColor()) => {
    //connects parent and child element with a svg line
    parentElementPos = getElementCenterPos(parentElement)
    childElementPos = getElementCenterPos(childElement)
    canvas = document.getElementById("svg-canvas")
    line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute("x1", parentElementPos[0])
    line.setAttribute("x2", childElementPos[0])
    line.setAttribute("y1", parentElementPos[1])
    line.setAttribute("y2", childElementPos[1] - parentElement.getBoundingClientRect().height)
        // line.setAttribute("stroke", color)
    line.setAttribute("style", "stroke:" + color + "; position: absolute;stroke-width:3; z-index: -99;")
        //  adding class for subnode connection
    subNodes = document.querySelectorAll('[class^=subNode]')
    parents = document.querySelectorAll('[class^=parentNode]')
    line.classList.add('connectionLine-' + parents.length + "-" + subNodes.length)
    canvas.appendChild(line)

    return line
}

// returns an array with X and Y coordinates of the element's center
getElementCenterPos = (elem) => {
    xPosition = window.scrollX + elem.getBoundingClientRect().x + elem.getBoundingClientRect().width / 2
    yPosition = window.scrollY + elem.getBoundingClientRect().y - elem.getBoundingClientRect().height / 2

    // change ElementCenterPos for Chrome and Safari (adjust down by one rem)
    isSafari = window.safari !== undefined
    isChrome = window.chrome !== undefined
    if (isSafari || isChrome) {
        let style = window.getComputedStyle(elem, null).getPropertyValue('font-size');
        let fontSize = parseFloat(style);
        yPosition += fontSize;
    }

    return [xPosition, yPosition]
}

// calculates coordinates of elements within data argument. args: obj:data, returns: array:coords
circleSelection = (data) => {
    radius = 140
    steps = data.length
    xValues = []
    yValues = []
    if (cloud.length <= 1) {
        for (let angle = 0; angle < steps; ++angle) {
            xValues[angle] = (Math.round(radius * +Math.cos(Math.PI / steps * angle + (1 / 5))))
            yValues[angle] = (Math.round(radius * -Math.sin(Math.PI / steps * angle + (1 / 5))))
        }
    } else {
        for (let angle = 0; angle < steps; ++angle) {
            xValues[angle] = (Math.round(radius * +Math.cos(2 * Math.PI / steps * angle + (1 / 5))))
            yValues[angle] = (Math.round(radius * -Math.sin(2 * Math.PI / steps * angle + (1 / 5))))
        }
    }
    coords = [xValues, yValues]

    return coords
};

// turns new parent from subNode to parentElement. returns obj:searchNode
make_parent = (searchNode) => {
    parents = document.querySelectorAll('[class^=parentNode]')
    searchNode.classList.remove('subNode')
    searchNode.classList.add('parentNode-' + parents.length)
    searchNode.removeEventListener("click", clicked);
    remove_non_parentElements()
    return searchNode
}

// removes connection lines except lines to keep. args: obj:searchNode, returns nothing
remove_connections = (searchNode) => {
    // removes connections apart from the one between searchnode and selected node, returns nothing
    if (document.querySelectorAll('[class^=subNode').length > 1) {
        parents = document.querySelectorAll('[class^=parentNode]')
            // linesToRemove = document.querySelectorAll("[class^="connectionLine-" + (parents.length) + "-(!? class^=connectionLine-" + (parents.length) + "-" + searchNode.dataset.rel_pos + ")]")
        linesToKeep = document.querySelectorAll("[class^=connectionLine-" + parents.length + "-" + searchNode.dataset.rel_pos + "]")
        linesToRemove = document.querySelectorAll('[class^=connectionLine-' + parents.length + ']')
        for (node of linesToRemove.values()) {
            if (node != linesToKeep[0]) {
                node.remove()
            }
        }
    }
}

// searches for new cloud and adds it, returns obj:parentElement
async function searchAndAddWords(searchNode) {
    remove_connections(searchNode)
    parentElement = make_parent(searchNode)
        //make search disappear
    search = document.getElementById('canvas-word-search')
    search.style = 'transition: all 0.2s ease; display:none;'
    remove_parent_events()

    if (catalyst == null) {
        words = await getWordObjects(searchNode.dataset.word)
        await add_relation(searchNode)
        cloud.push(searchNode.dataset.word)
    } else if (cloud.length == 1) {
        words = await getWordObjects(cloud[0])
    } else {
        levelClass = parentElement.classList[0]
        level = Number(levelClass.match(/(?:-)(\d+)$/)[1])
        words = createDataFromCloud(cloud[level + 1], rel_positions[level], parentElement.dataset.rel_score)
    }
    nodes = createSubNodes(words, parentElement)
        // console.log("Adding words completed for " + searchNode.dataset.word)

    return parentElement
}

function clicked() { searchAndAddWords(this) }

//initiates storm, hides search. returns obj:subNode 
catalyze = async() => {
    canvasNode = document.getElementById('canvas')
    search = document.getElementById('search-input')
        // console.log('Creating node for :' + parentElement.innerHTML)
    x = window.scrollX + search.getBoundingClientRect().x
    y = window.scrollY + search.getBoundingClientRect().y - (search.offsetHeight * 2)
    parentWidth = search.getBoundingClientRect().width
    if (catalyst == null) {
        subNode = create_subNode(search.value)
            // adding data to subnode
        subNode.dataset.word = search.value
    } else {
        subNode = create_subNode(catalyst)
            // adding data to subnode
        subNode.dataset.word = catalyst
    }
    subNode.style.left = x + "px"
    subNode.style.top = y + "px"
    subNode.style.width = parentWidth + 'px'
    canvasNode.appendChild(subNode)
    if (catalyst == null) {
        await save_word(subNode.dataset.word)
    }
    await searchAndAddWords(subNode)

    return subNode
}

// adds wordRelation information to searchNode, returns nothing
add_relation = async(searchNode) => {
    // console.log("searching word for elementID :" + elementID)
    if (searchNode.dataset.initial != null && searchNode.dataset.rel_score != null) {
        console.log("initial :" + searchNode.dataset.initial);
        console.log("next :" + searchNode.dataset.word);
        // updates the word_relation when selecting a word
        update = await update_cloud(searchNode);
        console.log("Rel score updated")
    } else {
        console.log('could not add relation for searchNode:' + searchNode.id)
    }
};

// removes all subNodes that are not parentElements too, returns nothing
remove_non_parentElements = () => {
    subNodes = document.querySelectorAll('[class^=subNode]')
        // console.log(subNodes)
    for (node of subNodes.values()) {
        node.remove()
    }
};

// removes all events from parent elements, returns nothing
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

// saves word to db returns str: word_to_save
save_word = async(word_to_save) => {
    apiUrl = storm + '/save-word/word=' + word_to_save;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))

    return word_to_save
};

// updates cloud(word) to db returns http:response
update_cloud = async(searchNode) => {
    apiUrl = storm + '/update-userword_rel/initial=' + searchNode.dataset.initial + '&next=' + searchNode.dataset.word + '&rel_score=' + searchNode.dataset.rel_score + '&rel_pos=' + searchNode.dataset.rel_pos;
    console.log(apiUrl)
    resp = await fetch(apiUrl)
        .catch(err => console.log(err))

    return resp
}

//creates data object from items in cluster, populates cluster item only on rel_pos, otherwise empty. returns obj:data
createDataFromCloud = (cloudItem, rel_pos, rel_score) => {
    data = []
    if (cloudItem) {
        for (item = 0; item <= 7; ++item) {
            if (item == rel_pos) {
                data[item] = { 'word': cloudItem, 'score': rel_score }
            } else {
                data[item] = { 'word': null }
            }
        }
    }

    return data
}

// loads content if catalyst not null. loops through the cloud.
loadContent = () => {
    if (catalyst != null) {
        subNode = catalyze()
        console.log(cloud.length)
            // if more than catalyst exists
        if (cloud.length > 1) {
            for (cluster = 1; cluster <= cloud.length; ++cluster) {
                subNodes = document.querySelectorAll('[id=' + cloud[cluster] + ']')
                for (node of subNodes) {
                    if (node.id == cloud[cluster] && node.classList[0] == 'subNode') {
                        subNode = node
                        console.log("cloud nr " + cluster + ": " + cloud[cluster])
                        newNode = searchAndAddWords(subNode)
                    } else {
                        console.log('couldnt find subNode')
                    }
                }
            }
            // if only catalyst exists
        } else if (cloud.length == 1) {
            subNode = document.getElementById(cloud[0])
            console.log("cloud: " + cloud[0])
        }
    }
    catalyst = null
    searchAndAddWords(subNode)
}

// creates random color. returns str(rgba color): color
randomColor = () => {
    // using rgba for better transparency control
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var color = "rgba(" + x + "," + y + "," + z + "1)";

    return color;
};



//On full load call loadContent
window.onload = (event) => {
    loadContent()
};