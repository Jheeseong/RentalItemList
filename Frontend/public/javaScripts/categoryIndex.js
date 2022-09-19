const parentCategory = document.querySelector('.parentCategory')
const childCategory = document.querySelector('.childCategory')
const CLICKED_CLASS = "show"
const select_parent = document.querySelector('.select_parent')
const select_child = document.querySelector('.select_child')
async function save_parent_category() {
    optionAdd(select_parent)
    select_child.innerHTML = "<option value='' disabled selected>소분류 선택</option>";
    document.getElementById('input_parent').value = null;

}
async function save_child_category() {
    const parentCategory = document.getElementById('select_parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text
    let categories = {
        name: parentCategory.options[parentCategory.selectedIndex].text,
        children: document.getElementById('input_child').value
    }
    await fetch('createItem/api/createCategory/' + parentCategoryVal, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categories),
    }).then((res) => {
        res.json()
    })
        .then(() => {
            optionAdd(select_child)
            document.getElementById('input_child').value = null;
        })

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
            "            <input type=\"text\" name=\"input_parent\" id=\"input_parent\" class=\"input_category\">\n" +
            "            <button id=\"btn_insertCategory\" name=\"btn_insertCategory\" onclick=save_parent_category()>추가</button>"
    } else {
        categoryClass.innerHTML =
            "            <input type=\"text\" name=\"input_child\" id=\"input_child\" class=\"input_category\">\n" +
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
            .then((categories) => {
                if (categories.children === null) return;
                categories.children.children.map(res => {
                    rows += "<option value=" + res + ">" + res + "</option>";
                });
                childCategory.innerHTML = rows;
            }).catch((err) => {
                if (err.message.includes('type')) {
                    return;
                } else {
                    window.alert(err);
                    console.log(err);
                }
            });
    }
}

async function optionChildCategory() {
    const childCategory = document.getElementById('select_childCategory');
    const childCategoryVal = childCategory.options[childCategory.selectedIndex].text;

    if (childCategoryVal === "소분류 선택") {
        await optionParentCategory();
        return;
    }
}

function optionAdd(className) {
    let input_value;
    if (className === select_parent) {
        input_value = document.getElementById('input_parent').value;
    } else {
        input_value = document.getElementById('input_child').value;
    }
    className.innerHTML += "<option value=" + input_value + ">" + input_value + "</option>"
}