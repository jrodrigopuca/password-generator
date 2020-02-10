let btnRefresh = document.getElementById('btnRefresh');
let btnCopy = document.getElementById('btnCopy');
let lblResult = document.getElementById('lblResult');
let lblOriginal = document.getElementById('lblOriginal');

btnRefresh.addEventListener('click', e => changeValue());
btnCopy.addEventListener('click', e=>justCopy());


/**
 * @function changeValue
 * @description: cambiar los valores del label y del input para
 * que muestren el valor original (palabra) y la contraseña (passaword).
 * Nota: se utiliza el while para remover todos los nodos dentro del label 
 * y luego se agrega un nodo nuevo. Se podría usar lblOriginal.innerHtml = p.original, 
 * pero no es algo aconsejado por las buenas prácticas.
 */
async function changeValue() {
    let pass= new Generator();
    let p=pass.getPass();
    lblResult.value =  p.pass;

    
    while (lblOriginal.firstChild){
        lblOriginal.removeChild(lblOriginal.firstChild)
    }
    lblOriginal.appendChild(document.createTextNode(p.original))
}
/**
 * @function justCopy
 * @description selecciona al input, le da el focus y luego ejecuta el comando copy 
 * para enviar el password al portapapeles. Hace todo eso para simular un Ctrl+C
 */
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

/**
 *  @function init 
 *  @description inicia el programa generando la primera contraseña 
 */
async function init() {
    changeValue();
}

init();

