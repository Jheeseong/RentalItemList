/**
 * 담당자 : 정희성
 * 파일 설명 : 대분류 카테고리와 소분류 카테고리를 저장하는 기능이 담긴 파일입니다.
 * **/
const parentCategory = document.querySelector('.parentCategory')
const childCategory = document.querySelector('.childCategory')
const CLICKED_CLASS = "show"
const select_parent = document.querySelector('.select_parent')
const select_child = document.querySelector('.select_child')
/**
 * 담당자 : 정희성
 * 함수 설명 : 대분류 카테고리 추가 버튼 클릭 시 select에 추가시킨 값이 생성되는 함수
 * **/
function save_parent_category() {
    optionAdd(select_parent)
    document.getElementById('input_parent').value = null;
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 소분류 카테고리 추가 버튼 클릭 시 select에 추가시킨 값이 생성되는 함수
 * 주요 기능 : 대분류 선택 여부를 반단하여 미선택 시 대분류 선택 알람을 전송하고 선택 하였을 경우
 *            DB에 대분류카테고리와 소분류카테고리 값을 저장해주는 기능
 * **/
async function save_child_category() {
    const parentCategory = document.getElementById('select_parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text
    let categories = {
        name: parentCategory.options[parentCategory.selectedIndex].text,
        children: document.getElementById('input_child').value
    }
    if (parentCategoryVal === "대분류 선택") {
        window.alert("대분류를 선택해주세요!");
    } else {
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
            });
    }
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 항목 추가버튼 클릭 시 input 및 추가 버튼이 생성
 * 주요 기능 : toggle 이벤트를 통해 스위치처럼 input 및 추가 버튼을 생성 및 제거해주는 기능
 * **/
function btn_toggle(categoryClass) {
    categoryClass.classList.toggle(CLICKED_CLASS, this.createInput(categoryClass));
    if (!categoryClass.classList.contains('show')) {
        this.deleteInput(categoryClass)
    } 
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 클래스 종류에 따라 다른 input 및 버튼을 생성해주는 함수
 * 주요 기능 : 함수 파라미터 값을 판단하여 대분류 카테고리의 input 및 버튼 값을 생성하거나
 *            소분류 카테고리의 input 및 버튼 값을 생성
 * **/
function createInput(categoryClass) {
    if (categoryClass === parentCategory) {
        categoryClass.innerHTML =
            "            <input type=\"text\" name=\"input_parent\" id=\"input_parent\" class=\"input_category\">\n" +
            "            <button id=\"btn_insertCategory\" name=\"btn_insertCategory\" class=\"button_create\" onclick=save_parent_category()>추가</button>"
    } else {
        categoryClass.innerHTML =
            "            <input type=\"text\" name=\"input_child\" id=\"input_child\" class=\"input_category\">\n" +
            "            <button id=\"btn_insertCategory\" name=\"btn_insertCategory\" class=\"button_create\" onclick=save_child_category()>추가</button>"

    }
}

/**
 * 담당자 ; 정희성
 * 함수 설명 : 해당 클래스의 input 및 버튼을 지우는 함수
 * **/

function deleteInput(categoryClass) {
    categoryClass.innerHTML = "";
}

/**
 * 담당자 : 정희성
 * 함수 설명 : onchange를 통해 대분류 카테고리 값 선택 시 해당 소분류 카테고리 값을 불러온 후 select의 option에 추가시켜주는 함수
 * 주요 기능 : 대분류 카테고리 선택 시 해당 값에 포함되어있는 소분류 카테고리를 불러와서 map을 통해 하나씩
 *            소분류 카테고리 select의 option에 추가하는 기능
 * **/
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
                //대분류 카테고리 안에 소분류 카테고리가 없을 시에 return
                if (categories.children === null) return;
                //값이 있을 경우 소분류 카테고리에 option 추가
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

/**
 * 담당자 : 정희성
 * 함수 설명 : "소분류 선택"이 되어 있을 시 optionParentCategory 함수를 실행 시켜주는 함수
 * **/
async function optionChildCategory() {
    const childCategory = document.getElementById('select_childCategory');
    const childCategoryVal = childCategory.options[childCategory.selectedIndex].text;

    if (childCategoryVal === "소분류 선택") {
        await optionParentCategory();
        return;
    }
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 함수 파라미터가 대분류 카테고리인지 소분류 카테고리인지 판단하여 해당 카테고리에 option을 추가해주는 기능
 * **/
function optionAdd(className) {
    let input_value;
    if (className === select_parent) {
        input_value = document.getElementById('input_parent').value;
    } else {
        input_value = document.getElementById('input_child').value;
    }
    className.innerHTML += "<option value=" + input_value + ">" + input_value + "</option>"
}