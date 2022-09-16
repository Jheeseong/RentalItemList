function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

function putExcel(itemInfo){
    let wb = XLSX.utils.book_new();

    wb.SheetNames.push("물품목록");

    let wsData = [[],[],[[],"대분류", "소분류", "제품 이름", "제품 코드", "대여 가능 여부", "반환 필요 여부", "수량"]]

    itemInfo.map((item) => {
        let temp = [[],item.category.parentCategory, item.category.childCategory, item.name, item.code, item.available.rental, item.available.return, item.count.all];
        wsData.push(temp);
    });

    let ws = XLSX.utils.aoa_to_sheet(wsData);

    wb.Sheets["물품목록"] = ws;

    let wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});

    saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), '물품목록.xlsx');
}