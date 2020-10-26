//stormy getting data from datamuse

getWordObjects = (word, relCode = 'trg', max = 7) => {
    apiUrl = 'https://api.datamuse.com/words?rel_' + relCode + '=' + word + '&max=' + max;
    fetch(apiUrl) // Call API
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) {
            console.log(data[0]['word'])
        })
        .catch(err => console.log(err))
    return data;
}