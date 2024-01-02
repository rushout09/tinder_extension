document.getElementById('startBtn').addEventListener('click', function() {
  console.log('Button clicked');
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log('Sending message to content script');
    chrome.tabs.sendMessage(tabs[0].id, { action: 'startAutomation' });
  });
});

