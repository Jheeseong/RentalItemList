function itemsRender(items){
    const itemInfoListTable = document.getElementById('tr_itemInfoList');
    let rows = "<div></div>";

    items.map(res => {
        rows += "<tr><td>" + res.category.parentCategory + "</td>";
        rows += "<td>" +res.category.childCategory + "</td>";
        rows += "<td>" +res.name + "</td>";
        rows += "<td>" +res.number + "</td>";
        rows += "<td>" +res.available.rental + "</td>";
        rows += "<td>" +res.available.return + "</td>";
        rows += "<td>" +res.count.remaining + "</td>";
        rows += "<td>" +(res.count.all - res.count.remaining) + "</td>";
        rows += "<td>" +res.count.all + "</td>";
        rows += "<td>" +res.name + "</td></tr>";
    })
    itemInfoListTable.innerHTML=rows;
}

async function searchBtnEvent(){
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
    await fetch(URL, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            console.log(item.items);
            itemsRender(item.items);
        }).catch((err) => {
            window.alert(err);
            console.log(err);
    });
}

async function changeParentCategory(){
    const parentCategory = document.getElementById('parentCategory');
    const parentCategoryVal = parentCategory.options[parentCategory.selectedIndex].text;
    const childCategory = document.getElementById('childCategory');
    let rows = "<option value=''>전체</option>";
    if(parentCategoryVal === "전체"){
        childCategory.innerHTML = rows;
        return;
    }
    const URL = 'itemmanagement/find/childcategory/' + parentCategoryVal;

    await fetch(URL, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            console.log(item);
            item.children.children.map(res => {
                rows += "<option value=" + res + ">" + res + "</option>";
            });
            childCategory.innerHTML = rows;
        }).catch((err) => {
            window.alert(err);
            console.log(err);
        });

    await fetch('itemmanagement/find/item/parentCategory/' + parentCategoryVal, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            console.log(item.items);
            itemsRender(item.items);
        }).catch((err) => {
            window.alert(err);
    });
}

async function changeChildCategory(){
    const childCategory = document.getElementById('childCategory');
    const childCategoryVal = childCategory.options[childCategory.selectedIndex].text;
    if(childCategoryVal === "전체"){
        return;
    }

    await fetch('itemmanagement/find/item/childCategory/' + childCategoryVal, {
        method: 'get'
    })
        .then((res) => res.json())
        .then((item) => {
            //console.log(item.items);
            itemsRender(item.items);
        }).catch((err) => {
            window.alert(err);
        });
}