/**
 * 담당자 : 강재민, 정희성
 * 파일 설명 : 나의 대여현황 및 탭메뉴에 필요한 함수들을 구성하기 위한 javaScript 파일 입니다.
 */

const tabItem = document.querySelectorAll(".tab-container__item");
const tabContent = document.querySelectorAll(".content-container__content");

/**
 * 담당자 : 정희성
 * 함수 설명 : 해당 탭메뉴를 띄어주고 띄운 메뉴 색상을 변경해주는 함수
 * 주요 기능 : 탭메뉴 클릭 시 해당 메뉴를 띄어주는 기능
 *            클릭한 메뉴 색상을 변경해주는 기능
 * **/
tabItem.forEach((item) => {
    item.addEventListener("click", tabHandler);
});

function tabHandler(item) {
    const tabTarget = item.currentTarget;
    const target = tabTarget.dataset.tab;
    tabItem.forEach((title) => {
        title.classList.remove("active");
    });
    tabContent.forEach((target) => {
        target.classList.remove("target");
    });
    document.querySelector("#" + target).classList.add("target");
    tabTarget.classList.add("active");
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 물품반납하기 버튼 클릭 이벤트 입니다.
 * 주요 기능 : - 반납 시 반납 API와 통신하여 물품을 반납하도록 처리하였습니다.
 *              - 아이템(items) 컬렉션에서 대여자정보를 삭제하고, 대여중수량을 증가 시켜주도록 하였습니다.
 *              - 대여(rents) 컬렉션에서 대여 상태를 반납으로 변경하고, 반납일을 저장해주도록 하였습니다.
 */
async function returnItem(rentId, itemId){
    if(window.confirm("물품을 반납하시겠습니까?") === true){
        await fetch('myRental/returnItem/' + rentId + "/" +itemId, {
            method: 'get'
        })
            .then((res) => res.json())
            .then((result) => {
                if(result.returnSuccess){
                    window.alert("물품이 정상적으로 반납되었습니다.");
                    window.location.reload();
                }
            })
    }
}