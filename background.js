chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
          const url = window.location.href;

          if (url.endsWith('.json')) {
              fetch(url)
                  .then(response => response.json())
                  .then(json => {
                      const jsonElement = document.createElement('pre');
                      jsonElement.textContent = JSON.stringify(json, null, 2);
                      document.body.innerHTML = ''; 
                      document.body.appendChild(jsonElement);
                      
                      const theme = localStorage.getItem('selectedTheme') || 'light';
                      const themedJson = applyJsonTheme(json, theme);
                      jsonElement.innerHTML = themedJson;
                  })
                  .catch(e => console.error('Error loading JSON:', e));
          } else {
              console.warn('This page is not a JSON file.');
          }
      }
  });
});
