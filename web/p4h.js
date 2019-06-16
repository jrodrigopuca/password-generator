function getWord(array) {
    let min = 0; let max = array.length - 1;
    let random = Math.floor(Math.random() * (max - min)) + min;
    return array[random]
}

function change(text, aOriginal, aChanged) {
    let index = -1;

    while (index < 0) {
        char = getWord(text)
        console.log(char)
        index = aOriginal.indexOf(char)
    }

    text = text.replace(char, aChanged[index]);
    return text;
}

function getNumber(text) {
    let original = ["a", "b", "e", "i", "g", "o", "q", "s", "t", "z"];
    let numbers = [4, 8, 3, 1, 6, 0, 9, 5, 7, 2];
    return change(text, original, numbers);
}

function getSymbol(text) {
    let original = ["a", "c", "d", "i", "l", "o", "p", "s", "y"];
    let symbols = ["@", "(", ")", "!", "/", "*", "?", "$", "&"];
    return change(text, original, symbols);
}

function getMayus(text) {
    let az = "abcdefghijklmnopqrstuvwxyz";
    let original = Array.from(az)
    let AZ = Array.from(az.toUpperCase())
    return change(text, original, AZ)
}

function valid(text) {
    const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.@*\s).{8,15}$/i;
    return expression.test(text);
}

async function getWords(url) {
    try {
        const response = await fetch(url);
        let words=await response.json();
        return words;
    }
    catch (err) {
        console.log('fetch failed', err);
    }
}

function working(word){
    original= document.getElementById("original");
    original.innerHTML= word;

    word=getSymbol(word)
    word=getNumber(word)
    word=getMayus(word)

    original= document.getElementById("modified");
    original.innerHTML= word;    
}


getWords("https://raw.githubusercontent.com/words/an-array-of-spanish-words/master/palabras.json")
    .then(words=>{
        let aWord=getWord(words);
        while (aWord.length< 8 || aWord.length>15) {
            aWord=getWord(words);
            console.log(aWord);
        }
        working(aWord);
        console.log(aWord);
    })