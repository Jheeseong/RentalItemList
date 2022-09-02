const parentCategory = document.querySelector('.parentCategory')
const childCategory = document.querySelector('.childCategory')
const CLICKED_CLASS = "show"
function btn_toggle(categoryClass) {
    categoryClass.classList.toggle(CLICKED_CLASS, this.createInput(categoryClass));
    if (!categoryClass.classList.contains('show')) {
        this.deleteInput(categoryClass)
    }
}
function createInput(categoryClass) {
    categoryClass.innerHTML =
        "            <input type=\"text\" id=\"parent\">\n" +
        "            <button id=\"btn_insertCategory\" name=\"btn_insertCategory\" onclick=''>추가</button>"
}

function deleteInput(categoryClass) {
    categoryClass.innerHTML = "";
}
function optionAdd(name) {
    const selEle = document.getElementsByName(name);
    selEle.innerHTML += "<option value='100'>테스트</option>"
}