document.addEventListener('DOMContentLoaded', () => {
  // Load the saved theme from chrome storage
  chrome.storage.sync.get('selectedTheme', (data) => {
      if (data.selectedTheme) {
          document.getElementById('themeSelector').value = data.selectedTheme;
          if (data.selectedTheme === 'custom') {
              document.getElementById('customTheme').style.display = 'block';
              chrome.storage.sync.get('customThemeColors', (colorData) => {
                  document.getElementById('bgColor').value = colorData.customThemeColors.background || '#ffffff';
                  document.getElementById('keyColor').value = colorData.customThemeColors.key || '#000000';
                  document.getElementById('numberColor').value = colorData.customThemeColors.number || '#000000';
                  document.getElementById('stringColor').value = colorData.customThemeColors.string || '#000000';
                  document.getElementById('braceColor').value = colorData.customThemeColors.brace || '#000000';
                  document.getElementById('bracketColor').value = colorData.customThemeColors.bracket || '#000000';
                  document.getElementById('defaultColor').value = colorData.customThemeColors.default || '#000000';
              });
          }
      }
  });

  document.getElementById('themeSelector').addEventListener('change', (event) => {
      if (event.target.value === 'custom') {
          document.getElementById('customTheme').style.display = 'block';
      } else {
          document.getElementById('customTheme').style.display = 'none';
      }
  });

  document.getElementById('applyTheme').addEventListener('click', () => {
      const selectedTheme = document.getElementById('themeSelector').value;
      chrome.storage.sync.set({ selectedTheme: selectedTheme });

      let customThemeColors = {};
      if (selectedTheme === 'custom') {
          customThemeColors = {
              background: document.getElementById('bgColor').value,
              key: document.getElementById('keyColor').value,
              number: document.getElementById('numberColor').value,
              string: document.getElementById('stringColor').value,
              brace: document.getElementById('braceColor').value,
              bracket: document.getElementById('bracketColor').value,
              default: document.getElementById('defaultColor').value
          };
          chrome.storage.sync.set({ customThemeColors: customThemeColors });
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: (theme, customColors) => {
                  applySelectedTheme(theme, customColors);
              },
              args: [selectedTheme, customThemeColors]
          });
      });
  });
});
