/**
 * 담당자 : 강재민
 * 파일 설명 : 물품관리에서 엑셀내보내기 기능을 담당하는 JavaScript 파일 입니다.
 */

/**
 * 담당자 : 강재민
 * 함수 설명 : 엑셀파일을 만들어줄 버퍼 공간을 생성해주는 함수 입니다.
 */
function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf);  //create uint8array as viewer
    for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 대여자 목록 버튼을 클릭 했을 때 실행되는 이벤트 함수입니다.
 * 주요 기능 : - 현재 테이블에 바인딩 되어 있는 물품 정보를 인자로 받아 데이터를 가공하였습니다.
 *              - SheetJS 라이브러리를 사용하여 엑셀파일을 생성할 수 있도록 하였습니다.
 *              - fileSaver 라이브러리를 사용하여 생성한 엑셀파일을 사용자의 PC에 저장할 수 있도록 하였습니다.
 */
function putExcel(itemInfo){
    let wb = XLSX.utils.book_new(); // 새로운 시트 생성

    wb.SheetNames.push("물품목록"); // 시트 이름 입력

    let wsData = [[],[],[[],"대분류", "소분류", "제품 이름", "제품 코드", "대여 가능 여부", "반환 필요 여부", "수량"]] // 테이블 head에 해당하는 부분 입력

    itemInfo.map((item) => {
        let temp = [[],item.category.parentCategory, item.category.childCategory, item.name, item.code, item.available.rental, item.available.return, item.count.all];
        wsData.push(temp);
    }); // 받아온 데이터 순차입력

    let ws = XLSX.utils.aoa_to_sheet(wsData); // 입력한 데이터로 시트 생성

    wb.Sheets["물품목록"] = ws; // 파일 명

    let wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'}); // 엑셀 파일 생성

    saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), '물품목록.xlsx'); // 엑셀 파일 저장
}