/**
 * 담당자 : 정희성
 * 파일 설명 : 탭메뉴를 통해 대여 중 물품 혹은 대여 및 반납 물품을 띄어주는 기능을 작성한 스크립트 파일
 * **/
const tabItem = document.querySelectorAll(".tab-container__item");
const tabContent = document.querySelectorAll(".content-container__content");

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