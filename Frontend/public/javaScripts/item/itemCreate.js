const body = document.querySelector('body');
const modal = document.querySelector('.modal_create');
const btnOpenPopup = document.querySelector('.btn-open-popup');
const btnCreateItem = document.querySelector('.btn-createItem');
const btnInitItem = document.querySelector('.btn-initItem');
const btnCancel = document.querySelector('.btn-cancel');

/**
 * 담당자 : 정희성
 * 함수 설명 : 물품관리에서 물품등록 버튼 클릭 시 물품등록 팝업 창 실행
 * **/
// 물품관리에서 물품등록 클릭 시
function createItemClick(){
    btnOpenPopup.click();
}

/**
 * 담당자 정희성
 * 함수 설명 : 물품등록 클릭 시 저장된 대분류 카테고리 값들을 불러오는 함수
 * **/
//nav의 물품등록 클릭 시 modal 실행
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

/**
 * 담당자 : 정희성
 * 주요 기능 : 모달 창 바깥 클릭 시 모달 창 꺼지는 기능
 * **/
//모달 창 바깥 클릭 시 모달 창 꺼지는 기능 구현
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.toggle('show');

        if (!modal.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

/**
 * 담당자 : 정희성
 * 주요 기능 : 모달 창 내 물품등록 버튼 클릭 시 input 및 select의 value 값을 가져와서 post 전송을 통해
 *            저장해주는 기능
 * **/
//물품 등록 버튼 구현
btnCreateItem.addEventListener('click', async () => {
    // 모달 창 내 입력 값들을 items에 담아둠
    let items = {
        category: {
            parentCategory: document.getElementById('select_parentCategory').value,
            childCategory: document.getElementById('select_childCategory').value
        },
        name: document.getElementById('name').value,
        code: document.getElementById('code').value,
        count: {
            all: document.getElementById('all').value,
            renting: 0
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
    }).then((res) => res.json())
        .then((res) => {
            window.alert(res.message)
            if (res.message != "물품 내용을 작성해주세요!") {
                window.location.reload(true);
            }
        })
        .catch((err) => {
            console.log(err);
        })
});
/**
 * 담당자 : 정희성
 * 주요 기능 : 모달창 내 초기화 버츤 클릭 시 모든 값들을 초기화해주는 기능
 * **/
//초기화 버튼
btnInitItem.addEventListener('click', () => {
    //confirm을 통해 확인 클릭 시 초기화
    let result = window.confirm("초기화를 하시겠습니까?");
    if (result) {
        initItem();
    }
});
/**
 * 담당자 : 정희성
 * 주요 기능 : 모달창 내 취소 버튼 클릭 시 값을 초기화 우 모달창 종료
 * **/
//취소 버튼
btnCancel.addEventListener('click', () => {
    initItem();
    modal.classList.toggle('show');
    body.style.overflow = 'auto';
})

/**
 * 담당자 : 정희성
 * 함수 설명 : input 및 select 값들을 초기화해주는 함수
 * **/
function initItem() {
    // input 값 초기화
    document.getElementById('select_parentCategory').value = null
    document.getElementById('select_childCategory').value = null
    document.getElementById('name').value = null
    document.getElementById('rental').value = null
    document.getElementById('return').value = null
    document.getElementById('code').value = null
    document.getElementById('all').value = null

}
/**
 * 담당자 : 정희성
 * 함수 설명 : 엑셀 파일을 불러올 시 해당 파일에 저장되어 있는 물품을 DB에 저장해주는 함수
 * 주요 기능 : 엑셀 파일 내에 물품의 카테고리가 기존에 없는 카테고리일 경우 우선적으로 저장해준 후
 *            물품의 정보를 가져와서 저장해주는 기능을 구현
 * **/
function excelExport(event){
    let input = event.target;
    let reader = new FileReader();
    // 엑셀 파일을 onload
    reader.onload = function(){
        const fileData = reader.result;
        //엑셀 파일을 binary 타입으로 read
        const wb = XLSX.read(fileData, {type : 'binary'});
        wb.SheetNames.forEach(function(sheetName){
            //엑셀에 기록된 정보를 json으로 변경 후 각각의 정보를 post전송하여 저장
            const rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
            for (let i = 0; i < rowObj.length; i++) {
                let items = {
                    category: {
                        parentCategory: rowObj[i]["대분류"],
                        childCategory: rowObj[i]["소분류"]
                    },
                    name: rowObj[i]["제품 이름"],
                    number: 1,
                    code: rowObj[i]["제품 코드"],
                    count: {
                        all: rowObj[i]["수량"],
                        renting: 0
                    },
                    available: {
                        rental: rowObj[i]["대여 가능 여부"],
                        return: rowObj[i]["반환 필요 여부"]
                    }
                }
                fetch('createItem/api/createCategory/' + items.category.parentCategory, {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name: items.category.parentCategory,
                                                children: items.category.childCategory})
                }).then((res) => res.json())

                fetch('createItem/api/createItem', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(items),
                }).then((res) => res.json())
                    .then((res) => {
                        window.alert(res.message)
                        window.location.reload(true);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
    }
    reader.readAsBinaryString(input.files[0]);
}