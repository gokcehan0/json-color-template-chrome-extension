document.addEventListener('DOMContentLoaded', () => {
    // Load the saved theme from chrome storage
    chrome.storage.sync.get('selectedTheme', (data) => {
      if (data.selectedTheme) {
        document.getElementById('themeSelector').value = data.selectedTheme;
      }
    });
  
    document.getElementById('applyTheme').addEventListener('click', () => {
      const selectedTheme = document.getElementById('themeSelector').value;
      chrome.storage.sync.set({ selectedTheme: selectedTheme });
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (theme) => {
            applySelectedTheme(theme);
          },
          args: [selectedTheme]
        });
      });
    });
  });