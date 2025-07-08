document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Generator and tab elements
    const generatorTab = document.getElementById('generator-tab');
    const validatorTab = document.getElementById('validator-tab');
    const generatorContent = document.getElementById('generator-content');
    const validatorContent = document.getElementById('validator-content');
    const validateGeneratedLink = document.getElementById('validate-generated-link');
    const generateNewLink = document.getElementById('generate-new-link');
    
    const generateBtn = document.getElementById('generate-btn');
    const ibanResult = document.getElementById('iban-result');
    const copyBtn = document.getElementById('copy-btn');
    const copyNotification = document.getElementById('copy-notification');
    const countrySelect = document.getElementById('country-select');
    
    // UUID generator elements
    const generateUuidBtn = document.getElementById('generate-uuid-btn');
    const uuidResult = document.getElementById('uuid-result');
    const uuidCopyBtn = document.getElementById('uuid-copy-btn');
    const uuidVersionRadios = document.getElementsByName('uuid-version');
    
    // IBAN validator elements
    const ibanToValidate = document.getElementById('iban-to-validate');
    const validateIbanBtn = document.getElementById('validate-iban-btn');
    const validationResult = document.getElementById('validation-result');
    const validationMessage = validationResult ? validationResult.querySelector('.validation-message') : null;
    const ibanCountryDetail = document.getElementById('iban-country');
    const ibanLengthDetail = document.getElementById('iban-length');
    const ibanFormatDetail = document.getElementById('iban-format');
    const ibanCheckDigitsDetail = document.getElementById('iban-check-digits');
    
    // JSON formatter elements
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const formatJsonBtn = document.getElementById('format-json-btn');
    const minifyJsonBtn = document.getElementById('minify-json-btn');
    const clearJsonBtn = document.getElementById('clear-json-btn');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const indentWithTabs = document.getElementById('indent-with-tabs');
    const indentSpaces = document.getElementById('indent-spaces');
    const sampleJsonBtn = document.getElementById('sample-json-btn');
    
    // Date converter elements
    const inputDate = document.getElementById('input-date');
    const inputFormat = document.getElementById('input-format');
    const outputFormat = document.getElementById('output-format');
    const convertDateBtn = document.getElementById('convert-date-btn');
    const dateResult = document.getElementById('date-result');
    const copyDateBtn = document.getElementById('copy-date-btn');
    const quickDateBtns = document.querySelectorAll('.quick-date-btn');
    
    // Check if JSON formatter elements exist
    const jsonFormatterExists = jsonInput && jsonOutput && formatJsonBtn && 
                              minifyJsonBtn && clearJsonBtn && copyJsonBtn && 
                              indentWithTabs && indentSpaces && sampleJsonBtn;
    
    if (jsonFormatterExists) {
        console.log("JSON formatter elements found");
        
        // JSON formatter functions
        
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
                
                // Format the JSON with proper indentation
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
                
                // Minify the JSON (no indentation)
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
            // Get raw text content from the json output element, stripping any HTML formatting
            const content = jsonOutput.textContent || jsonOutput.innerText;
            
            if (content && !content.includes('Formatted JSON will appear here')) {
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
        
        // Function to insert sample JSON
        function insertSampleJson() {
            // Sample JSON with various data types
            const sampleJson = {
                "app": "Random IBAN Generator",
                "version": "1.0",
                "features": [
                    "IBAN Generation",
                    "IBAN Validation",
                    "UUID Generation",
                    "JSON Formatting"
                ],
                "supportedCountries": 27,
                "creator": {
                    "name": "Developer",
                    "website": "https://example.com",
                    "active": true
                },
                "releaseDate": "2025-07-08",
                "securityInfo": {
                    "clientSideOnly": true,
                    "dataStorage": null,
                    "encryption": false
                },
                "performance": {
                    "generateTime": 0.032,
                    "validateTime": 0.028
                }
            };
            
            // Insert sample JSON with 2 space indentation
            jsonInput.value = JSON.stringify(sampleJson, null, 2);
            
            // Format it to show the result
            formatJson();
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
        
        // Add event listeners for JSON formatter
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
    } else {
        console.warn("JSON formatter elements not found");
    }
    
    // Check for saved theme preference or use system preference
    function getThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check for system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply theme
    function applyTheme(theme) {
        if (themeToggle && themeIcon) {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                document.body.classList.remove('dark-mode');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', theme);
        }
    }
    
    // Initialize theme
    if (themeToggle && themeIcon) {
        applyTheme(getThemePreference());
        
        // Theme toggle
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            
            // Add animation to icon
            themeIcon.style.animation = 'none';
            setTimeout(() => {
                themeIcon.style.animation = 'checkmark 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
            }, 10);
        });
    }
    
    // Tab functionality
    if (generatorTab && validatorTab && generatorContent && validatorContent) {
        function switchToTab(tabId) {
            // Hide all content
            generatorContent.style.display = 'none';
            validatorContent.style.display = 'none';
            
            // Remove active class from all tabs
            generatorTab.classList.remove('active');
            validatorTab.classList.remove('active');
            
            // Show selected content and activate tab
            if (tabId === 'generator') {
                generatorContent.style.display = 'block';
                generatorTab.classList.add('active');
            } else if (tabId === 'validator') {
                validatorContent.style.display = 'block';
                validatorTab.classList.add('active');
            }
        }
        
        // Tab click handlers
        generatorTab.addEventListener('click', () => switchToTab('generator'));
        validatorTab.addEventListener('click', () => switchToTab('validator'));
        
        // Link handlers
        if (validateGeneratedLink) {
            validateGeneratedLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get the current IBAN and put it in the validator input
                const currentIban = ibanResult.dataset.rawIban || ibanResult.textContent.replace(/\s/g, '');
                
                if (currentIban && currentIban !== "Click the button to generate an IBAN") {
                    ibanToValidate.value = currentIban;
                    switchToTab('validator');
                    validateIbanBtn.click(); // Automatically validate the IBAN
                } else {
                    alert('Please generate an IBAN first');
                }
            });
        }
        
        if (generateNewLink) {
            generateNewLink.addEventListener('click', (e) => {
                e.preventDefault();
                switchToTab('generator');
                generateBtn.click(); // Automatically generate a new IBAN
            });
        }
    }

    // Rest of your script (IBAN generation, UUID generation, etc.)
    // ...

    // Create particle effects for a more modern look
    function createParticleEffect() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        // Create 15 particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Random size
            const size = Math.random() * 8 + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation delay
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            
            // Random animation duration
            const duration = Math.random() * 10 + 5;
            particle.style.animationDuration = `${duration}s`;
            
            // Add to container
            container.appendChild(particle);
        }
    }
    
    // Initialize particle effect
    createParticleEffect();
    
    // Check if date converter elements exist
    const dateConverterExists = inputDate && inputFormat && outputFormat && convertDateBtn && dateResult && copyDateBtn && quickDateBtns;
    
    if (dateConverterExists) {
        console.log("Date converter elements found");
        
        // Load date-fns library dynamically
        const dateFnsScript = document.createElement('script');
        dateFnsScript.src = 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/dist/date-fns.min.js';
        dateFnsScript.onload = function() {
            console.log('date-fns library loaded');
        };
        document.head.appendChild(dateFnsScript);
        
        // Function to convert date
        function convertDate() {
            try {
                const input = inputDate.value.trim();
                
                if (!input) {
                    dateResult.textContent = 'Please enter a date';
                    return;
                }
                
                let date;
                const inFormat = inputFormat.value;
                
                // Parse input date based on selected format
                if (inFormat === 'unix') {
                    // Unix timestamp (seconds since epoch)
                    date = new Date(parseInt(input) * 1000);
                } else {
                    // Parse with date-fns if available, or fallback to built-in Date
                    if (typeof dateFns !== 'undefined') {
                        // Use date-fns parse with selected format
                        const formatString = getFormatString(inFormat);
                        date = dateFns.parse(input, formatString, new Date());
                    } else {
                        // Simple fallback
                        date = new Date(input);
                    }
                }
                
                // Validate date
                if (isNaN(date.getTime())) {
                    dateResult.textContent = 'Invalid date. Please check your input.';
                    return;
                }
                
                // Format output based on selected format
                const outFormat = outputFormat.value;
                let result;
                
                if (typeof dateFns !== 'undefined') {
                    // Use date-fns format
                    if (outFormat === 'unix') {
                        result = Math.floor(date.getTime() / 1000).toString();
                    } else if (outFormat === 'relative') {
                        result = dateFns.formatDistanceToNow(date, { addSuffix: true });
                    } else if (outFormat === 'iso8601') {
                        result = date.toISOString();
                    } else {
                        const formatString = getFormatString(outFormat);
                        result = dateFns.format(date, formatString);
                    }
                } else {
                    // Simple fallback formatting
                    if (outFormat === 'unix') {
                        result = Math.floor(date.getTime() / 1000).toString();
                    } else if (outFormat === 'iso8601') {
                        result = date.toISOString();
                    } else {
                        result = date.toLocaleDateString();
                    }
                }
                
                // Display result
                dateResult.textContent = result;
                
                // Show success message
                showDateMessage('Date converted successfully!', 'success');
            } catch (error) {
                console.error('Date conversion error:', error);
                dateResult.textContent = `Error: ${error.message}`;
                showDateMessage('Failed to convert date!', 'error');
            }
        }
        
        // Helper function to convert format strings
        function getFormatString(format) {
            switch(format) {
                case 'YYYY-MM-DD': return 'yyyy-MM-dd';
                case 'MM/DD/YYYY': return 'MM/dd/yyyy';
                case 'DD/MM/YYYY': return 'dd/MM/yyyy';
                case 'YYYY/MM/DD': return 'yyyy/MM/dd';
                case 'DD-MMM-YYYY': return 'dd-MMM-yyyy';
                case 'MMMM D, YYYY': return 'MMMM d, yyyy';
                case 'ddd, DD MMM YYYY': return 'EEE, dd MMM yyyy';
                default: return 'yyyy-MM-dd';
            }
        }
        
        // Function to handle quick date inputs
        function setQuickDate(value) {
            let date;
            const now = new Date();
            
            switch(value) {
                case 'now':
                    date = now;
                    break;
                case 'tomorrow':
                    date = new Date(now);
                    date.setDate(date.getDate() + 1);
                    break;
                case 'yesterday':
                    date = new Date(now);
                    date.setDate(date.getDate() - 1);
                    break;
                case 'next-week':
                    date = new Date(now);
                    date.setDate(date.getDate() + 7);
                    break;
                case 'last-month':
                    date = new Date(now);
                    date.setMonth(date.getMonth() - 1);
                    break;
            }
            
            // Format the date according to input format
            if (typeof dateFns !== 'undefined') {
                const formatString = getFormatString(inputFormat.value);
                inputDate.value = dateFns.format(date, formatString);
            } else {
                if (inputFormat.value === 'unix') {
                    inputDate.value = Math.floor(date.getTime() / 1000);
                } else {
                    // Simple fallback
                    inputDate.value = date.toISOString().split('T')[0]; // YYYY-MM-DD
                }
            }
            
            // Auto-convert the date
            convertDate();
        }
        
        // Function to copy converted date
        function copyDate() {
            const content = dateResult.textContent;
            
            if (content && content !== 'Converted date will appear here') {
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
                        alert('Failed to copy date to clipboard');
                    });
            }
        }
        
        // Function to show date message
        function showDateMessage(message, type) {
            const messageEl = document.createElement('div');
            messageEl.className = `date-message ${type}`;
            messageEl.textContent = message;
            
            // Add message to the DOM
            dateResult.parentNode.insertBefore(messageEl, dateResult);
            
            // Remove after 3 seconds
            setTimeout(() => {
                messageEl.remove();
            }, 3000);
        }
        
        // Add event listeners for date converter
        convertDateBtn.addEventListener('click', convertDate);
        copyDateBtn.addEventListener('click', copyDate);
        
        // Add event listeners for quick date buttons
        quickDateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setQuickDate(btn.dataset.value);
            });
        });
        
        // Convert on Enter key
        inputDate.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                convertDate();
            }
        });
    }
});
