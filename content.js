function colorWordsInParagraphs() {
    const paragraphs = document.querySelectorAll("p");
    const html = document.querySelector('html');
   
    if(isGermanLanguage(html)){

    paragraphs.forEach((paragraph) => {
       
        const wordMatchRegExp = /[^\s]+/g;
        const words = paragraph.textContent.match(wordMatchRegExp);

        const fragment = document.createDocumentFragment();
        console.log(getColorForWord('ist'))

        for (const word of words) {
            colour = getColorForWord(word);
            if(colour!=undefined){
              console.log('added span')
              const spanElement = document.createElement('span');
              spanElement.style.color =colour
              spanElement.textContent = word + ' '; 
            fragment.appendChild(spanElement);
            
            }
        }
        
        paragraph.innerHTML = '';
        paragraph.appendChild(fragment);
        
    }
    );
}}
function isGermanLanguage(element) {
    const langValue = element.getAttribute("lang");
    return langValue && langValue.startsWith("de");
}
// A function that makes a german word english like 
// this is implemented to make our csv dictionary useful
function replaceUmlauts(germanWord) {
    const umlautMap = {
      'ä': 'a',
      'ö': 'o',
      'ü': 'u',
      'Ä': 'A',
      'Ö': 'O',
      'Ü': 'U',
      'ß': 's'
    };
  
    return germanWord.replace(/[äöüÄÖÜß]/g, match => umlautMap[match] || match);
  }
  async function getColorForWord(word) {
    // Convert the word to lowercase and remove trailing punctuation marks
    const cleanedWord = replaceUmlauts(word.toLowerCase().replace(/[.,?!]+$/, ''));
  
    return new Promise((resolve) => {
      // Load the CSV data from chrome.storage
      chrome.storage.local.get("gendersData", function (result) {
        const wordGenderPairs = result.gendersData || [];
  
        // First, check for an exact match
        const wordData = wordGenderPairs.find(data => data.word === cleanedWord);
        if (wordData) {
          // Return the color based on the gender
          switch (wordData.gender) {
            case "m":
              resolve("#17a2b8"); // Masculine color: #17a2b8 (Turquoise)
              break;
            case "f":
              resolve("#dc3445"); // Feminine color: #dc3445 (Crimson)
              break;
            case "n":
              resolve("#28a745"); // Neutral color: #28a745 (Green)
              break;
            default:
              resolve(undefined);
          }
        } else {
          // If no exact match, check for words at the end of other words
          const inferredGenderData = wordGenderPairs.find(data => cleanedWord.endsWith(data.word));
          if (inferredGenderData) {
            // Return the inferred gender color
            switch (inferredGenderData.gender) {
              case "m":
                resolve("#17a2b8"); // Masculine color: #17a2b8 (Turquoise)
                break;
              case "f":
                resolve("#dc3445"); // Feminine color: #dc3445 (Crimson)
                break;
              case "n":
                resolve("#28a745"); // Neutral color: #28a745 (Green)
                break;
              default:
                resolve(undefined);
            }
          } else {
            // Word not found in the CSV, resolve with undefined
            resolve(undefined);
          }
        }
      });
    });
  }
  
  

window.addEventListener('load', colorWordsInParagraphs);
