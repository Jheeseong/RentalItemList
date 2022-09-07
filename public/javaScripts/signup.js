async function btn_signup() {
    let userinfo = {
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value,
        workNumber: document.getElementById('workNumber').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    await fetch('signUp/api/signUp', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userinfo),
    }).then((res) => res.json())
        .then((result) => {
            window.alert(result.message);
            location.replace('/login');
            console.log(result.message);
    })
        .catch((err) => {
            console.log(err);
            window.alert(err);
        })
}
