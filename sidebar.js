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
        closeBookmarkBox();
        // 파일 열기
        openTextFile();
    });

    // 북마크 버튼
    document.getElementById('btnBookmark').addEventListener('click', function() {
        // 파일 열린 상태인지 확인
        if (!_tmpFile) {
            showMessage('열린 파일이 없습니다.');
            return;
        }

        // 북마크 이름 받기
        promptMessage("북마크 이름", function(title) {
            if (title === null) return; // 취소

            // 북마크 이름이 입력되지 않았다면, 현재 시간으로 저장
            if (!title) {
                var now = new Date();
                var timestamp = now.format("yyyy_MM_dd__HH:mm:ss");
                title = timestamp;
            }

            // 현재 스크롤 위치 확인
            var intY = document.body.scrollTop;

            // 스크롤 위치 저장
            // whale.storage 사용 (참고:https://developer.chrome.com/extensions/storage)
            // set : whale.storage.sync.set({key:value}, function() { /* value */ })
            // get : whale.storage.sync.get(['key'], function(result){ /* result.key */})
            // 또는 local일 경우 whale.storage.local.set/get
            // onchange : whale.storage.onChanged.addListener(function(changes, namespace) { /* changes['key'] changes['key'].oldValue/newValue */})

            // 기존에 저장된 해당 파일의 북마크 조회
            whale.storage.sync.get([_tmpFile.name], function(result) {
                // 기존에 저장된 값에 추가해서 저장
                var newValue = result[_tmpFile.name];
                if (!newValue) {
                    newValue = {};
                } else {
                    // TODO: 기존 키와 겹치면 덮어쓰기 확인/취소 띄우기
                    // TODO: 커스텀 confirm 창 구성 필요
                    // 이미 존재하는 북마크이름일 경우 알림
                    if (newValue[title] != undefined) {
                        showMessage('이미 있는 북마크이름입니다');
                        return;
                    }
                }
                // 북마크이름과 스크롤 위치 key-value 구성
                newValue[title] = intY;

                // 새로운 값 저장
                whale.storage.sync.set({ [_tmpFile.name]:newValue }, function() {
                    // 북마크목록 새로고침
                    refreshBookmarkList(_tmpFile.name);
                });
            });
        });
        
    });

    // 북마크 목록 확인
    // - 북마크 목록 중 클릭하면 해당 스크롤 위치로 이동
    // TODO: 북마크 목록 전체 비우기 버튼 추가
    // - 북마크 목록 중 개별 삭제
    document.getElementById('btnBookmarkList').addEventListener('click', function() {
        // 북마크 열려있는 상태일 경우 닫고 종료
        if (isBookmarkBoxOpen())
        {
            closeBookmarkBox();
            return;
        }

        // 파일 열린 상태인지 확인
        if (!_tmpFile) {
            showMessage('열린 파일이 없습니다.');
            return;
        }

        // 현재 파일(_tmpFile)로 localStorage에 저장된 목록 중 해당 파일의 북마크 목록만 불러오기
        refreshBookmarkList(_tmpFile.name);

        // TODO: 단, 필터로 처리해서 전체 북마크 목록 불러오는 형식 / 필터를 변경하면 전체 목록도 볼 수 있도록

    });

    // 북마크 선택 이벤트
    document.getElementById('bookmarkList').addEventListener('click', function(evt) {
        var mark = evt.target;
        var scrollY = mark.getAttribute('data-scroll');
        // 스크롤 위치 이동
        document.body.scrollTop = scrollY;
    });

    // 북마크 삭제 이벤트 : 북마크 우클릭
    document.getElementById('bookmarkList').addEventListener('contextmenu', function(evt) {
        evt.preventDefault();
        var mark = evt.target.getAttribute('data-mark');
        // 북마크 삭제
        deleteBookmark(_tmpFile.name, mark);
        return false;
    }, false);

    // 메인에 포커스가면 북마크목록 닫기
    document.getElementById('output').addEventListener('click', function() {
        closeBookmarkBox();
    });

    // 북마크목록 닫기 버튼
    document.getElementById('btnBookmarkClose').addEventListener('click', function() {
        closeBookmarkBox();
    });

    // 페이지 이동 방향키 바인드
    window.onkeyup = function(evt) {
        // 좌/우 키로 페이지 이동
        if (evt.key == "ArrowLeft") {
            // page up
            event.preventDefault();
            // 스크롤 위치 위 페이지로 (window height - header height - 여백)
            document.body.scrollTop = document.body.scrollTop - (document.body.clientHeight - document.getElementById('navbar_main').clientHeight - 10);
        }
        else if (evt.key == "ArrowRight") {
            // page down
            event.preventDefault();
            // 스크롤 위치 아래 페이지로 (window height - header height - 여백)
            document.body.scrollTop = document.body.scrollTop + (document.body.clientHeight - document.getElementById('navbar_main').clientHeight - 10);
        }
    };

    // TODO: 검색 기능 window.find()?

    // TODO: 스크롤 페이지 입력해서 이동 기능

});

/**
 * 북마크 새로고침
 * @param {string}} fileName 
 */
function refreshBookmarkList(fileName) {
    whale.storage.sync.get([fileName], function(result) {
        var bookmarkList = result[fileName];
        if (!bookmarkList) {
            bookmarkList = {};
        }
        
        var bookmarkTag = document.querySelector('#bookmarkList');
        bookmarkTag.innerHTML = "";
        // 북마크 목록 생성
        Object.keys(bookmarkList).forEach(key => {
            var bookmark = document.createElement('li');
            bookmark.setAttribute("class", "cursor-click font-hover");
            bookmark.setAttribute("data-mark", key);
            bookmark.setAttribute("data-scroll", bookmarkList[key]);
            bookmark.innerText = key;
            // 닫기 버튼
            var close = document.createElement('span');
            close.setAttribute("class", "fixed-right");
            close.setAttribute("data-mark", key);
            close.innerText = "X";
            bookmark.appendChild(close);
            bookmarkTag.appendChild(bookmark);
        });
        
        // 사이드바로 북마크 목록 표시
        openBookmarkBox();
    });
}

/**
 * 북마크 개별 삭제
 * @param {string} fileName 북마크 저장된 파일명
 * @param {string} key 북마크키
 */
function deleteBookmark(fileName, key) {
    whale.storage.sync.get([fileName], function(result) {
        // 기존에 저장된 값에 추가해서 저장
        var updateValue = result[fileName];
        if (!updateValue) {
            updateValue = {};
        }
        // 선택한 북마크 삭제
        delete updateValue[key];

        // 새로운 값 저장
        whale.storage.sync.set({ [fileName]:updateValue }, function() {
            // 저장 완료, 북마크 새로고침
            refreshBookmarkList(fileName);
        });
    });
}

/**
 * Bookmark 상태 확인
 */
function isBookmarkBoxOpen() {
    return document.getElementById("bookmarkBox").style.width == "300px";
}

/**
 * BookmarkBox 열기
 */
function openBookmarkBox() {
    // FIXME: 열 때 북마크별 닫기 버튼이 먼저 떠
    document.getElementById("bookmarkBox").style.display = "block";
    document.getElementById("bookmarkBox").style.width = "300px";
    // setTimeout(function(){ document.getElementById("bookmarkBox").style.width = "300px"; }, 500);
    // setTimeout(function(){ document.getElementById("bookmarkBox").style.display = "block"; }, 100);
}

// TODO: Sidebarapp 닫힐 때 bookmarkbox도 닫기
/**
 * BookmarkBox 닫기
 */
function closeBookmarkBox() {
    // FIXME: 닫을 때 북마크별 닫기 버튼이 늦게 사라져
    document.getElementById("bookmarkBox").style.width = "0px";
    // document.getElementById("bookmarkBox").style.display = "none";
    setTimeout(function(){ document.getElementById("bookmarkBox").style.display = "none"; }, 400);
}

/**
 * show snackbar toast
 * @param {string} msg 
 */
function showMessage(msg) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerText = msg;
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // 3
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1500);
}

/**
 * show prompt msg
 * @param {string} msg 
 */
function promptMessage(msg, callback) {
    // 기존 버튼 클릭 이벤트 해제
    document.getElementById("promptOk").removeEventListener('click', clickPromptOk);
    document.getElementById("promptCancel").removeEventListener('click', clickPromptCancel);

    // Get the prompt DIV
    var x = document.getElementById("prompt");
    document.getElementById('promptMsg').innerText = msg;
    document.getElementById('promptInput').value = ""; // 초기화
  
    // Add the "show" class to DIV
    x.className = "show";

    // 입력칸에 포커스
    document.getElementById('promptMsg').focus();

    // 프롬프트 버튼 이벤트
    document.getElementById("promptOk").addEventListener('click', function() {
        clickPromptOk(callback);
    });
    document.getElementById("promptCancel").addEventListener('click', function() {
        clickPromptCancel(callback);
    });
}
/**
 * 프롬프트 확인 이벤트 핸들러
 */
function clickPromptOk(callback) {
    closePrompt();
    if(typeof callback != 'undefined' && callback){
        if(typeof callback == 'function'){
            callback(document.getElementById('promptInput').value);
        } else {
            if( callback ) {
                eval( callback );
            }
        }
    }
}
/**
 * 프롬프트 취소 이벤트 핸들러
 */
function clickPromptCancel(callback) {
    closePrompt();
    if(typeof callback != 'undefined' && callback){
        if(typeof callback == 'function'){
            callback(null); // 취소일 경우 null 반환
        } else {
            if( callback ) {
                eval( callback );
            }
        }
    }
}
/**
 * 프롬프트 닫기
 */
function closePrompt() {
    var x = document.getElementById("prompt");
    // Add the "show" class to DIV
    x.className = x.className.replace("show", "hide");
    setTimeout(function(){ x.className = x.className.replace("hide", ""); }, 500);
}

