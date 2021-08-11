//stormy getting data from datamuse
let getWordObjects = async(word, relCode = 'trg', max = 7) => {
    let apiUrl = 'https://api.datamuse.com/words?rel_' + relCode + '=' + word + '&max=' + max
    let data = []
    let resp = await fetch(apiUrl) // Call API
        .catch(err => console.log(err))
    data = await resp.json() // Transform the data into json

    return data;
};
export default getWordObjects;