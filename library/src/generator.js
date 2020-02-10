const wordsEN = require('./wordsEN.json');
const wordsES = require('./wordsES.json');

export default class Generator {
    constructor(lang = "EN") {
        this.lang = lang === "ES" ? "ES" : "EN";
    }

    /**
     * @function getPass: trae el listado de palabras, selecciona una palabra
     * al azar, luego solicita modificar esa palabra para mostrarla
     */
    getPass() {
        let words = this.lang === 'ES' ? wordsES : wordsEN;
        let word = ""; let newWord = "";

        while (word.length < 8 || word.length > 15) {
            word = this.getWord(words);
            //console.log(word);
        }

        newWord = this.getMayus(this.getNumber(this.getSymbol(word)));

        return { original: word, pass: newWord };
    }

    /**
     * @function change: modifica una palabra agregando un número/mayus/simbolo 
     * @param {String} text: palabra a modificar
     * @param {Array} aOriginal: array de caracteres
     * @param {Array} aChanged: array de caracteres modificados
     */
    change(text, aOriginal, aChanged) {
        let index = -1; let i = 0; let char = "";

        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        while (index < 0) {
            i++;
            char = this.getWord(text)
            //console.log(i+": "+char)
            if (i > 30) {
                // parche por si quiere pasar 30 veces
                char = 'a';
                text += "." + char;
            }
            index = aOriginal.indexOf(char)
        }
        text = text.replace(char, aChanged[index]);
        return text;
    }

    /**
    * @function getNumber: función para agregar un número a un texto
    * @param {String} text 
    */
    getNumber(text) {
        let original = ["a", "b", "e", "i", "g", "o", "q", "s", "t", "z"];
        let numbers = [4, 8, 3, 1, 6, 0, 9, 5, 7, 2];
        return this.change(text, original, numbers);
    }

    /**
    * @function getSymbol: función para agregar un simbolo a un texto
    * @param {String} text 
    */
    getSymbol(text) {
        let original = ["a", "c", "d", "i", "l", "o", "p", "s", "y", "q"];
        let symbols = ["@", "(", ")", "!", "/", "*", "?", "$", "&", "¿"];
        return this.change(text, original, symbols);
    }

    /**
    * @function getMayus: función para agregar una mayuscula a un texto
    * @param {String} text 
    */
    getMayus(text) {
        let az = "abcdefghijklmnopqrstuvwxyz";
        let original = Array.from(az)
        let AZ = Array.from(az.toUpperCase())
        return this.change(text, original, AZ)
    }

    /**
     * @function getWord: de un array trae un elemento al azar
     * @example traer una palabra de un array, traer un caracter de una palabra
     * @param {Array} arr 
     */
    getWord(arr) {
        let min = 0; let max = arr.length - 1;
        let random = Math.floor(Math.random() * (max - min)) + min;
        return arr[random];
    }

}




