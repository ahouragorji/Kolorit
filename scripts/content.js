function colorWordsInParagraphs() {
    const paragraphs = document.querySelectorAll("p");
    const html = document.querySelector('html');
    console.log('checking if the language is german')
    if(isGermanLanguage(html)){

    paragraphs.forEach((paragraph) => {
            console.log('is german')
        const wordMatchRegExp = /[^\s]+/g;
        const words = paragraph.textContent.match(wordMatchRegExp);

        // Function to generate a random color in hexadecimal format (#RRGGBB)
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const fragment = document.createDocumentFragment();

        for (const word of words) {
            const spanElement = document.createElement('span');
            spanElement.style.color = getRandomColor();
            spanElement.textContent = word + ' '; // Add a space after each word
            fragment.appendChild(spanElement);
        }

        // Clear the original paragraph content and append the colored words
        paragraph.innerHTML = '';
        paragraph.appendChild(fragment);
    }
    );
}}
function isGermanLanguage(element) {
    const langValue = element.getAttribute("lang");
    return langValue && langValue.startsWith("de");
}
// Call the function to color words in all <p> tags on the page after the page is loaded
window.addEventListener('load', colorWordsInParagraphs);
