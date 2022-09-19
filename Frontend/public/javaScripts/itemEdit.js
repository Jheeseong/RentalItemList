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
    const rental_edit = document.getElementById('rental_edit');
    const return_edit = document.getElementById('return_edit');
    const btnUpdateItem = document.querySelector('.btn-updateItem');
    const btnInitItem = document.getElementById('initItemId');

    // const modalEditBody = document.querySelector('.modal_edit_body');

    modal_edit.classList.add('show');
    if (modal_edit.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }

    $.ajax({
        type: "GET",
        url: 'itemmanagement/edit/' + id,
        dataType:"json",
        success: async function (result) {
            for (i = 1; i < parentCategory_edit.options.length; i++) parentCategory_edit.options[i] = null;
            parentCategory_edit.options.length = 1;

            //받아온 대분류 카테고리를 map에 담아 그 수만큼 innerHTML을 통해 option 추가
            result.categories.map(res => {
                parentCategory_edit.innerHTML += "<option value=" + res.name + ">" + res.name + "</option>"
            })

            //select에 Item의 저장된 value 값 불러오기
            for (let i = 0; i < parentCategory_edit.options.length; i++) {
                if (parentCategory_edit.options[i].value === result.item.category.parentCategory) {
                    parentCategory_edit.options[i].selected = true;
                }
            }

            await optionParentCategory_edit()


            for (let i = 0; i < childCategory_edit.options.length; i++) {
                if (childCategory_edit.options[i].value === result.item.category.childCategory) {
                    childCategory_edit.options[i].selected = true;
                }
            }

            //document.getElementById('select_childCategory_edit').value = item.item.category.childCategory;
            document.getElementById('name_edit').value = result.item.name;

            if (result.item.available.rental === true) {
                rental_edit.options[1].selected = true;
            } else {
                rental_edit.options[2].selected = true;
            }

            if (result.item.available.return === true) {
                return_edit.options[1].selected = true;
            } else {
                return_edit.options[2].selected = true;
            }

            document.getElementById('code_edit').value = result.item.code;
            document.getElementById('all_edit').value = result.item.count.all;

            btnUpdateItem.onclick = async function () {
                await itemSave(id);
            }

            btnInitItem.onclick = async function () {
                if (window.confirm("초기화를 하시겠습니까?")) {
                    await editItem(id);
                }
            }
        },
        error: function (err) {
            console.log(err);
            window.alert(err);
        }
    })
}

async function itemSave(id) {
    window.alert("수정 완료")
    // 모달 창 내 입력 값들을 items에 담아둠
    let items = {
        category: {
            parentCategory: document.getElementById('select_parentCategory_edit').value,
            childCategory: document.getElementById('select_childCategory_edit').value
        },
        name: document.getElementById('name_edit').value,
        code: document.getElementById('code_edit').value,
        count: {
            all: document.getElementById('all_edit').value,
        },
        available: {
            rental: document.getElementById('rental_edit').value,
            return: document.getElementById('return_edit').value
        }
    }

    // post를 통해 input 값을 DB에 저장하는 API 요청
    await fetch('itemmanagement/update/' + id, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
    }).then((res) => {res.json()})
        .then(() => {
            modal_edit.classList.toggle('show');
            window.location.reload(true);
        })
        .catch((err) => {
            console.log(err);
            window.alert(err);
        })
}

function initItem_btn(id) {

};

function cancel_btn() {
    initItem();
    modal_edit.classList.toggle('show');
}


async function optionParentCategory_edit() {
    const parentCategory_edit = document.getElementById('select_parentCategory_edit');
    const parentCategoryVal_edit = parentCategory_edit.options[parentCategory_edit.selectedIndex].text;
    const childCategory_edit = document.getElementById('select_childCategory_edit')

    let rows_edit = "<option value=\'\' disabled selected>소분류 선택</option>";

    if (parentCategoryVal_edit === "대분류 선택") {
        childCategory_edit.innerHTML = rows_edit;
    } else {
        await fetch('createItem/api/find/childcategory/' + parentCategoryVal_edit, {
            method: 'get'
        })
            .then((res) => res.json())
            .then((categories) => {
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