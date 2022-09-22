/**
 * 담당자 : 강재민
 * 함수 설명 : 로그인 버튼 이벤트입니다.
 * 주요 기능 : - 로그인 버튼 클릭 시 사번과 비밀번호 input value를 받아와 로그인 API와 통신합니다.
 *              - 로그인 API에서 성공 response를 받으면 메인페이지로 replace하게 하였습니다.
 *              - 실패 시 에러 메시지를 표시하게 하였습니다.
 */
async function login() {
    const data = {
        workNumber : document.getElementById('workNumber').value,
        password : document.getElementById('password').value
    }

    await fetch('login/api/auth', {
        method: 'post',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            if(result.loginSuccess === true){
                window.alert(result.message);
                location.replace("/");
            } else{
                window.alert("아이디가 존재하지 않거나 틀린 비밀번호입니다.");
            }
        }).catch((err) => {
            window.alert(err);
            console.log(err);
        });
}

/**
 * 담당자 : 강재민
 * 함수 설명 : Enter 키 이벤트 입니다.
 * 주요 기능 : - 로그인 시 내용을 입력하고 엔터키를 눌렀을 때 로그인 버튼 클릭과 같은 함수가 실행되도록 하였습니다.
 */
async function enterKeyUp(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){
        await login();
    }
}
let enterKey = document.getElementById('login-container');
enterKey.addEventListener('keyup', event => enterKeyUp(event));

