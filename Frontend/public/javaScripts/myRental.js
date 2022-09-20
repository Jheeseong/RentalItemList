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