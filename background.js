chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Fetch the CSV data from genders.csv file
    fetch(chrome.runtime.getURL("data/wordList.csv"))
      .then(response => response.text())
      .then(csvData => {
        // Parse the CSV data into word-gender pairs
        const lines = csvData.trim().split("\n");
        const wordGenderPairs = lines.map(line => {
          const [csvWord, gender] = line.split(",");
          return { word: csvWord.trim(), gender: gender.trim() };
        });

        // Save the word-gender pairs in chrome.storage
        chrome.storage.local.set({ gendersData: wordGenderPairs }, function () {
          console.log("Data loaded into chrome.storage:", wordGenderPairs);
          // Callback: Data is set, you can do additional tasks here if needed
          checkDataInStorage();
        });
      })
      .catch(error => {
        console.error("Error fetching or parsing CSV data:", error);
      });
  }
});
function checkDataInStorage() {
  chrome.storage.local.get("gendersData", function (result) {
    const wordGenderPairs = result.gendersData || [];
    console.log("Data in chrome.storage.local:", wordGenderPairs);
    // You can perform further checks or actions based on the data here
    // For example, you can call another function that uses the loaded data
    // someFunctionThatUsesData(wordGenderPairs);
  });
}