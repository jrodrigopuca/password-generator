console.log(PG.generate());

i=0;

let btn = document.getElementById('btnRefresh');
let lbl = document.getElementById('lblResult');

btn.addEventListener('click', e => changeValue());

async function changeValue() {
    i=i+1;
    lbl.innerHTML = i+ "Valor:" + Math.random();

}

async function init() {
    changeValue();
}

init();

