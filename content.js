function applyJsonTheme(json, theme, customColors) {
    let jsonStr = JSON.stringify(json, null, 2);
    let themedJson = jsonStr
        .replace(/("([^"]+)"):/g, '<span class="json-key">$1</span>:')
        .replace(/: ([\d.]+)/g, ': <span class="json-number">$1</span>')
        .replace(/: ("[^"]+")/g, ': <span class="json-string">$1</span>')
        .replace(/[\{\}]/g, (match) => `<span class="json-brace">${match}</span>`)
        .replace(/[\[\]]/g, (match) => `<span class="json-bracket">${match}</span>`);

    const themeClasses = {
        dark: {
            background: '#000000',
            key: '#e06c75',
            number: '#d19a66',
            string: '#98c379',
            brace: '#56b6c2',
            bracket: '#61afef',
            default: '#ffffff'
        },
        light: {
            background: '#ffffff',
            key: '#d50000',
            number: '#0056b3',
            string: '#007a33',
            brace: '#a0522d',
            bracket: '#8a2be2',
            default: '#000000'
        },
        custom: customColors || {}
    };

    const selectedTheme = themeClasses[theme] || { background: 'transparent', default: 'inherit' };

    document.body.style.backgroundColor = selectedTheme.background;
    document.body.style.color = selectedTheme.default;

    themedJson = themedJson
        .replace(/<span class="json-key">/g, `<span class="json-key" style="color: ${selectedTheme.key};">`)
        .replace(/<span class="json-number">/g, `<span class="json-number" style="color: ${selectedTheme.number};">`)
        .replace(/<span class="json-string">/g, `<span class="json-string" style="color: ${selectedTheme.string};">`)
        .replace(/<span class="json-brace">/g, `<span class="json-brace" style="color: ${selectedTheme.brace};">`)
        .replace(/<span class="json-bracket">/g, `<span class="json-bracket" style="color: ${selectedTheme.bracket};">`);

    return themedJson;
}

function applySelectedTheme(theme, customColors) {
    chrome.storage.sync.set({ selectedTheme: theme }, () => {
        const jsonElement = document.querySelector('pre');
        if (jsonElement) {
            try {
                const json = JSON.parse(jsonElement.textContent);
                const themedJson = applyJsonTheme(json, theme, customColors);
                jsonElement.innerHTML = themedJson;
            } catch (e) {
                console.error('invalid JSON:', e);
            }
        }
    });
}

window.onload = function() {
    chrome.storage.sync.get(['selectedTheme', 'customThemeColors'], (data) => {
        const theme = data.selectedTheme || 'light';
        const customColors = data.customThemeColors || {};
        const jsonElement = document.querySelector('pre');
        if (jsonElement) {
            try {
                const json = JSON.parse(jsonElement.textContent);
                const themedJson = applyJsonTheme(json, theme, customColors);
                jsonElement.innerHTML = themedJson;
            } catch (e) {
                console.error('invalid JSON:', e);
            }
        } else {
            console.warn('JSON not found.');
        }
    });
};
