const body = document.querySelector('body');
const modal = document.querySelector('.modal_create');
const btnOpenPopup = document.querySelector('.btn-open-popup');
const btnCreateItem = document.querySelector('.btn-createItem');
const btnInitItem = document.querySelector('.btn-initItem');
const btnCancel = document.querySelector('.btn-cancel');

//nav의 물품등록 버튼 클릭 시 modal 실행
btnOpenPopup.addEventListener('click', async () => {
    //toggle을 통해 물품버튼 클릭 수에 맞게 modal 창 오픈
    modal.classList.toggle('show');
    // DB의 대분류 카테고리를 물러오는 API 요청
    await fetch('createItem/api/find/prentCategory', {
        method: 'get'
    })
        .then((res) => res.json())
        .then((categories) => {
            const parentCategory = document.getElementById('select_parentCategory');

            //option 초기화
            for(i=1; i<parentCategory.options.length; i++) parentCategory.options[i] = null;
            parentCategory.options.length = 1;

            //받아온 대분류 카테고리를 map에 담아 그 수만큼 innerHTML을 통해 option 추가
            categories.categories.map(res => {
                parentCategory.innerHTML += "<option value=" + res.name + ">" + res.name + "</option>"
            })
        }).catch((err) => {
            window.alert(err);
            console.log(err);
        });
    //모달 창이 켜졌을 시 뒷 배경 hidden
    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
});

//모달 창 바깥 클릭 시 모달 창 꺼지는 기능 구현
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.toggle('show');

        if (!modal.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

//물품 등록 버튼 구현
btnCreateItem.addEventListener('click', async () => {
    window.alert("저장 완료")
    // 모달 창 내 입력 값들을 items에 담아둠
    let items = {
        category: {
            parentCategory: document.getElementById('select_parentCategory').value,
            childCategory: document.getElementById('select_childCategory').value
        },
        name: document.getElementById('name').value,
        number: document.getElementById('number').value,
        code: document.getElementById('code').value,
        count: {
            all: document.getElementById('all').value,
            remaining: document.getElementById('all').value
        },
        available: {
            rental: document.getElementById('rental').value,
            return: document.getElementById('return').value
        }
    }

    // post를 통해 input 값을 DB에 저장하는 API 요청
    await fetch('createItem/api/createItem', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
    }).then((res) => {res.json()})
        .then(() => {
            // input 값 초기화
            initItem();
            modal.classList.toggle('show');
        })
        .catch((err) => {
            console.log(err);
        })
});

//초기화 버튼
btnInitItem.addEventListener('click', () => {
    let result = window.confirm("초기화를 하시겠습니까?");
    if (result) {
        initItem();
    }
});

btnCancel.addEventListener('click', () => {
    initItem();
    modal.classList.toggle('show');
})


function initItem() {
    // input 값 초기화
    document.getElementById('select_parentCategory').value = null
    document.getElementById('select_childCategory').value = null
    document.getElementById('name').value = null
    document.getElementById('number').value = null
    document.getElementById('code').value = null
    document.getElementById('all').value = null

}
