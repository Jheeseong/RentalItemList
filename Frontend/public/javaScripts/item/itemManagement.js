/**
 * 담당자 : 강재민
 * 파일 설명 : 물품관리페이지의 전반적인 기능들을 담당하는 JavaScript 파일 입니다.
 */


/**
 * 담당자 : 강재민
 * 함수 설명 : 검색, 카테코리 선택 등 물품 정보 테이블 내용 변경이 필요할 때 테이블의 내용을 변경해주는 함수입니다.
 * 주요 기능 : - 권한에 따라 엑셀로 변환 버튼을 생성할 것인지 여부를 판단하고, 새로 받아온 데이터에 따라 onclick 이벤트의 함수 인자를 변경하여 재생성하였습니다.
 *              - 물품 정보들이 변경될 때 함수를 실행하여 데이터를 재바인딩 시켜주었습니다.
 *              - 권한에 따라 관리자 기능 버튼을 제한하였습니다.
 */
function itemsRender(items, auth){
    const itemInfoListTable = document.getElementById('tr_itemInfoList');
    const divPutExcel = document.getElementById('div-put-excel');
    let rows = "<div></div>";

    if(auth.openAuthority){ // 열람권한 여부 확인
        divPutExcel.innerHTML =
            `<button class='btn-put-excel' id='btn_put_excel' onClick='putExcel(${JSON.stringify(items)})'><img class='excel-icon' src='/img/excel.png'>&nbsp 엑셀로 변환</button>`
    } // 엑셀 onclick 인자를 새로운 데이터로 변경

    // 테이블에 새로운 데이터 바인딩
    items.map(res => {
        rows += `<tr><td>${res.category.parentCategory}</td>` +
        `<td>${res.category.childCategory}</td>` +
        `<td class='btn-rent' onclick='rentModalView(${JSON.stringify(res)})'>${res.name}</td>` +
        `<td>${res.code}</td>` +
        `<td>${(res.available.rental ? 'O' : 'X')}</td>` +
        `<td>${(res.available.return ? 'O' : 'X')}</td>` +
        `<td>${(res.available.return ? 'O' : 'X')}</td>` +
        `<td>${(res.count.all - res.count.renting)}</td>` +
        `<td>${res.count.renting}</td>` +
        `<td>${res.count.all}</td>` +
        `<td>${dateFormatter(res.createDate)}</td><td>`;
        if(auth.editAuthority){ // 편집 권한 여부 확인(편집, 삭제 버튼)
            rows += `<button title='물품 편집' class='btn-manager' onclick='editItem("${res._id}")'><img class='manage-icon' src='/img/edit.png'></button>` +
                    `<button title='물품 삭제' class='btn-manager' onclick='deleteItem("${res._id}")'><img class='manage-icon' src='/img/trash.png'></button>`;
        }
        if(auth.openAuthority){ // 열람 권한 여부 확인(대여자 목록, 물품 대여 이력 버튼)
            rows += `<button title='대여자 목록' class='btn-open-lender btn-manager' onclick='lenderList("${res.name}", ${JSON.stringify(res.rentInfo)})'><img class="manage-icon" src="/img/customer.png"></button>` +
                    `<button title='물품 대여 이력' class='btn-open-rentHistory btn-manager' onClick='rentHistory(${JSON.stringify(res)})'><img class='manage-icon' src='/img/history.png'></button>`;
        }
        rows += "</td></tr>";
    });
    itemInfoListTable.innerHTML=rows;
}

/* 검색 버튼 이벤트 */
/**
 * 담당자 : 강재민
 * 함수 설명 : 검색 버튼을 클릭했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 검색 분류별로 다른 API를 사용하여 검색하도록 설정
 *              - 대분류, 소분류를 받아와 분류에 해당하는 데이터만 검색할 수 있도록 설정
 */
async function searchBtnEvent(){
    const input_search = document.getElementById('input_search').value; // 검색 키워드
    const searchCategory = document.getElementById('searchCategory').value; // 검색 분류
    const parentCategory = document.getElementById('parentCategory'); // 대분류
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text;
    const childCategory = document.getElementById('childCategory'); // 소분류
    const childCategoryVal = childCategory.options[childCategory.selectedIndex].text;

    /* 검색 항목 선택 별 API URL 설정 */
    let URL;
    if(searchCategory === "itemName") // 물품 이름으로 검색
        URL = '/itemmanagement/find/item/' + parentCategoryVal + "/" + childCategoryVal + "/" + input_search;
    else // 대여자 이름으로 검색
        URL = '/itemmanagement/find/lender/' + parentCategoryVal + "/" + childCategoryVal + "/" + input_search;

    if(!input_search){ // 검색 키워드란이 비어있을 경우
        window.alert("검색내용을 입력하세요");
        return;
    }

    // 검색 데이터 요청
    await fetch(URL, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            itemsRender(item.items, item.authority); // 아이템 정보와 권한 정보로 Render 함수 실행
        }).catch((err) => {
            window.alert(err);
            console.log(err);
    });
}

/* 대분류 선택 이벤트 */
/**
 * 담당자 : 강재민
 * 함수 설명 : 대분류 Select를 선택했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 대분류 선택에 따라 대분류에 해당하는 소분류들을 소분류 Select창에 바인딩
 *              - 대분류가 변경됨에 따라 대분류에 해당하는 데이터들을 렌더링
 *              - 대분류가 '대분류 전체' 인 경우 소분류도 '소분류 전체'로 변경
 */
async function changeParentCategory(){
    const parentCategory = document.getElementById('parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text;
    const childCategory = document.getElementById('childCategory');
    document.getElementById('input_search').value = null; // 검색창 비우기

    let rows = `<option value=''>소분류 전체</option>`; // 소분류 default 렌더링
    /* 분류 항목이 전체 일 시 전체 데이터 API 요청, 카테코리 선택 시 카테고리 API로 데이터 요청 */
    let URL;
    if(parentCategoryVal === "대분류 전체"){
        childCategory.innerHTML = rows; // 대분류가 전체 일 시 소분류도 전체로 변경
        URL = 'itemmanagement/findAll/'; // 전체 데이터 검색
    } else{
        URL = 'itemmanagement/find/item/parentCategory/' + parentCategoryVal; // 대분류에 해당하는 데이터 검색

        // 대분류가 전체가 아니면 대분류에 해당하는 소분류 카테고리를 불러오는 API 요청
        await fetch('itemmanagement/find/childcategory/' + parentCategoryVal, {
            method: 'get'
        })
            .then((res) => res.json())
            .then((item) => {
                // 받아온 데이터 소분류 select의 option 렌더링
                item.children.children.map(res => {
                    rows += `<option value="${res}">${res}</option>`;
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
            itemsRender(item.items, item.authority); // 받아온 데이터 Render
        }).catch((err) => {
            window.alert(err);
    });
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 소분류 Select를 선택했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 소분류가 전체일 때는 대분류에 따라 데이터를 재 렌더링
 *              - 변경된 소분류에 따라 소분류에 해당하는 데이터만 검색후 재 렌더링
 */
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
            itemsRender(item.items, item.authority); // 받아온 데이터 Render
        }).catch((err) => {
            window.alert(err);
        });
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 테이블을 정렬해주는 함수 입니다.
 * 주요 기능 : - 테이블 head 에서 클릭한 컬럼에 따라 그 컬럼 번호를 입력받아 그 컬럼에 따라 정렬
 */
let sortType = 'asc';
function tableSort(index) {
    let table = document.getElementsByTagName('table');

    sortType = (sortType =='asc')?'desc' : 'asc'; // 오름차순 내림차순 클릭 때마다 변경

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

/**
 * 담당자 : 강재민
 * 함수 설명 : Enter 키 이벤트 함수 입니다.
 * 주요 기능 : - Enter 키를 누를 경우 검색 이벤트 실행
 */
async function enterKeyUp(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){
        await searchBtnEvent();
    }
}
let enterKey = document.getElementById('itemSearch');
enterKey.addEventListener('keyup', event => enterKeyUp(event));

/**
 * 담당자 : 강재민
 * 함수 설명 : 데이터를 받아 왔을 때 날짜 형식을 보기 좋게 변경하기 위한 함수입니다.
 * 주요 기능 : - 날짜 데이터를 사용자가 보기 쉽도록 "yyyy.mm.dd" 형식으로 변경하도록 하였습니다.
 */
function dateFormatter(date){
    date = new Date(date);
    let y = date.getFullYear().toString();
    let mon = (date.getMonth() + 1).toString();
    let d = date.getDate().toString();
    let fullDate = y+ "." + mon + "." + d;
    return fullDate;

}