// contentScript.js
function extractWordsFromHTML(html) {

    html= element
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const allTextNodes = tempElement.querySelectorAll('*');
  
    let words = [];
  
    for (let node of allTextNodes) {
      const text = node.innerText.trim();
      if (text !== '') {
        const nodeWords = text.split(/\s+/);
        words = words.concat(nodeWords);
      }
    }
  
    return words;
  }
  
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'extract_words') {
      const words = extractWordsFromHTML(message.html);
      sendResponse(words);
    }
  });
  