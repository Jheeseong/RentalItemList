const modal_edit = document.querySelector('.modal_edit');

//모달 창 바깥 클릭 시 모달 창 꺼지는 기능 구현
modal_edit.addEventListener('click', (event) => {
    if (event.target === modal_edit) {
        modal_edit.classList.toggle('show');

        if (!modal_edit.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});


/* 물품 편집 */
async function editItem(id){
    const parentCategory_edit = document.getElementById('select_parentCategory_edit');
    const childCategory_edit = document.getElementById('select_childCategory_edit');

    modal_edit.classList.toggle('show');
    console.log(id);
    $.ajax({
        type: "GET",
        url: 'itemmanagement/edit/' + id,
        dataType:"json",
        success: function (result) {
            console.log(result)
            for(i = 1; i<parentCategory_edit.options.length; i++) parentCategory_edit.options[i] = null;
            parentCategory_edit.options.length = 1;

            //받아온 대분류 카테고리를 map에 담아 그 수만큼 innerHTML을 통해 option 추가
            result.categories.map(res => {
                parentCategory_edit.innerHTML += "<option value=" + res.name + ">" + res.name + "</option>"
            })
            //select에 Item의 저장된 value 값 불러오기
            for (let i = 0; i < parentCategory_edit.options.length; i++) {
                console.log(parentCategory_edit.options[i].value);
                if (parentCategory_edit.options[i].value === result.item.category.parentCategory) {
                    parentCategory_edit.options[i].selected = true;
                }
            }

            optionParentCategory_edit()

            for (let i = 0; i < childCategory_edit.options.length; i++) {
                console.log(childCategory_edit.options[i].value);
                if (childCategory_edit.options[i].value === result.item.category.childCategory) {
                    childCategory_edit.options[i].selected = true;
                }
            }

            //document.getElementById('select_childCategory_edit').value = item.item.category.childCategory;
            document.getElementById('name_edit').value = result.item.name;
            document.getElementById('number_edit').value = result.item.number;
            //document.getElementById('rental_edit').value = item.item.available.rental;
            //document.getElementById('return_edit').value = item.item.available.return;
            document.getElementById('code_edit').value = result.item.code;
            document.getElementById('all_edit').value = result.item.count.all;
        },
        error: function (err) {
            console.log(err);
            window.alert(err);
        }
    })
}

async function optionParentCategory_edit() {
    const parentCategory_edit = document.getElementById('select_parentCategory_edit');
    const parentCategoryVal_edit = parentCategory_edit.options[parentCategory_edit.selectedIndex].text;
    const childCategory_edit = document.getElementById('select_childCategory_edit')

    let rows_edit = "<option value=\'\' disabled selected>소분류 선택</option>";

    if (parentCategory_edit === "대분류 선택") {
        childCategory_edit.innerHTML = rows_edit;
    } else {
        await fetch('createItem/api/find/childcategory/' + parentCategoryVal_edit, {
            method: 'get'
        })
            .then((res) => res.json())
            .then((categories) => {
                console.log(categories);
                if (categories.children === null) return;
                categories.children.children.map(res => {
                    rows_edit += "<option value=" + res + ">" + res + "</option>";
                });
                childCategory_edit.innerHTML = rows_edit;
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

async function optionChildCategory_edit() {
    const childCategory_edit = document.getElementById('select_childCategory_edit');
    const childCategoryVal_edit = childCategory_edit.options[childCategory_edit.selectedIndex].text;

    if (childCategoryVal_edit === "소분류 선택") {
        await optionParentCategory_edit();
        return;
    }
}