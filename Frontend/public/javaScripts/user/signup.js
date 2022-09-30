/**
 * 담당자 : 정희성
 * 파일 설명 : 회원 가입 시 밀표한 기능들을 작성한 스크립트 파일
 * **/
let checkPasswordBoolean = Boolean;
let checkPasswordConfirm = Boolean;
let checkEmailBoolean = Boolean;
let checkRanNumBoolean = false;
/**
 * 담당자 : 정희성
 * 함수 설명 : 버튼 클릭 시 이메일과 비밀번호 유효성 검사 후 입력 값을 POST 전송하는 함수(회원가입)
 * 주요 기능 : boolean을 통해 이메일, 비밀번호 4자리 체크, 비밀번호와 확인란 동일 여부를 판단하는 기능
 *            휴효성 검사 후 입력 값을 Post로 해당 url에 전송하는 기능
 *            유효성 검사 실패 시 알람을 통해 저장 실패를 알려주는 기능
 * **/
async function btn_signup() {
    if (checkRanNumBoolean === true) {
        if (checkPasswordBoolean && checkEmailBoolean && checkPasswordConfirm === true) {
            //입력 값을 userinfo에 담은 후 변수 선언
            let userinfo = {
                name: document.getElementById('name').value,
                department: document.getElementById('department').value,
                role: document.getElementById('role').value,
                workNumber: document.getElementById('workNumber').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            await fetch('signUp/api/signUp', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userinfo),
            }).then((res) => res.json())
                .then((result) => {
                    window.alert(result.message);
                    console.log(result.message);

                    if (result.signup === true) {
                        location.replace('/login');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    window.alert("회원 가입 정보를 다시 확인해주세요");
                });
        } else {
            window.alert("회원 정보를 다시 확인해주세요.");
        }
    } else {
        window.alert("이메일을 인증해주세요.")
    }

}
function emailCertification() {
    const certification = document.querySelector('.email_certification')

    fetch('signUp/api/certification', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: document.getElementById('email').value}),
    }).then((res) => res.json())
        .then((res) => {
            if (res.sendSuccess === false) {
                window.alert("이메일을 다시 한 번 확인해주세요.");
            } else {
                window.alert("이메일에 인증번호를 전송하였습니다.");
                certification.innerHTML =
                    "            <input type=\"text\" name=\"input_ranNum\" id=\"input_ranNum\" class=\"input_ranNum\">\n" +
                    "            <button id=\"btn_checkRanNum\" name=\"btn_checkRanNum\" class=\"btn_checkRanNum\" onclick=checkRandomNumber("+ res.random +")>인증하기</button>"

            }
        })
}

function checkRandomNumber(ranNum) {
    const inputNum = document.getElementById('input_ranNum').value;
    console.log(ranNum, inputNum.toString())
    if (inputNum === ranNum.toString()) {
        checkRanNumBoolean = true;
        window.alert("이메일 인증에 성공하셨습니다.");
    } else {
        window.alert("이메일 인증에 실패하셨습니다.")
    }
}

/**
 * 담당자 : 정희성
 * 함수 설명 : 비밀번호 자릿 수 체크 및 확인란과 동일 여부를 판단하는 함수(회원간입)
 * 주요 기능 : 유효성 검사 실패 시 해당 실패 이유를 onkeyup을 통해 이유를 표시하는 기능
 *            유효성 검사 실패 시 해당 boolean이 false가 되는 기능
 * **/
function passwordTest(){
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
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
        message = "비밀번호를 입력해주세요!"
        color = "#da2638";
        checkPasswordBoolean = false;
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
        confirmMessage = "비밀번호를 입력해주세요!"
        confirmColor = "#da2638";
        checkPasswordConfirm = false;
    }
    document.getElementById("password_message").innerHTML = message;
    document.getElementById("password_message").style.color = color;
    document.getElementById("passwordConfirm_message").innerHTML = confirmMessage
    document.getElementById("passwordConfirm_message").style.color = confirmColor;

}
/**
 * 담당자 : 정희성
 * 함수 설명 : 이메일 유효성 검사하는 함수(회원가입)
 * 주요 기능 : 이메일 형식을 정규 표현식을 통해 검증하는 기능
 *            유효성 검사 실패 시 해당 boolean 값이 false가 되는 기능
 *            유효서 검사 실패 시 onkeyup을 통해 해당 이유를 표시하는 기능
 * **/
function emailTest() {
    function checkEmail(str) {
        const reg_email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]*[.][0-9a-zA-Z]*.[a-zA-Z]{2,3}$/i
        if (!reg_email.test(str)) {
            return false;
        } else {
            return true;
        }
    }
    const email = document.getElementById("email").value;
    let message="";
    let color="";
    if (email.length) {
        if (!checkEmail(email)) {
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
    document.getElementById("email_message").innerHTML = message;
    document.getElementById("email_message").style.color = color;
}


