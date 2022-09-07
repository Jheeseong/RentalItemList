/* 데이터 바인딩 시 테이블 내 내용 변경 */
function itemsRender(items){
    const itemInfoListTable = document.getElementById('tr_itemInfoList');
    let rows = "<div></div>";
    console.log(items);

    items.map(res => {

        rows += "<tr><td>" +res.number + "</td>" +
        "<td>" + res.category.parentCategory + "</td>" +
        "<td>" +res.category.childCategory + "</td>" +
        "<td>" +res.name + "</td>" +
        "<td>" +res.available.rental + "</td>" +
        "<td>" +res.available.return + "</td>" +
        "<td>" +res.count.remaining + "</td>" +
        "<td>" +(res.count.all - res.count.remaining) + "</td>" +
        "<td>" +res.count.all + "</td>" +
        "<td>" +res.createDate + "</td>" +
        "<td><button class='btn-manager' onclick='editItem(\"" + res._id + "\")'><img class=\"manage-icon\" src=\"/img/edit.png\"></button>" +
        "<button class='btn-manager' onclick='deleteItem(\"" + res._id +"\")'><img class=\"manage-icon\" src=\"/img/trash.png\"></button> " +
        "<button class='btn-open-lender btn-manager' onclick='lenderList(\"" + res.name + "\"," + JSON.stringify(res.lender) +")'><img class=\"manage-icon\" src=\"/img/customer.png\"></button>" +
        "</td></tr>"
    });
    itemInfoListTable.innerHTML=rows;
}

/* 검색 버튼 이벤트 */
async function searchBtnEvent(){
    const input_search = document.getElementById('input_search').value;
    const searchCategory = document.getElementById('searchCategory').value;
    const parentCategory = document.getElementById('parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text;
    const childCategory = document.getElementById('childCategory');
    const childCategoryVal = childCategory.options[childCategory.selectedIndex].text;

    /* 검색 항목 선택 별 API URL 설정 */
    let URL;
    if(searchCategory === "itemName")
        URL = '/itemmanagement/find/item/' + parentCategoryVal + "/" + childCategoryVal + "/" + input_search;
    else
        URL = '/itemmanagement/find/lender/' + parentCategoryVal + "/" + childCategoryVal + "/" + input_search;;
    if(!input_search){
        window.alert("검색내용을 입력하세요");
        return;
    }

    /* 검색 데이터 요청 */
    await fetch(URL, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            itemsRender(item.items);
        }).catch((err) => {
            window.alert(err);
            console.log(err);
    });
}

/* 대분류 선택 이벤트 */
async function changeParentCategory(){
    const parentCategory = document.getElementById('parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text;
    const childCategory = document.getElementById('childCategory');
    document.getElementById('input_search').value = null; // 검색창 비우기

    let rows = "<option value=''>소분류 전체</option>"; // 소분류 default 렌더링
    /* 분류 항목이 전체 일 시 전체 데이터 API 요청, 카테코리 선택 시 카테고리 API로 데이터 요청 */
    let URL;
    if(parentCategoryVal === "대분류 전체"){
        childCategory.innerHTML = rows; // 대분류가 전체 일 시 소분류도 전체로 변경
        URL = 'itemmanagement/findAll/';
    } else{
        URL = 'itemmanagement/find/item/parentCategory/' + parentCategoryVal;

        // 대분류가 전체가 아니면 대분류에 해당하는 소분류 카테고리를 불러오는 API 요청
        await fetch('itemmanagement/find/childcategory/' + parentCategoryVal, {
            method: 'get'
        })
            .then((res) => res.json())
            .then((item) => {
                // 받아온 데이터 소분류 select의 option 렌더링
                item.children.children.map(res => {
                    rows += "<option value=" + res + ">" + res + "</option>";
                });
                childCategory.innerHTML = rows;
            }).catch((err) => {
                window.alert(err);
                console.log(err);
            });
    }

    // 조건에 따라 물품 데이터 요청
    await fetch(URL, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            itemsRender(item.items);
        }).catch((err) => {
            window.alert(err);
    });
}

/* 소분류 선택 이벤트 */
async function changeChildCategory(){
    const childCategory = document.getElementById('childCategory');
    const childCategoryVal = childCategory.options[childCategory.selectedIndex].text;
    document.getElementById('input_search').value = null; // 검색창 비우기
    /* 소분류가 전체 일 시 대분류에 따라 데이터 렌더링*/
    if(childCategoryVal === "소분류 전체"){
        await changeParentCategory();
        return;
    }

    // 조건에 따라 물품 데이터 요청
    await fetch('itemmanagement/find/item/childCategory/' + childCategoryVal, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            itemsRender(item.items);
        }).catch((err) => {
            window.alert(err);
        });
}

/* 테이블 데이터 정렬 */
let sortType = 'asc';
function tableSort(index) {
    let table = document.getElementsByTagName('table');

    sortType = (sortType =='asc')?'desc' : 'asc';

    let checkSort = true;
    let rows = table[0].rows;

    while (checkSort) { // 현재와 다음만 비교하기때문에 위치변경되면 다시 정렬해준다.
        checkSort = false;

        for (let i = 1; i < (rows.length - 1); i++) {
            let fCell = rows[i].cells[index].innerHTML.toUpperCase();
            let sCell = rows[i + 1].cells[index].innerHTML.toUpperCase();

            let row = rows[i];

            // 오름차순<->내림차순 ( 이부분이 이해 잘안됬는데 오름차순이면 >, 내림차순이면 <
            //                        이고 if문의 내용은 동일하다 )
            if ( (sortType == 'asc' && fCell > sCell) ||
                (sortType == 'desc' && fCell < sCell) ) {

                row.parentNode.insertBefore(row.nextSibling, row);
                checkSort = true;
            }
        }
    }
}

/* 물품 편집 */
function editItem(id){
    console.log(id);
}

/* 물품 삭제 */
async function deleteItem(id){
    if(window.confirm("정말 삭제하시겠습니까?") === true){
        await fetch('itemmanagement/delete/' + id, {
            method: 'delete'
        })
            .then((res) => res.json())
            .then((result) => {
                window.alert(result.message);
            }).catch((err) => {
                window.alert(err);
            });
    }
    else{
        return;
    }


}

let lendersModal = document.querySelector('.lenders_modal');
function lenderList(name, lender){
    lendersModal.classList.toggle('show');
    const modalbody = document.getElementById('lenders_modal_body');

    let rows = "<h3>" + name + " 대여자 목록</h3><br/><ul>"
    lender.map((lenders) => {
        rows += "<li>사번 : " + lenders.workNumber + " / 이름 : " + lenders.name + "</li>";
    })
    rows += "</ul>";
    modalbody.innerHTML = rows;

    if(modal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

lendersModal.addEventListener('click', (e) => {
    if(e.target === lendersModal){
        lendersModal.classList.toggle('show');

        if(!modal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
})

async function enterKeyUp(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){
        await searchBtnEvent();
    }
}

let enterKey = document.getElementById('itemSearch');
enterKey.addEventListener('keyup', event => enterKeyUp(event));