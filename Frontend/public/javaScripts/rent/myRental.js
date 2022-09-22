/**
 * 담당자 : 강재민, 정희성
 * 파일 설명 : 나의 대여현황 및 마이페이지에 필요한 함수들을 구성하기 위한 javaScript 파일 입니다.
 */

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
const editUserModal = document.querySelector('.editUserModal');
function editUser() {
    const role_edit = document.getElementById('myPage_role_edit')

    editUserModal.classList.toggle('show');

    if (editUserModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
}
let checkPasswordBoolean = false;
let checkPasswordConfirm = false;
let checkEmailBoolean = true;

function edit(workNumber) {
    if (checkEmailBoolean === true) {
        let editUserInfo = {
            name: document.getElementById('myPage_name_edit').value,
            department: document.getElementById('myPage_department_edit').value,
            role: document.getElementById('myPage_role_edit').value,
            email: document.getElementById('myPage_email_edit').value,
        };

        fetch('myRental/update/' + workNumber, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editUserInfo),
        }).then((res) => res.json())
            .then((result) => {
                window.alert(result.message);
                window.location.reload(true);
            })
            .catch((err) => {
                console.log(err)
                window.alert("회원 정보 수정을 다시해주세요.")
            })
    }else {
        window.alert("회원 정보 수정 내용을 다시 확인해주세요.")
    }
}
function passwordEdit(workNumber) {
    if (checkPasswordBoolean && checkPasswordConfirm === true) {
        let editUserInfo = {
            password: document.getElementById('myPage_password_edit').value
        };

        fetch('myRental/update/password/' + workNumber, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editUserInfo),
        }).then((res) => res.json())
            .then((result) => {
                window.alert(result.message);
                window.location.reload(true);
            })
            .catch((err) => {
                console.log(err)
                window.alert("비밀번호 수정을 다시 해주세요.")
            })
    }else {
        window.alert("비밀번호 수정을 다시 확인해주세요.")
    }
}
editUserModal.addEventListener('click', (event) => {
    if (event.target === editUserModal) {
        editUserModal.classList.toggle('show');

        if (!editUserModal.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

function passwordEditTest(){
    const password = document.getElementById("myPage_password_edit").value;
    const passwordConfirm = document.getElementById("myPage_passwordConfirm_edit").value;
    let message = ""
    let color = "";
    let confirmMessage = ""
    let confirmColor = "";

    if (password.length) {
        if (password.length < 4) {
            message = "최소 4자리 이상 입력해주세요!";
            color = "#da2638";
            checkPasswordBoolean = false;
        } else {
            checkPasswordBoolean = true;
        }
    }else {
        checkPasswordBoolean = true;
    }

    if (passwordConfirm.length) {
        if (password != passwordConfirm) {
            confirmMessage = "비밀 번호를 다시 확인해주세요!";
            confirmColor = "#da2638";
            checkPasswordConfirm = false;
        } else {
            checkPasswordConfirm = true;
        }
    } else {
        checkPasswordConfirm = true;
    }
    document.getElementById("password_message_edit").innerHTML = message;
    document.getElementById("password_message_edit").style.color = color;
    document.getElementById("passwordConfirm_message_edit").innerHTML = confirmMessage
    document.getElementById("passwordConfirm_message_edit").style.color = confirmColor;

}
function emailEditTest() {
    function checkEditEmail(str) {
        const reg_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]*[.][0-9a-zA-Z]*.[a-zA-Z]{2,3}$/i
        if (!reg_email.test(str)) {
            return false;
        } else {
            return true;
        }
    }
    const email = document.getElementById("myPage_email_edit").value;
    let message="";
    let color="";
    if (email.length) {
        if (!checkEditEmail(email)) {
            message = "이메일 형식이 잘못되었습니다!";
            color = "#da2638";
            checkEmailBoolean = false;
        } else {
            checkEmailBoolean = true;
        }
    } else {
        message = "이메일을 입력해주세요!"
        color = "#da2638"
        checkEmailBoolean = false;
    }
    document.getElementById("email_message_edit").innerHTML = message;
    document.getElementById("email_message_edit").style.color = color;
}