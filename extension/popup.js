let btnRefresh = document.getElementById('btnRefresh');
let btnCopy = document.getElementById('btnCopy');
let lblResult = document.getElementById('lblResult');
let lblOriginal = document.getElementById('lblOriginal');

btnRefresh.addEventListener('click', e => changeValue());
btnCopy.addEventListener('click', e=>justCopy());

async function changeValue() {
    let pass= new Generator();
    let p=pass.getPass();
    lblResult.value =  p.pass;
    lblOriginal.innerHTML = p.original;
}

async function justCopy(){
    lblResult.select();
        lblResult.focus();
        try{
            let copy= document.execCommand('copy');
        }
        catch(err){
            console.error(err)
        }
}

async function init() {
    changeValue();
}

init();

