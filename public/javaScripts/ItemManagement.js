function searchBtnEvent(){
    const input_search = document.getElementById('input_search').value;
    const searchCategory = document.getElementById('searchCategory').value;
    let URL;
    if(searchCategory === "itemName")
        URL = '/itemmanagement/find/item/' + input_search;
    else
        URL = '/itemmanagement/find/lender/' + input_search;
    if(!input_search){
        window.alert("검색내용을 입력하세요");
        return;
    }
    console.log(input_search + URL);
    fetch(URL, {
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
