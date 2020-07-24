// 현재 열린 파일 객체
var _tmpFile;

/*
* Date Format string
* 출처: https://stove99.tistory.com/46 [스토브 훌로구]
*/
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


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
 * File API 참고 : https://starrykss.tistory.com/128
 * https://medium.com/@pks2974/file-api-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0-729fa6a3a0ba
 * File Signature : https://www.garykessler.net/library/file_sigs.html
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
    // TODO: 파일 인코딩 문제 default: utf-8 / euc-kr
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
        // 파일 열린 상태인지 확인
        if (!_tmpFile) {
            // TODO: 자체 토스트창으로 표시하기
            alert('열린 파일이 없습니다!');
            return;
        }

        // 북마크 이름 받기
        // TODO: 자체 팝업창에서 받아오기
        var title = prompt("북마크 이름");

        // 북마크 이름이 입력되지 않았다면, 현재 시간으로 저장
        if (!title) {
            console.log('북마크 이름 안받았어');
            var now = new Date();
            var timestamp = now.format("yyyy_MM_dd__HH:mm:ss");
            console.log(timestamp);
            title = timestamp;
        }

        // 현재 스크롤 위치 확인
        var intY = document.body.scrollTop;
        console.log(intY);

        // 북마크이름과 스크롤 위치 key-value 구성
        var save = {};
        save[_tmpFile.name] = {};
        save[_tmpFile.name][title] = intY;
        console.log(save);

        // TODO: 스크롤 위치 저장
        // whale.storage 사용 (참고:https://developer.chrome.com/extensions/storage)
        // set : whale.storage.sync.set({key:value}, function() { /* value */ })
        // get : whale.storage.sync.get(['key'], function(result){ /* result.key */})
        // 또는 local일 경우 whale.storage.local.set/get
        // onchange : whale.storage.onChanged.addListener(function(changes, namespace) { /* changes['key'] changes['key'].oldValue/newValue */})
        // 기존에 저장된 해당 파일의 북마크 조회
        whale.storage.sync.get([_tmpFile.name], function(result) {
            console.log(result);
            // 기존에 저장된 값에 추가해서 저장
            var newValue = result[_tmpFile.name];
            if (!newValue) {
                newValue = {};
            }
            newValue[title] = intY;

            // 새로운 값 저장
            whale.storage.sync.set({ [_tmpFile.name]:newValue }, function() {
                console.log('설정완료');
            });
        });
        
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



