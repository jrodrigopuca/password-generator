//import * as data from './words-en.json';
import words from 'an-array-of-english-words';

function change(text, aOriginal, aChanged){
    let index=-1; let i=0; let char="";

    text= text.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    
    while (index < 0) {
        i++;
        char = getWord(text)
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

function getWord(arr){
    let min = 0; let max = arr.length - 1;
    let random = Math.floor(Math.random() * (max - min)) + min;
    return arr[random];
}

function generator(){
    let word =""; let newWord="";
    
    while (word.length<8 || word.length>15){
        word=getWord(words);
        console.log(word);
    }
    
    newWord=getMayus(getNumber(getSymbol(word)));

    return {original:word, pass:newWord};
}

export default class PG{
    constructor(){}
    generate(){
        return generator();
    }
}