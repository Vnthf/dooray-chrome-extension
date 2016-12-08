var id = chrome.contextMenus.create({
  title: "Create dooray task",
  contexts:["selection"],
  onclick: createDoorayTask,
  documentUrlPatterns: ["*://*.dooray.com/*"]
});

function createDoorayTask (word, tab){
  chrome.tabs.sendMessage(tab.id, {word: word}, function(response){
    showNotification();
  });
};

function showNotification() {
  chrome.notifications.create('createTask', {
     type: 'basic',
     iconUrl: 'assets/icon48.png',
     eventTime: 1000,
     title: 'Dooray',
     message: 'Create task successfully'
  }, function(notificationId) {});
}
