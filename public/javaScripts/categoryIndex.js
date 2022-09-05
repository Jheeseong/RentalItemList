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
            optionParentCategory();
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
async function optionParentCategory() {
    const parentCategory = document.getElementById('select_parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text;
    const childCategory = document.getElementById('select_childCategory')

    let rows = "<option value=\'\' disabled selected>소분류 선택</option>";

    if (parentCategory === "대분류 선택") {
        childCategory.innerHTML = rows;
    } else {
        await fetch('createItem/api/find/childcategory/' + parentCategoryVal, {
            method: 'get'
        })
            .then((res) => res.json())
            .then(() => {
                childCategory.innerHTML = rows;
            }).catch((err) => {
                window.alert(err);
                console.log(err);
            });
    }
}

function optionAdd(className) {
    console.log("test")
    className.innerHTML += "<option value='100'>테스트</option>"
}