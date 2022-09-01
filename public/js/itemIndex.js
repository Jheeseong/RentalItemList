const body = document.querySelector('body');
const modal = document.querySelector('.modal');
const btnOpenPopup = document.querySelector('.btn-open-popup');
const btnCreateItem = document.querySelector('.btn-createItem');


btnOpenPopup.addEventListener('click', () => {
    modal.classList.toggle('show');

    if (modal.classList.contains('show')) {
        body.style.overflow = 'hidden';
    }
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.toggle('show');

        if (!modal.classList.contains('show')) {
            body.style.overflow = 'auto';
        }
    }
});

btnCreateItem.addEventListener('click', () => {
    window.alert("저장 완료")
    let item = {
        category:{parentCategory: document.getElementById('parentCategory').value,
            childCategory: document.getElementById('childCategory').value},
        name : document.getElementById('name').value,
        number : document.getElementById('number').value,
        code : document.getElementById('code').value,
        count:{all: document.getElementById('all').value}
    }

    console.log(item)
    fetch('api/createItem', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
        .then((res) => res.json())
        .then((item) => {
            console.log('성공', item)
        })
        .catch((err) => {
            console.log(err);
        })
});