let rentModal = document.querySelector('.rent_modal');
function rentModalView(itemName, itemCode){
    rentModal.classList.toggle('show');
    const itemInformation = document.getElementById('itemInfoList');
    itemInformation.innerHTML = "<li>물품명 : " + itemName + "</li>" +
        "<li> 물품코드 : " + itemCode +"</li>"

    if(rentModal.classList.contains('show')){
        body.style.overflow = 'hidden';
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