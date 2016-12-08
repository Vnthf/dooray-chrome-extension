
var myInfo = {};
const TITLE_MAX_LENGTH = 40;

fetch('/v2/wapi/members/me', {
    credentials: "include"
}).then(function (res) {
    if (res.ok) {
        res.json().then(function (data) {
            myInfo = data.result;
        });
    }
});

function getTitle(word) {
    if (word.length < TITLE_MAX_LENGTH) {
        return word;
    }
    return word.slice(0, TITLE_MAX_LENGTH) + '...';
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    const text = msg.word.selectionText;
    fetch('/v2/wapi/projects/' + "@" + myInfo.content.userCode + '/posts?mode=simple', {
        method: "POST",
        credentials: "include",
        headers: {
            Accept: 'application/json',
            "Content-type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify([{
            body: {
                mimeType: "text/x-markdown",
                content: text
            },
            projectCode: "@" + myInfo.content.userCode,
            users: {
                to: [{
                    type: "member",
                    member: {
                        organizationMemberId: myInfo.content.id
                    }
                }]
            },
            subject: getTitle(text),
            dueDate: null,
            dueDateFlag: true

        }])
    }).then(function (res) {
        if (res.ok) {
            res.json().then(function (data) {
                if (data.header.isSuccessful) {
                    //TODO: bug? response에 파라미터가 안넘어간다..
                    sendResponse({title: getTitle(text)})
                }
            });
        }
    })
});
