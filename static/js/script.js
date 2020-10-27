//stormy getting data from datamuse

getWordObjects = async(word, relCode = 'trg', max = 7) => {
    apiUrl = 'https://api.datamuse.com/words?rel_' + relCode + '=' + word + '&max=' + max;
    data = []
    resp = await fetch(apiUrl) // Call API
    data = await resp.json() // Transform the data into json
        .catch(err => console.log(err))
    console.log(data)
    return data;
};

createSubNodes = (data) => {
    parentNode = document.getElementById('canvas')
    for (element = 0; data.length - 1; ++element) {
        console.log('Creating node for :' + data[element]['word'])
        subNode = document.createElement("div")
        subNode.innerHTML = data[element]['word']
        subNode.classList.add = 'subNode'
        parentNode.appendChild(subNode)
    };
};

searchWord = async(wordString = "happy") => {
    data = await getWordObjects(wordString)
    createSubNodes(data)
};
// todo: save data to user