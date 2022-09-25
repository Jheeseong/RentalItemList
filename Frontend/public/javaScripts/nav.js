/**
* 담당자 : 정희성
* 파일 내용 : nav바 에 관련된 스크립트 파일
**/
let dropdowns = document.querySelectorAll('.navbar .dropdown-toggler')
let dropdownIsOpen = false

/**
* 담당자 : 정희성
* 주요 기능 : nav 바 크기가 줄어들 시 dropdown 버튼을 생성해주는 기능
**/
if (dropdowns.length) {
    dropdowns.forEach((dropdown) => {
        dropdown.addEventListener('click', (event) => {
            let target = document.querySelector(`#${event.target.dataset.dropdown}`)

            if (target) {
                if (target.classList.contains('show')) {
                    target.classList.remove('show')
                    dropdownIsOpen = false
                } else {
                    target.classList.add('show')
                    dropdownIsOpen = true
                }
            }
        })
    })
}
/**
* 담당자 : 정희성
* 함수 내용 : nav바에 페이지 이동하는 버튼들이 존재할 경우 꺼주고 기존 nav바 형태로 변환해주는 함수
**/
window.addEventListener('mouseup', (event) => {
    if (dropdownIsOpen) {
        dropdowns.forEach((dropdownButton) => {
            let dropdown = document.querySelector(`#${dropdownButton.dataset.dropdown}`)
            let targetIsDropdown = dropdown == event.target

            if (dropdownButton == event.target) {
                return
            }

            if ((!targetIsDropdown) && (!dropdown.contains(event.target))) {
                dropdown.classList.remove('show')
            }
        })
    }
})
/**
* 담당자 : 정희성
* 함수 내용 : nav가 줄어들어 생긴 버튼 클릭 시 여러 페이지 이동 버튼이 생기도록 해주는 함수
**/
function handleSmallScreens() {
    document.querySelector('.navbar-toggler')
        .addEventListener('click', () => {
            let navbarMenu = document.querySelector('.navbar-menu')

            if (navbarMenu.style.display === 'flex') {
                navbarMenu.style.display = 'none'
                return
            }

            navbarMenu.style.display = 'flex'
        })
}

handleSmallScreens()