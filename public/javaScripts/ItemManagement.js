async function searchBtnEvent(){
    const input_search = document.getElementById('input_search').value;
    const searchCategory = document.getElementById('searchCategory').value;
    const itemInfoListTable = document.getElementById('tr_itemInfoList');
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
    await fetch(URL, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            console.log(item.items);
            let rows = "<div></div>";

            item.items.map(res => {
                rows += "<tr><td>" + res.category.parentCategory + "</td>";
                rows += "<td>" +res.category.childCategory + "</td>";
                rows += "<td>" +res.name + "</td>";
                rows += "<td>" +res.number + "</td>";
                rows += "<td>" +res.available.rental + "</td>";
                rows += "<td>" +res.available.return + "</td>";
                rows += "<td>" +res.count.remaining + "</td>";
                rows += "<td>" +(res.count.all - res.count.remaining) + "</td>";
                rows += "<td>" +res.count.all + "</td>";
                rows += "<td>" +res.name + "</td></tr>";;
            })
            itemInfoListTable.innerHTML=rows;
        }).catch((err) => {
            window.alert(err);
            console.log(err);
    });
}
