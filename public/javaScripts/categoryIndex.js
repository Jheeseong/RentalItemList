const parentCategory = document.querySelector('.parentCategory')
const childCategory = document.querySelector('.childCategory')
const CLICKED_CLASS = "show"
const select_parent = document.querySelector('.select_parent')
async function save_parent_category() {
    let categories = {
        name: document.getElementById('parent').value
    }
    await fetch('api/createCategory', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categories),
    }).then((res) => {res.json()})
        .then(() => {
            document.getElementById('parent').value = null;
            // changeParentCategory();
            optionAdd(select_parent);
        })
}
function save_child_category() {

}
function btn_toggle(categoryClass) {
    categoryClass.classList.toggle(CLICKED_CLASS, this.createInput(categoryClass));
    if (!categoryClass.classList.contains('show')) {
        this.deleteInput(categoryClass)
    }
}
function createInput(categoryClass) {
    if (categoryClass === parentCategory) {
        categoryClass.innerHTML =
            "            <input type=\"text\" id=\"parent\">\n" +
            "            <button id=\"btn_insertCategory\" name=\"btn_insertCategory\" onclick=save_parent_category()>추가</button>"
    } else {
        categoryClass.innerHTML =
            "            <input type=\"text\" id=\"child\">\n" +
            "            <button id=\"btn_insertCategory\" name=\"btn_insertCategory\" onclick=save_child_category()>추가</button>"

    }

}

function deleteInput(categoryClass) {
    categoryClass.innerHTML = "";
}
function optionAdd(className) {
    console.log("test")
    className.innerHTML += "<option value='100'>테스트</option>"
}