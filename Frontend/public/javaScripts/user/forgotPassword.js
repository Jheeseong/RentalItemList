
/**
 * 담당자 : 강재민
 * 함수 설명 : Enter 키 이벤트 입니다.
 * 주요 기능 : - 내용을 입력하고 엔터키를 눌렀을 때 초기화 완료 버튼 클릭과 같은 함수가 실행되도록 하였습니다.
 */
async function enterKeyUp(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){
        await passwordReset();
    }
}
let enterKey = document.getElementById('login-container');
enterKey.addEventListener('keyup', event => enterKeyUp(event));


/**
 * 담당자 : 강재민
 * 함수 설명 : 초기화 완료 버튼 이벤트입니다.
 * 주요 기능 : - 초기화 완료 버튼 클릭 시 사번, 이메일, 이름 input value를 받아와 비밀번호 초기화 API와 통신합니다.
 *              - API에서 성공 response를 받으면 로그인페이지로 replace하게 하였습니다.
 *              - 실패 시 에러 메시지를 표시하게 하였습니다.
 */
async function passwordReset(){
    const data = {
        workNumber : document.getElementById('workNumber').value,
        name : document.getElementById('name').value,
        email : document.getElementById('email').value,
    }

    console.log(data);

    await fetch('forgotPassword/passwordReset', {
        method: 'post',
        headers:{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            if(result.resetSuccess === true){
                window.alert(result.message);
                location.replace("/login");
            } else{
                window.alert("잘못된 정보입니다.");
            }
        }).catch((err) => {
            window.alert(err);
            console.log(err);
        });
}