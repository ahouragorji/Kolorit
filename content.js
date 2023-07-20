async function getColorForParagraph(paragraph) {
  const wordMatchRegExp = /[^\s]+/g;
  const words = [...paragraph.textContent.match(wordMatchRegExp) || []];
  const fragment = document.createDocumentFragment();
  let currentPart = '';

  for (const word of words) {
    const colour = await getColorForWord(word);
    if (colour !== undefined) {
      if (currentPart !== '') {
        fragment.appendChild(document.createTextNode(currentPart + ' '));
        currentPart = '';
      }

      const spanElement = document.createElement('span');
      spanElement.style.color = colour;
      spanElement.textContent = word + ' ';
      fragment.appendChild(spanElement);
    } else {
      currentPart += word + ' ';
    }
  }

  if (currentPart !== '') {
    fragment.appendChild(document.createTextNode(currentPart));
  }

  paragraph.innerHTML = '';
  paragraph.appendChild(fragment);
}


async function colorWordsInParagraphs() {
  const paragraphs = document.querySelectorAll('p, i, li');
  const html = document.querySelector('html');

  if (isGermanLanguage(html)) {
    for (const paragraph of paragraphs) {
      await getColorForParagraph(paragraph);
    }
  }
}

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
 
    const cleanedWord = replaceUmlauts(word.toLowerCase().replace(/[.,?!]+$/, ''));
  
    return new Promise((resolve) => {
   
      chrome.storage.local.get("gendersData", function (result) {
        const wordGenderPairs = result.gendersData || [];
  
        
        const wordData = wordGenderPairs.find(data => data.word === cleanedWord);
        if (wordData) {
          
          switch (wordData.gender) {
            case "m":
              resolve("#17a2b8"); 
              break;
            case "f":
              resolve("#dc3445"); 
              break;
            case "n":
              resolve("#28a745"); 
              break;
            default:
              resolve(undefined);
          }
        } else {

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
          }
           {
            // Word not found in the CSV, resolve with undefined
            resolve(undefined);
          }
        }
      });
    });
  }
  
  

window.addEventListener('load', colorWordsInParagraphs);
