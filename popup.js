function getActiveTabHTML(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      chrome.tabs.executeScript(currentTab.id, { code: 'document.body.innerHTML' }, function(result) {
        const tabHTML = result[0];
        callback(tabHTML);
      });
    });
  }
  
  function extractWordsFromHTML(tabHTML, callback) {
    chrome.tabs.executeScript({ code: '(' + extractWordsFromHTML.toString() + ')("' + tabHTML + '")' }, function(result) {
      const words = result[0];
      callback(words);
    });
  }
  
  // Example usage:
  getActiveTabHTML(function(tabHTML) {
    extractWordsFromHTML(tabHTML, function(words) {
      console.log(words); // This will log an array of words extracted from the active tab's HTML.
    });
  });
  