function openTextFile() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "text/plain"; // 확장자가 xxx, yyy 일때, ".xxx, .yyy"
    input.onchange = function (event) {
        var file = event.target.files[0];
        document.getElementById('fileLoaded').innerText = file.name;
        processFile(file);
    };
    input.click();
}
function processFile(file) {
    console.log(file);
    var reader = new FileReader();
    reader.onload = function () {
        output.innerText = reader.result;
    };
    reader.readAsText(file, /* optional */ "euc-kr");
}

document.addEventListener('DOMContentLoaded', function() {
    // 파일 열기 버튼
    var fileOpener = document.getElementById('fileOpener');
    fileOpener.addEventListener('click', function() {
        openTextFile();
    });

    // 북마크 버튼
    document.getElementById('bookmark').addEventListener('click', function() {
        // 현재 스크롤 위치 확인
        var intY = document.body.scrollTop;
        console.log(intY);
    });

    // 북마크 목록 확인
    document.getElementById('bookmarkList').addEventListener('click', function() {
        openTextFile();
    });
});