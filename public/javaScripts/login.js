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
                window.alert(result.message);
            }
        }).catch((err) => {
            window.alert(err);
            console.log(err);
        });
}