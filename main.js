whale.sidebarAction.onClicked.addListener(result => {
    // result.opened: 사이드바가 열렸는지 닫혔는지를 알려주는 boolean 값. 열렸으면 true.
    console.log('mine opened');
});

window.addEventListener(`dragover`, (evt = event) => {
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = `none`;
    evt.dataTransfer.dropEffect = `none`;
}, false);

window.addEventListener(`drop`, (evt = event) => {
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = `none`;
    evt.dataTransfer.dropEffect = `none`;
}, false);

// whale.sidebarAction.setTitle({
//     title: `새 제목`
// });

// whale.sidebarAction.setBadgeText({
//     text: `hi`
// });

// whale.sidebarAction.setBadgeBackgroundColor({
//     color: `#ff0000`  //  RGBA 색상값 배열([255, 0, 0, 255]) 혹은 HEX 색상 표현 문자열(#FF0000).
// });

chrome.runtime.onMessage.addListener(function(msg) {
    if (msg.action == 'browse'){
        openTextFile();
    } else if (msg.action == 'test'){
        var output = document.getElementById('output');
        if (output) {
            output.innerHTML = 'hi'
        }
    }
});