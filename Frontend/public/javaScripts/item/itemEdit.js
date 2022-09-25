const modal_edit = document.querySelector('.modal_edit');
/**
 * 담당자 : 정희성
 * 주요 기능 : 물품 관리 내 물품 편집 클릭 시 모달창 실행
 * **/
//모달 창 바깥 클릭 시 모달 창 꺼지는 기능 구현
modal_edit.addEventListener('click', (event) => {
    if (event.target === modal_edit) {
        modal_edit.classList.toggle('show');

        if (!modal_edit.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

/**
 * 담당자 : 정희성
 * 함수 설명 : 함수 파라미터인 id 값을 통해 해당 id의 저장된 물품 정보를 불러오는 기능
 * 주요 기능 : 물품 불러오는 기능, 모달창 밖 클릭 시 꺼지는 기능, 초기화 클릭 시 변경 전 물품 정보를 불러오는 기능
 *            물품 저장 클릭 시 변경된 내용으로 저장되는 기능
 * **/
/* 물품 편집 */
async function editItem(id){
    const parentCategory_edit = document.getElementById('select_parentCategory_edit');
    const childCategory_edit = document.getElementById('select_childCategory_edit');
    const rental_edit = document.getElementById('rental_edit');
    const return_edit = document.getElementById('return_edit');
    const btnUpdateItem = document.querySelector('.btn-updateItem');
    const btnInitItem = document.getElementById('initItemId');

    // 모달 밖 클릭 시 모달창이 꺼지는 기능
    modal_edit.classList.add('show');
    if (modal_edit.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }

    // get 전송을 통해 해당 물품 정보를 불러오는 기능
    $.ajax({
        type: "GET",
        url: 'itemmanagement/edit/' + id,
        dataType:"json",
        success: async function (result) {
            //물품 편집 클릭 반복 시 카테고리 select에 불러온 값들이 쌓이는 것을 방지하기 위해 작성
            for (let i = 1; i < parentCategory_edit.options.length; i++) parentCategory_edit.options[i] = null;
            parentCategory_edit.options.length = 1;

            //받아온 대분류 카테고리를 map에 담아 그 수만큼 innerHTML을 통해 option 추가
            result.categories.map(res => {
                parentCategory_edit.innerHTML += "<option value=" + res.name + ">" + res.name + "</option>"
            })

            //대분류 카테고리 select에 Item의 저장된 value 값 불러오기
            for (let i = 0; i < parentCategory_edit.options.length; i++) {
                if (parentCategory_edit.options[i].value === result.item.category.parentCategory) {
                    parentCategory_edit.options[i].selected = true;
                }
            }

            //대분류 값에 포함되어 있는 소분류 카테고리를 불러오는 함수
            await optionParentCategory_edit()

            //소분류 카테고리 select에 Item의 저장된 value 값 불러오기
            for (let i = 0; i < childCategory_edit.options.length; i++) {
                if (childCategory_edit.options[i].value === result.item.category.childCategory) {
                    childCategory_edit.options[i].selected = true;
                }
            }

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

            //물품 저장 버튼 클릭 시 저장되는 기능
            btnUpdateItem.onclick = async function () {
                await itemSave(id);
            }

            //물품 초기화 버튼 클릭 시 변경 전 값으로 초기화되는 기능
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

/**
 * 담당자 : 정희성
 * 함수 설명 : 변경된 물품 값을 저장해주는 함수
 * 주요 기능 : 모달 창 내 입력 값들을 Post 전송하여 DB에 저장해주는 기능
 * **/
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

/**
 * 담당자 : 정희성
 * 함수 설명 : 취소 버튼 클릭 시 초기화 후 모달창 종료해주는 함수
 * **/
function cancel_btn() {
    initItem();
    modal_edit.classList.toggle('show');
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 대분류 카테고리 선택에 따라 포함되어 있는 소분류 카테고리 값을 불러와주는 함수(편집 버전)
 * **/
async function optionParentCategory_edit() {
    const parentCategory_edit = document.getElementById('select_parentCategory_edit');
    const parentCategoryVal_edit = parentCategory_edit.options[parentCategory_edit.selectedIndex].text;
    const childCategory_edit = document.getElementById('select_childCategory_edit')

    let rows_edit = "<option value=\'\' disabled selected>소분류 선택</option>";
    // 대분류 카테고리가 선택되어 있지 않을 경우
    if (parentCategoryVal_edit === "대분류 선택") {
        childCategory_edit.innerHTML = rows_edit;
        //대분류 카테고리가 선택되었을 경우
    } else {
        await fetch('createItem/api/find/childcategory/' + parentCategoryVal_edit, {
            method: 'get'
        })
            .then((res) => res.json())
            .then((categories) => {
                //대분류 카테고리 안에 소분류 카테고리가 없을 시에 return
                if (categories.children === null) return;
                //값이 잇을 경우 소분류 카테고리에 option 추가
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

/**
 * 담당자 : 정희성
 * 함수 설명 : "소분류 선택"이 되어 있을 시 optionParentCategory 함수를 실행시켜주는 함수(편집버전)
 * **/
async function optionChildCategory_edit() {
    const childCategory_edit = document.getElementById('select_childCategory_edit');
    const childCategoryVal_edit = childCategory_edit.options[childCategory_edit.selectedIndex].text;

    if (childCategoryVal_edit === "소분류 선택") {
        await optionParentCategory_edit();
        return;
    }
}