
function valid(text) {
    const expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.@*\s).{8,15}$/i;
    return expression.test(text);
}

let original = document.getElementById("original");
let modified = document.getElementById("modified");


function working() {
    let pass = new Generator("ES");
    let p = pass.getPass();
    modified.value = p.pass;

    while (original.firstChild) {
        original.removeChild(original.firstChild)
    }
    original.appendChild(document.createTextNode(p.original))

}

let btnCopy = document.getElementById("btnCopy")
    .addEventListener('click', (ev) => {
        ev.preventDefault();
        //let modified= document.getElementById("modified");
        modified.select();
        modified.focus();
        try {
            let copy = document.execCommand('copy');
        }
        catch (err) {
            console.error(err)
        }

    });

let btnRestart = document.getElementById('btnRestart')
    .addEventListener('click', (ev) => {
        ev.preventDefault();
        working();
    });

async function init() {
    working();
}

init();
