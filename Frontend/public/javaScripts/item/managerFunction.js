/**
 * 담당자 : 강재민
 * 파일 설명 : 물품관리에서 관리자기능에 필요한 함수들을 구성하기 위한 javaScript 파일 입니다.
 */

/**
 * 담당자 : 강재민
 * 함수 설명 : 대여자 목록 버튼을 클릭 했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 기존에 물품관리를 Render 할때 받아왔던 데이터들을 이용하여 데이터를 가공하였습니다.
 *              - 대여정보의 수를 파악하여 대여자가 없으면 '대여자가 없습니다' 를 표시하도록 하였습니다.
 *              - populate를 통해 받아온 대여(rents) 컬렉션의 정보에서 사번과 이름을 추출하여 테이블에 바인딩해주었습니다.
 */
let lendersModal = document.querySelector('.lenders_modal');
function lenderList(name, rentInfo){ // 인자로 물품명과 대여정보를 받아옴.
    lendersModal.classList.toggle('show');
    document.getElementById('title').innerHTML = "<h3>" + name + " 대여자 목록</h3><br/>";

    let rows= "";
    if(rentInfo.length){ // 대여정보가 있을 시 -> 사번과 이름을 테이블에 렌더 해주었음.
        rentInfo.map((lenders) => {
            rows += "<tr><td>" + lenders.workNumber + "</td>" +
                "<td>" + lenders.userName + "</td></tr>";
        })
    } else{ // 대여정보가 없을 시
        rows += "<p style='color: red'> 대여자가 없습니다. </p>"
    }

    // 테이블에 추가
    document.getElementById('lenders_table_body').innerHTML = rows;

    if(lendersModal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

// 대여자 정보 모달 컨트롤
lendersModal.addEventListener('click', (e) => {
    if(e.target === lendersModal){
        lendersModal.classList.toggle('show');

        if(!lendersModal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
});


/**
 * 담당자 : 강재민
 * 함수 설명 : 물품 삭제를 클릭 했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 물품 삭제 시 물품(items) 컬렉션에서 delete 값을 true로 변경해주었습니다.
 *              - 물품이 삭제되어도 대여이력에서 물품의 정보를 불러올 수 있게 하기 위해 데이터를 완전히 삭제하지 않도록 하였습니다.
 */
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
    else{ // confirm 창에서 취소 클릭
        return;
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 물품 대여 이력 버튼을 클릭했을 때 실행되는 이벤트입니다.
 * 주요 기능 : - 물품 대여 이력 버튼을 클릭 했을 때 모달이 띄워지도록 하였습니다.
 *              - 인자로 물품정보 값을 받아와 분류와 코드, 물품명을 표시해주었습니다.
 *              - 물품정보의 물품 _id 값으로 대여(rents) 컬렉션에서 대여 정보를 검색하여 바인딩해주었습니다.
 *              - 대여 이력이 없을 경우 '대여 이력이 존재하지 않습니다.' 를 표시해 주었습니다.
 */
let historyModal = document.querySelector('.history_modal');
async function rentHistory(itemInfo){

    historyModal.classList.toggle('show');
    // 모달에 물품 정보 표시
    const modal_iteminfo = document.getElementById('modal_iteminfo');
    modal_iteminfo.innerHTML = `<h4>${itemInfo.category.parentCategory} > ${itemInfo.category.childCategory}</h4>` +
        `<h4> 물품 코드 :  ${itemInfo.code}</h4>` +
        `<h4> 물품명 : ${itemInfo.name}</h4>`

    // 물품 _id로 대여이력 조회
    const historyTable = document.getElementById('history_table_body')
    let rows = "";
    await fetch('itemmanagement/history/' + itemInfo._id, {
        method: 'get'
    }).then((res) => res.json())
        .then((history) => {
            if(history.histories.length){ // 물품 대여 이력이 있을 경우
                history.histories.map((res) => {
                    rows += `<tr><td>${res.rentStatus ? "대여중" : "반납"}</td>` +
                        `<td>${res.userName}</td>` +
                        `<td>${res.purpose}</td>` +
                        `<td>${dateFormatter(res.rentDate)}</td>` +
                        `<td>${(itemInfo.available.return ?  (dateFormatter(res.rentStatus ? res.returnPlanDate : res.returnDate)) : "반납불필요")}</td></tr>`;
                        // 반납 필요 여부가 false 일 시에는 "반납불필요"를 표시, 대여 중이면 반납 예정일을, 반납 상태이면 반납일을 표시
                })
            } else{ // 물품 대여 이력이 없을 경우
                rows += `<p style='color: red'>대여 이력이 존재하지 않습니다.</p>`
            }

            historyTable.innerHTML = rows;
        }).catch((err) => {
            console.log(err);
        })

    if(historyModal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

// 물품 대여 이력 모달 컨트롤
historyModal.addEventListener('click', (e) => {
    if(e.target === historyModal){
        historyModal.classList.toggle('show');
        document.getElementById('history_table_body').innerHTML = null;

        if(!historyModal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
});

/**
 * 담당자 : 강재민
 * 함수 설명 : 데이터를 받아 왔을 때 날짜 형식을 보기 좋게 변경하기 위한 함수입니다.
 * 주요 기능 : - 날짜 데이터를 사용자가 보기 쉽도록 "년월일시분" 형식으로 변경하도록 하였습니다.
 */
function dateFormatter(date){
    date = new Date(date);
    return `${date.getFullYear()}년 ${(date.getMonth() + 1)}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`


}