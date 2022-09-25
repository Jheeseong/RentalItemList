/**
 * 담당자 : 정희성
 * 함수 설명 : 회원 정보 수정 모달창 띄어주는 함수
 * 주요 기능 : 모달창을 띄어주고 모달창 바디 외에 나머지는 어둡게 처리
 * **/
const editUserModal = document.querySelector('.editUserModal');
function editUser() {

    editUserModal.classList.toggle('show');

    if (editUserModal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 회원 정보 수정 모달창 외부 클릭 시 꺼지는 함수
 * 주요 기능 : 모달창 외부 클릭 시 모달을 꺼주고 뭔래 색상으로 돌려주는 기능
 * **/
editUserModal.addEventListener('click', (event) => {
    if (event.target === editUserModal) {
        editUserModal.classList.toggle('show');

        if (!editUserModal.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

/**
 * 담당자 : 정희성
 * 함수 설명 : 유저의 변경 내용을 저장해주는 함수
 * 주요 기능 : 접속한 유저의 사번을 통해 유저를 찾은 후 업데이트 해주는 기능
 *            Input에 기록된 value 값을 가져와서 post 전송을 통해 저장되는 기능
 *            이메일의 형식이 맞는지 판단 후 맞을 경우에 저장이 실행되는 기능
 * **/
let checkPasswordBoolean = false;
let checkPasswordConfirm = false;
let checkEmailBoolean = true;

function edit(workNumber) {
    //이메일의 형식이 맞는지 체크
    if (checkEmailBoolean === true) {
        let editUserInfo = {
            name: document.getElementById('myPage_name_edit').value,
            department: document.getElementById('myPage_department_edit').value,
            role: document.getElementById('myPage_role_edit').value,
            email: document.getElementById('myPage_email_edit').value,
        };
        //유저의 사번을 url에 담은 후 전송
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
/**
 * 담당자 : 정희성
 * 함수 설명 : 비밀번호 유효성 검사 후 변경해주는 함수(마이페이지 부분)
 * 주요 기능 : 비밀번호가 4자리 이상인지 비밀번호 확인란과 똑같은지 비교하는 기능
 *            유효성 검사 통과 시 변경된 비밀번호로 저장하는 기능
 * **/
function passwordEdit(workNumber) {
    // 비밀번호 유효성 검사 체크
    if (checkPasswordBoolean && checkPasswordConfirm === true) {
        let editUserInfo = {
            password: document.getElementById('myPage_password_edit').value
        };

        // 유저의 사번을 url에 담은 후 전송
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
/**
 * 담당자 : 정희성
 * 함수 설명 : 비밀번호가 4자리 이상인지 비밀번호 확인란과 동일한지 체크하는 함수(마이페이지 부분)
 * 주요 기능 : 4자리 이하일 경우 메시지를 띄어주고 boolean 함수를 false로 변환하는 기능
 *            비밀번호와 확인란 미일지 경우 메시지를 띄어주고 bo0lean 함수를 false로 변환하는 기능
 * **/
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
/**
 * 담당자 : 정희성
 * 함수 설명 : 이메일 유효성을 검사하는 기능
 * 주요 기능 : 이메일의 형식을 정규 표현식을 통해 검사하는 기능
 *            형시이 맞지 않을 경우 메시지를 띄우고 boolean을 false로 변환하는 기능
 * **/
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