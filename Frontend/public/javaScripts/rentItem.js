let rentModal = document.querySelector('.rent_modal');
function rentModalView(itemInfo){

    const itemInformation = document.getElementById('itemInfoList');
    itemInformation.innerHTML = "<li>물품명 : " + itemInfo.name + "</li>" +
        "<li> 물품코드 : " + itemInfo.code +"</li>"

    if(itemInfo.available.rental === false){
        return window.alert("대여불가 물품입니다.");
    }else{
        const rentModalBody = document.getElementById('rent_modal_body');
        rentModalBody.innerHTML += "<input type='hidden' id='itemCode' value='" + itemInfo.code + "'>"
        + "<input type='hidden' id='itemId' value='" + itemInfo._id + "'>"
        + "<input type='hidden' id='returnAvailable' value='" + itemInfo.available.return + "'>";

        const currTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

        document.getElementById('rentDate').value = currTime;
        document.getElementById('rentDate').min = currTime;

        if(itemInfo.available.return === false){
            document.getElementById('returnDate').disabled = true;
        }

        document.getElementById('returnDate').value = currTime;
        document.getElementById('returnDate').min = currTime;

        rentModal.classList.toggle('show');

        if(rentModal.classList.contains('show')){
            body.style.overflow = 'hidden';
        }
    }


}

function changeRentDate(){
    const currTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    if(document.getElementById('rentDate').value < currTime){
        document.getElementById('rentDate').value = currTime;
        return window.alert("대여시간을 현재시간보다 이전으로 선택할 수 없습니다.");
    }
    document.getElementById('returnDate').value = document.getElementById('rentDate').value;
    document.getElementById('returnDate').min = document.getElementById('rentDate').value;
}

function changeReturnDate(){
    if(document.getElementById('rentDate').value >= document.getElementById('returnDate').value){
        document.getElementById('returnDate').value = document.getElementById('rentDate').value
        return window.alert("반납시간을 대여시간과 같거나 대여시간 이전으로 설정할 수 없습니다.");
    }
}

rentModal.addEventListener('click', (e) => {
    if(e.target === rentModal){
        rentModal.classList.toggle('show');

        if(!rentModal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
})

async function rentSubmit(){
    if(window.confirm("물품을 대여하시겠습니까?") === true) {
        const rentItem = {
            itemId: document.getElementById('itemId').value,
            itemCode : document.getElementById('itemCode').value,
            purpose : document.getElementById('purpose').value,
            rentDate : document.getElementById('rentDate').value,
            returnPlanDate : document.getElementById('returnDate').value,
            returnAvailable : document.getElementById('returnAvailable').value
        }

        await fetch('rentItem/rent', {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(rentItem)
        }).then((res) => res.json())
            .then((res) => {
                if(res.rentSuccess){
                    window.alert("물품 대여에 성공하였습니다.");
                    window.location.reload();
                }
            }).catch((err) => {
                console.log(err);
            })
    }
}





function cancel(){
    rentModal.classList.toggle('show');
}