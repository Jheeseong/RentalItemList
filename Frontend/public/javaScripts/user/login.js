async function login() {
    const workNumber = document.getElementById('workNumber').value;
    const password = document.getElementById('password').value;

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
                console.log(result.message);
            } else{
                window.alert("아이디가 존재하지 않거나 틀린 비밀번호입니다.");
            }
        }).catch((err) => {
            window.alert(err);
            console.log(err);
        });
}

async function enterKeyUp(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){
        await login();
    }
}

let enterKey = document.getElementById('login-container');
enterKey.addEventListener('keyup', event => enterKeyUp(event));

