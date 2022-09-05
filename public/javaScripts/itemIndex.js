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

btnCreateItem.addEventListener('click', async () => {
    window.alert("저장 완료")
    let items = {
        category: {
            parentCategory: document.getElementById('parentCategory').value,
            childCategory: document.getElementById('childCategory').value
        },
        name: document.getElementById('name').value,
        number: document.getElementById('number').value,
        code: document.getElementById('code').value,
        count: {
            all: document.getElementById('all').value,
            remaining: document.getElementById('all').value
        },
        available: {
            rental: true,
            return: true
        }
    }

    await fetch('api/createItem', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
    }).then((res) => {res.json()})
        .then((item) => {
            document.getElementById('parentCategory').value = null
            document.getElementById('childCategory').value = null
            document.getElementById('name').value = null
            document.getElementById('number').value = null
            document.getElementById('code').value = null
            document.getElementById('all').value = null
            modal.classList.toggle('show');
        })
        .catch((err) => {
            console.log(err);
        })
});
