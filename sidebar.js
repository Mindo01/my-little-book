// 현재 열린 파일 객체
var _tmpFile;

/**
 * 텍스트 파일 열기
 * 참고 : http://www.gisdeveloper.co.kr/?p=5566
 */
function openTextFile() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "text/plain";
    input.onchange = function (event) {
        var file = event.target.files[0];
        _tmpFile = file; // 현재 파일 정보 저장
        document.getElementById('fileLoaded').innerText = file.name;
        processFile(file);
    };
    input.click();
}
/**
 * 파일 내용읽어서 표시
 * @param {*} file 
 */
function processFile(file) {
    console.log(file);
    var reader = new FileReader();
    reader.onload = function () {
        // 스크롤 초기화
        document.body.scrollTop = 0;
        // 파일 내용 표시
        output.innerText = reader.result;
    };
    reader.readAsText(file, /* optional */ "euc-kr");
}

document.addEventListener('DOMContentLoaded', function() {
    // 파일 열기 버튼
    var fileOpener = document.getElementById('fileOpener');
    fileOpener.addEventListener('click', function() {
        // 파일 열기
        openTextFile();
    });

    // 북마크 버튼
    document.getElementById('bookmark').addEventListener('click', function() {
        // 현재 스크롤 위치 확인
        var intY = document.body.scrollTop;
        console.log(intY);

        // TODO: 스크롤 위치 저장

        
    });

    // 북마크 목록 확인
    // TODO: 북마크 목록 중 클릭하면 해당 스크롤 위치로 이동
    // TODO: 북마크 목록 전체 비우기 버튼 추가
    // TODO: 북마크 목록 중 개별 삭제
    document.getElementById('bookmarkList').addEventListener('click', function() {
        console.log(tmpFile);

        // TODO: 현재 파일(_tmpFile)로 localStorage에 저장된 목록 중 해당 파일의 북마크 목록만 불러오기

        // TODO: 팝업화면/또는 화면전환/또는 사이드바로 북마크 목록 표시
        // TODO: 단, 필터로 처리해서 전체 북마크 목록 불러오는 형식 / 필터를 변경하면 전체 목록도 볼 수 있도록

    });

    // TODO: 단축키 기능
    // TODO: 검색 기능
    // TODO: 스크롤 페이지 입력해서 이동 기능
});