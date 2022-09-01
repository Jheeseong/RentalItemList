function searchBtnEvent(){
    const input_search = document.getElementById('input_search').value;
    if(!input_search){
        window.alert("검색내용을 입력하세요");
        return;
    }
    console.log(input_search);
    fetch('/itemmanagement/find/item/' + input_search, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            console.log(item);
        }).catch((err) => {
            window.alert(err);
            console.log(err);
    });
}
