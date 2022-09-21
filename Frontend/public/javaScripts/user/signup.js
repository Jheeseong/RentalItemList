let checkPasswordBoolean = Boolean;
let checkPasswordConfirm = Boolean;
let checkEmailBoolean = Boolean;

async function btn_signup() {
    if (checkPasswordBoolean && checkEmailBoolean && checkPasswordConfirm === true) {
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
            })
    } else {
        window.alert("회원 정보를 다시 확인해주세요.");
    }
}

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


