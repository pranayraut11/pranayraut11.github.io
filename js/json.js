document.addEventListener('DOMContentLoaded', () => {
    console.log("JSON formatter initialized");
    
    // Get JSON formatter elements
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const formatJsonBtn = document.getElementById('format-json-btn');
    const minifyJsonBtn = document.getElementById('minify-json-btn');
    const clearJsonBtn = document.getElementById('clear-json-btn');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const indentWithTabs = document.getElementById('indent-with-tabs');
    const indentSpaces = document.getElementById('indent-spaces');
    const sampleJsonBtn = document.getElementById('sample-json-btn');
    const copyNotification = document.getElementById('copy-notification');
    
    // Function to syntax highlight JSON
    function syntaxHighlightJson(json) {
        if (!json) return '';
        
        // First escape HTML entities to prevent XSS
        let escapedJson = json.replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
        
        // Apply syntax highlighting with color spans
        let highlighted = escapedJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                    // Keep the colon with the key but style it differently
                    match = match.replace(/:$/, '') + '<span style="color: inherit;">:</span>';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
        
        // Wrap in a pre tag to properly preserve whitespace
        // The CSS for .json-formatted handles the rest
        return `<pre class="json-formatted">${highlighted}</pre>`;
    }
    
    // Function to format JSON
    function formatJson() {
        try {
            const input = jsonInput.value.trim();
            
            if (!input) {
                jsonOutput.innerHTML = '<div class="json-output-placeholder">Please enter JSON to format</div>';
                return;
            }
            
            // Parse the JSON to validate it
            const parsedJson = JSON.parse(input);
            
            // Get indentation settings
            const useTab = indentWithTabs.checked;
            const spaces = parseInt(indentSpaces.value) || 2;
            const indentation = useTab ? '\t' : ' '.repeat(spaces);
            
            // Format the JSON
            const formattedJson = JSON.stringify(parsedJson, null, indentation);
            
            // Apply syntax highlighting and display
            jsonOutput.innerHTML = syntaxHighlightJson(formattedJson);
            
            // Show success message
            showJsonMessage('JSON formatted successfully!', 'success');
        } catch (error) {
            // Show error message
            jsonOutput.innerHTML = `<div style="color: #e74c3c;">Error: ${error.message}</div>`;
            showJsonMessage('Invalid JSON!', 'error');
        }
    }
    
    // Function to minify JSON
    function minifyJson() {
        try {
            const input = jsonInput.value.trim();
            
            if (!input) {
                jsonOutput.innerHTML = '<div class="json-output-placeholder">Please enter JSON to minify</div>';
                return;
            }
            
            // Parse the JSON to validate it
            const parsedJson = JSON.parse(input);
            
            // Minify the JSON
            const minifiedJson = JSON.stringify(parsedJson);
            
            // Apply syntax highlighting and display
            jsonOutput.innerHTML = syntaxHighlightJson(minifiedJson);
            
            // Show success message
            showJsonMessage('JSON minified successfully!', 'success');
        } catch (error) {
            // Show error message
            jsonOutput.innerHTML = `<div style="color: #e74c3c;">Error: ${error.message}</div>`;
            showJsonMessage('Invalid JSON!', 'error');
        }
    }
    
    // Function to clear JSON
    function clearJson() {
        jsonInput.value = '';
        jsonOutput.innerHTML = '<div class="json-output-placeholder">Formatted JSON will appear here</div>';
    }
    
    // Function to copy formatted JSON
    function copyJson() {
        const content = jsonOutput.textContent;
        
        if (content && content !== 'Formatted JSON will appear here') {
            navigator.clipboard.writeText(content)
                .then(() => {
                    // Show notification
                    copyNotification.classList.add('show');
                    
                    // Hide notification after 2 seconds
                    setTimeout(() => {
                        copyNotification.classList.remove('show');
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy JSON to clipboard');
                });
        }
    }
    
    // Function to show JSON message
    function showJsonMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `json-message ${type}`;
        messageEl.textContent = message;
        
        // Add message to the DOM
        jsonOutput.parentNode.insertBefore(messageEl, jsonOutput);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
    
    // Function to insert sample JSON
    function insertSampleJson() {
        // Sample JSON with various data types
        const sampleJson = {
            "app": "JSON Formatter",
            "version": "1.0",
            "features": [
                "Format JSON",
                "Minify JSON",
                "Syntax Highlighting"
            ],
            "options": {
                "indent": true,
                "spaces": 2,
                "allowComments": false
            },
            "performance": {
                "formatTime": 0.032,
                "minifyTime": 0.012
            },
            "active": true,
            "status": null
        };
        
        // Insert sample JSON with 2 space indentation
        jsonInput.value = JSON.stringify(sampleJson, null, 2);
        
        // Format it to show the result
        formatJson();
    }
    
    // Event listeners for JSON formatter buttons
    formatJsonBtn.addEventListener('click', formatJson);
    minifyJsonBtn.addEventListener('click', minifyJson);
    clearJsonBtn.addEventListener('click', clearJson);
    copyJsonBtn.addEventListener('click', copyJson);
    sampleJsonBtn.addEventListener('click', insertSampleJson);
    
    // Format on Ctrl+Enter or Cmd+Enter
    jsonInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            formatJson();
        }
    });
    
    // Toggle tabs/spaces input visibility
    indentWithTabs.addEventListener('change', () => {
        document.querySelector('.space-input-container').style.display = 
            indentWithTabs.checked ? 'none' : 'flex';
    });
    
    // Initialize spaces input visibility
    document.querySelector('.space-input-container').style.display = 
        indentWithTabs.checked ? 'none' : 'flex';
});
