async function exile(id) {
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
async function resetPassword(id) {
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