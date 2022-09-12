let rentModal = document.querySelector('.rent_modal');
function rentModalView(itemInfo){

    const itemInformation = document.getElementById('itemInfoList');
    itemInformation.innerHTML = "<li>물품명 : " + itemInfo.name + "</li>" +
        "<li> 물품코드 : " + itemInfo.code +"</li>"

    if(itemInfo.available.rental === false){
        return window.alert("대여불가 물품입니다.");
    }else{
        const rentModalBody = document.getElementById('rent_modal_body');
        rentModalBody.innerHTML += "<input type='hidden' id='itemCode' value='" + itemInfo.code + "'>";

        document.getElementById('rentDate').value = new Date().toISOString().slice(0, 16);
        document.getElementById('rentDate').min = new Date().toISOString().slice(0, 16);
        document.getElementById('returnDate').value = new Date().toISOString().slice(0, 16);
        document.getElementById('returnDate').min = new Date().toISOString().slice(0, 16);

        rentModal.classList.toggle('show');

        if(rentModal.classList.contains('show')){
            body.style.overflow = 'hidden';
        }
    }


}

function changeRentDate(){
    document.getElementById('returnDate').value = document.getElementById('rentDate').value;
    document.getElementById('returnDate').min = document.getElementById('rentDate').value;
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
    const rentItem = {
        itemCode : document.getElementById('itemCode').value,
        purpose : document.getElementById('purpose').value,
        rentDate : document.getElementById('rentDate').value,
        returnPlanDate : document.getElementById('returnDate').value
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

function cancel(){
    rentModal.classList.toggle('show');
}