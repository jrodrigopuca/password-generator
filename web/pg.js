function getWord(array) {
    let min = 0; let max = array.length - 1;
    random = 1;
    try{
        random = Math.floor(Math.random() * (max - min)) + min;
    }
    catch(e){
        console.log("error en rand", e);
    }
    return array[random];
}

function change(text, aOriginal, aChanged) {
    let index = -1;
    text= text.normalize('NFD').replace(/[\u0300-\u036f]/g,"")
    let i=0;

    while (index < 0) {
        i++;
        char = getWord(text)
        console.log(i+": "+char)
        if (i>30){
            char='a';
            text+="."+char;
        }
        index = aOriginal.indexOf(char)
    }
    
    text = text.replace(char, aChanged[index]);

    return text;
}

// ----- Transformar letra 
function getNumber(text) {
    let original = ["a", "b", "e", "i", "g", "o", "q", "s", "t", "z"];
    let numbers = [4, 8, 3, 1, 6, 0, 9, 5, 7, 2];
    return change(text, original, numbers);
}

function getSymbol(text) {
    let original = ["a","c", "d", "i", "l", "o", "p", "s", "y","q"];
    let symbols = ["@", "(", ")", "!", "/", "*", "?", "$", "&","¿"];
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
    let original= document.getElementById("original");
    original.innerHTML= word;
        
    word=getSymbol(word)
    word=getNumber(word)
    word=getMayus(word)


    let modified= document.getElementById("modified");
    modified.value= word;    
}

function start(){
    getWords("https://raw.githubusercontent.com/words/an-array-of-spanish-words/master/palabras.json")
        .then(words=>{
            let aWord=getWord(words);
            while (aWord.length< 8 || aWord.length>15) {
                aWord=getWord(words);
                //console.log(aWord);
            }/*
            try{ working(aWord);}
            catch(e){ console.log(e)}
            */
            working(aWord);
            console.log(aWord);
        });
    }


start();

let btnCopy = document.getElementById("btnCopy")
    .addEventListener('click', (ev)=>{
        ev.preventDefault();
        let modified= document.getElementById("modified");
        modified.select();
        modified.focus();
        try{
            let copy= document.execCommand('copy');
        }
        catch(err){
            console.error(err)
        }

    });

let btnRestart = document.getElementById('btnRestart')
    .addEventListener('click',(ev)=>{
        ev.preventDefault();
        start();
    });

