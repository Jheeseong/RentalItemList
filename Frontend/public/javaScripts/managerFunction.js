let lendersModal = document.querySelector('.lenders_modal');
function lenderList(name, rentInfo){
    lendersModal.classList.toggle('show');
    const modalbody = document.getElementById('lenders_modal_body');

    let rows = "<h3>" + name + " 대여자 목록</h3><br/><ul>"
    rentInfo.map((lenders) => {
        rows += "<li>사번 : " + lenders.workNumber + " / 이름 : " + lenders.userName + "</li>";
    })
    rows += "</ul>";
    modalbody.innerHTML = rows;

    if(lendersModal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

lendersModal.addEventListener('click', (e) => {
    if(e.target === lendersModal){
        lendersModal.classList.toggle('show');

        if(!lendersModal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
});


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

let historyModal = document.querySelector('.history_modal');
async function rentHistory(itemInfo){

    historyModal.classList.toggle('show');

    const modal_iteminfo = document.getElementById('modal_iteminfo');
    modal_iteminfo.innerHTML = "<h4>" + itemInfo.category.parentCategory + " > " +
        itemInfo.category.childCategory +
        "</h4><h4> 물품 코드 : " + itemInfo.code +
        "</h4><h4> 물품명 : " + itemInfo.name + "</h4>"

    const historyTable = document.getElementById('history_table_body')
    let rows = "";
    await fetch('itemmanagement/history/' + itemInfo._id, {
        method: 'get'
    }).then((res) => res.json())
        .then((history) => {
            console.log(history.histories);
            history.histories.map((res) => {
                console.log(res);
                rows += "<tr><td>"+ (res.rentStatus ? "대여중" : "반납") + "</td>" +
                    "<td>"+ res.userName + "</td>" +
                    "<td>"+ res.purpose + "</td>" +
                    "<td>"+ dateFormatter(res.rentDate) + "</td>" +
                    "<td>"+ (itemInfo.available.return ? (dateFormatter(res.rentStatus ? res.returnPlanDate : res.returnDate)) : "반납불필요") + "</td></tr>";
            })
            historyTable.innerHTML = rows;
        }).catch((err) => {
            console.log(err);
        })

    if(historyModal.classList.contains('show')){
        body.style.overflow = 'hidden';
    }
}

historyModal.addEventListener('click', (e) => {
    if(e.target === historyModal){
        historyModal.classList.toggle('show');
        document.getElementById('history_table_body').innerHTML = null;

        if(!historyModal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
});

function dateFormatter(date){
    date = new Date(date);
    return date.getFullYear()
        + "년 " + (date.getMonth() + 1)
        + "월 " + date.getDate()
        + "일 " + date.getHours()
        + "시 " + date.getMinutes() + "분"


}