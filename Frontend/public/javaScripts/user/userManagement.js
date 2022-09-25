/**
 * 담당자 : 정희성
 * 함수 설명 : 해당 유저를 추방하는 함수
 * 기능 설명 : 해방하는 유저의 id 값을 가져와서 url에 포함시켜 Post 전송하는 기능
 *            confirm을 통해 메시지에서 확인 버튼을 누를 시 ajax가 작동되는 기능
 * **/
async function exile(id) {
    //윈도우 알람에서 확인 클릭 시 작동
    if (window.confirm("정말 추방하시겠습니까?") === true) {
        $.ajax({
            type: 'DELETE',
            url: 'usermanagement/delete/' + id,
            dataType:"json",
            success: function (result) {
                    window.alert(result.message);
                    window.location.reload(true);
            },
            error: function (err) {
                console.log(err)
                window.alert(err)
            }
        });
    }
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 편집 권한을 변경 후 알림을 띄어주는 함수
 * 주요 기능 : 해당 유저의 id를 url에 포함시켜 편집권한 변경 내용을 post 전송해주는 기능
 *            변경 후 메시지를 띄어주는 기능
 * **/
async function updateEditAuthority(id) {
    $.ajax({
        type: 'POST',
        url: 'usermanagement/update/edit/' + id,
        dataType: "json",
        success: function (result) {
            window.alert(result.message);
            window.location.reload(true);
        },
        error: function (err) {
            console.log(err)
            window.alert(err)
        }
    })
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 대여 권한을 변경 후 알림을 띄어주는 함수
 * 주요 기능 : 해당 유저의 id를 url에 포함시켜 대여권한 변경 내용을 post 전송해주는 기능
 *            변경 후 메시지를 띄어주는 기능
 * **/
async function updateRentalAuthority(id) {
    $.ajax({
        type: 'POST',
        url: 'usermanagement/update/rental/' + id,
        dataType: "json",
        success: function (result) {
            window.alert(result.message);
            window.location.reload(true);
        },
        error: function (err) {
            console.log(err)
            window.alert(err)
        }
    })
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 열람 권한을 변경 후 알림을 띄어주는 함수
 * 주요 기능 : 해당 유저의 id를 url에 포함시켜 열람권한 변경 내용을 post 전송해주는 기능
 *            변경 후 메시지를 띄어주는 기능
 * **/
async function updateOpenAuthority(id) {
    $.ajax({
        type: 'POST',
        url: 'usermanagement/update/open/' + id,
        dataType: "json",
        success: function (result) {
            window.alert(result.message);
            window.location.reload(true);
        },
        error: function (err) {
            console.log(err)
            window.alert(err)
        }
    })
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 관리자 권한을 변경 후 알림을 띄어주는 함수
 * 주요 기능 : 해당 유저의 id를 url에 포함시켜 관리자 권한 변경 내용을 post 전송해주는 기능
 *            변경 후 메시지를 띄어주는 기능
 * **/
async function updateAdminAuthority(id) {
    $.ajax({
        type: 'POST',
        url: 'usermanagement/update/admin/' + id,
        dataType: "json",
        success: function (result) {
            window.alert(result.message);
            window.location.reload(true);
        },
        error: function (err) {
            console.log(err)
            window.alert(err)
        }
    })
}
/**
 * 담당자 : 정희성
 * 함수 설명 : 유저의 비밀번호를 0405로 초기화시기는 함수
 * 주요 기능 : 해당 유저의 id를 url에 포함시켜 post 전송해주는 기능
 *            confirm을 통해 확인 버튼 체크 후 비밀번호를 초기화해주는 기능
 *            실패 시 메시지로 표시해주는 기능
 * **/
async function resetPassword(id) {
    //윈도우 알람에서 확인 클릭 시 작동
    if (window.confirm("정말 비밀번호를 초기화하시겠습니까?") === true) {
        $.ajax({
            type: 'POST',
            url: 'usermanagement/update/password/' + id,
            dataType: "json",
            success: function (result) {
                window.alert(result.message);
                window.location.reload(true);
            },
            error: function (err) {
                console.log(err)
                window.alert(err)
            }
        })
    }
}