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

function tabRent(){
    document.getElementById('dd-return').class = null;
    document.getElementById('dd-rent').class = "hiddenTab"
}

function tabReturn(){
    document.getElementById('dd-rent').class = null;
    document.getElementById('dd-return').class = "hiddenTab"

}