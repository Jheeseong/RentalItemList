/**
 * 담당자 : 강재민
 * 파일 설명 : 물품 대여에 필요한 함수들을 구성하기 위한 javaScript 파일 입니다.
 */

let rentModal = document.querySelector('.rent_modal');
/**
 * 담당자 : 강재민
 * 함수 설명 : 물품관리 페이지에서 물품을 대여하기위해 클릭 했을 때 실행되는 이벤트 함수 입니다.
 * 주요 기능 : - 물품에 대한 정보를 인자로 받아 물품에 대한 정보를 페이지에서 볼 수 있도록 합니다.
 *              - 대여 시간과 반납 시간 input을 현재시간으로 변경해 줍니다.
 *              - 반납이 필요없는 물품의 경우에는 반납일을 지정할 수 없도록 하였습니다.
 */
function rentModalView(itemInfo){

    // 물품 클릭 시 대여가 불가능한 상품이면 에러메시지를 띄워 주도록 함
    if(itemInfo.available.rental === false){
        return window.alert("대여불가 물품입니다.");
    }else{ // 대여 가능일 시
        const rentModalBody = document.getElementById('rent_modal_body');
        // 대여 신청 시 필요한 정보를 받아와 사용하기 위해 hidden으로 데이터들을 넣어주었음
        rentModalBody.innerHTML += `<input type='hidden' id='itemCode' value='${itemInfo.code}'>`
        + `<input type='hidden' id='itemId' value='${itemInfo._id}'>`
        + `<input type='hidden' id='returnAvailable' value='${itemInfo.available.return}'>`;
        // 모달 내 물품 정보 표시
        document.getElementById('ItemNameValue').value = itemInfo.name;
        document.getElementById('itemCodeValue').value = itemInfo.code;

        // 대여시간과 반납시간 input을 현재시간으로 변경하고 최소 날짜를 현재 날짜로 변경
        const currTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        document.getElementById('rentDate').value = currTime;
        document.getElementById('rentDate').min = currTime;
        document.getElementById('returnDate').value = currTime;
        document.getElementById('returnDate').min = currTime;

        // 반납필요여부가 FALSE일 시 반납일을 입력할 수 없도록 함
        if(itemInfo.available.return === false){
            document.getElementById('returnDate').disabled = true;
        }

        // 모달을 사용자에게 보여주도록 함
        rentModal.classList.toggle('show');

        if(rentModal.classList.contains('show')){
            body.style.overflow = 'hidden';
        }
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 물품대여 모달에서 대여일이 수정되었을 때 실행되는 이벤트 함수 입니다.
 * 주요 기능 : - 대여시간이 현재시간보다 이전으로 선택 되었을 경우 이전으로 선택할 수 없도록 에러 메시지 표시 후 현재시간으로 설정
 *              - 반납시간이 현재시간보다 이전으로 선택 된 경우 대여시간과 동일하도록 변경되도록 하였습니다.
 */
function changeRentDate(){
    // 대여시간이 현재시간보다 이전일 경우 에러 메시지 표시 후 현재시간으로 재설정
    const currTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    if(document.getElementById('rentDate').value < currTime){
        document.getElementById('rentDate').value = currTime;
        return window.alert("대여시간을 현재시간보다 이전으로 선택할 수 없습니다.");
    }

    // 반납시간이 선택한 대여시간보다 이전일 경우 현재선택된 대여시간으로 변경
    if(document.getElementById('returnDate') < document.getElementById('rentDate').value){
        document.getElementById('returnDate').value = document.getElementById('rentDate').value;
        document.getElementById('returnDate').min = document.getElementById('rentDate').value;
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 물품대여 모달에서 반납일이 수정되었을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 반납시간이 대여시간보다 이전인 경우 에러메시지를 표시하고 대여시간과 같도록 변경합니다.
 */
function changeReturnDate(){
    if(document.getElementById('rentDate').value >= document.getElementById('returnDate').value){
        document.getElementById('returnDate').value = document.getElementById('rentDate').value
        return window.alert("반납시간을 대여시간과 같거나 대여시간 이전으로 설정할 수 없습니다.");
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 대여하기 버튼을 클릭했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 입력된 데이터와 물품정보를 받아와 DB에 저장하도록 하였습니다.
 *              - rents 컬렉션에 정보를 저장하고, items 컬렉션에서 대여정보 입력 및 대여중 수량이 증가되도록 하였습니다.
 */
async function rentSubmit(){
    if(window.confirm("물품을 대여하시겠습니까?") === true) { // 대여 여부 확인
        const rentItem = { // 물품 대여 정보
            itemId: document.getElementById('itemId').value,
            itemCode : document.getElementById('itemCode').value,
            purpose : document.getElementById('purpose').value,
            rentDate : document.getElementById('rentDate').value,
            returnPlanDate : document.getElementById('returnDate').value,
            returnAvailable : document.getElementById('returnAvailable').value
        }

        // post로 물품 정보 전송
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
                } else{
                    window.alert(res.message);
                }
            }).catch((err) => {
                console.log(err);
            })
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 모달창을 닫기 위한 함수입니다.
 * 주요 기능 : - 모달창 밖을 클릭 했을 때 모달 창이 닫히고, 모달 창 내에서 클릭을 했을 때는 반응하지 않습니다.
 */
rentModal.addEventListener('click', (e) => {
    if(e.target === rentModal){
        rentModal.classList.toggle('show');

        if(!rentModal.classList.contains('show')){
            body.style.overflow = 'auto';
        }
    }
})

/**
 * 담당자 : 강재민
 * 함수 설명 : 취소버튼 클릭시 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 취소 버튼을 클릭했을 때 모달창이 닫힙니다.
 */
function cancel(){
    rentModal.classList.toggle('show');
}