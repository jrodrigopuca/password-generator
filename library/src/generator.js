import wordsEN from './wordsEN.json'; 

class Generator {
    constructor(lang="EN"){
        this.lang= lang==="ES"?"ES":"EN";
        this.loadData(this.lang);
    }

    loadData(lang){
        this.dictionary=lang==='ES'?wordsES:wordsEN;
    }

    getPass(){
        let words= this.dictionary;
        let word =""; let newWord="";
    
        while (word.length<8 || word.length>15){
            word=this.getWord(words);
            console.log(word);
        }
        
        newWord=this.getMayus(this.getNumber(this.getSymbol(word)));
    
        return {original:word, pass:newWord};
    }

    change(text, aOriginal, aChanged){
        let index=-1; let i=0; let char="";
    
        text= text.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        
        while (index < 0) {
            i++;
            char = this.getWord(text)
            console.log(i+": "+char)
            if (i>30){
                // parche por si quiere pasar 30 veces
                char='a';
                text+="."+char;
            }
            index = aOriginal.indexOf(char)
        }
        text = text.replace(char, aChanged[index]);
        return text;
    }
    
    
    getNumber(text) {
        let original = ["a", "b", "e", "i", "g", "o", "q", "s", "t", "z"];
        let numbers = [4, 8, 3, 1, 6, 0, 9, 5, 7, 2];
        return this.change(text, original, numbers);
    }
    
    
    getSymbol(text) {
        let original = ["a","c", "d", "i", "l", "o", "p", "s", "y","q"];
        let symbols = ["@", "(", ")", "!", "/", "*", "?", "$", "&","¿"];
        return this.change(text, original, symbols);
    }
    
    
    getMayus(text) {
        let az = "abcdefghijklmnopqrstuvwxyz";
        let original = Array.from(az)
        let AZ = Array.from(az.toUpperCase())
        return this.change(text, original, AZ)
    }
    
    getWord(arr){
        let min = 0; let max = arr.length - 1;
        let random = Math.floor(Math.random() * (max - min)) + min;
        return arr[random];
    }

}

export default Generator;




