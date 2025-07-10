document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - initializing scripts");
    
    // Debounce function to limit how often a function can be called
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    
    // Log errors to help debug DOM element issues
    function logError(message) {
        console.error(`ERROR: ${message}`);
    }
    
    // Element initialization helper
    function getElement(id, required = false) {
        const element = document.getElementById(id);
        if (!element && required) {
            logError(`Required element not found: ${id}`);
        }
        return element;
    }
    
    // Theme toggle elements
    const themeToggle = getElement('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Generator and tab elements
    const generatorTab = getElement('generator-tab');
    const validatorTab = getElement('validator-tab');
    const generatorContent = getElement('generator-content');
    const validatorContent = getElement('validator-content');
    const validateGeneratedLink = getElement('validate-generated-link');
    const generateNewLink = getElement('generate-new-link');
    
    const generateBtn = getElement('generate-btn');
    const ibanResult = getElement('iban-result');
    const copyBtn = getElement('copy-btn');
    const copyNotification = getElement('copy-notification');
    const countrySelect = getElement('country-select');
    
    // IBAN validator elements
    const ibanToValidate = getElement('iban-to-validate', true);
    const validateIbanBtn = getElement('validate-iban-btn', true);
    const validationResult = getElement('validation-result', true);
    const validationMessage = validationResult ? validationResult.querySelector('.validation-message') : null;
    const ibanCountryDetail = getElement('iban-country');
    const ibanLengthDetail = getElement('iban-length');
    const ibanFormatDetail = getElement('iban-format');
    const ibanCheckDigitsDetail = getElement('iban-check-digits');
    
    console.log("IBAN validator elements initialization:");
    console.log("- ibanToValidate:", ibanToValidate);
    console.log("- validateIbanBtn:", validateIbanBtn);
    console.log("- validationResult:", validationResult);
    console.log("- validationMessage:", validationMessage);
    
    // UUID generator elements
    const generateUuidBtn = document.getElementById('generate-uuid-btn');
    const uuidResult = document.getElementById('uuid-result');
    const uuidCopyBtn = document.getElementById('uuid-copy-btn');
    const uuidVersionRadios = document.getElementsByName('uuid-version');
    
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
    
    console.log("Elements initialized:");
    console.log("generateBtn:", generateBtn);
    console.log("convertDateBtn:", convertDateBtn);
    console.log("formatJsonBtn:", formatJsonBtn);
    
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
        
        // Format JSON on Ctrl+Enter
        jsonInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                formatJson();
            }
        });
    }
    
    // Check if date converter elements exist
    const dateConverterExists = inputDate && inputFormat && outputFormat && 
                                convertDateBtn && dateResult && copyDateBtn;
                                
    if (dateConverterExists) {
        console.log("Date converter elements found");
        
        // Function to convert date
        function convertDate() {
            try {
                console.log("Converting date...");
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
                } else if (typeof dateFns !== 'undefined') {
                    // Use date-fns parse with selected format
                    const formatString = getFormatString(inFormat);
                    try {
                        date = dateFns.parse(input, formatString, new Date());
                    } catch (e) {
                        // Fallback to built-in Date
                        console.log("Error parsing with date-fns, fallback to built-in Date", e);
                        date = new Date(input);
                    }
                } else {
                    // Simple fallback using built-in Date
                    date = new Date(input);
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
                        console.log("Formatting date with format:", outFormat, "format string:", formatString);
                        
                        // Special logging for day name formats
                        if (outFormat === 'ddd, DD MMM YYYY') {
                            console.log("Date object day:", date.getDay(), "Date object:", date);
                            try {
                                // Test different ways to get day of week
                                console.log("Testing different day formats:");
                                if (typeof dateFns.format === 'function') {
                                    console.log("- iii format:", dateFns.format(date, 'iii'));
                                    console.log("- EEE format:", dateFns.format(date, 'EEE'));
                                    console.log("- iiii format:", dateFns.format(date, 'iiii'));
                                    console.log("- EEEE format:", dateFns.format(date, 'EEEE'));
                                }
                            } catch (e) {
                                console.warn("Error testing day formats:", e);
                            }
                        }
                        
                        try {
                            result = dateFns.format(date, formatString);
                            console.log("Formatted result:", result);
                        } catch (e) {
                            console.error("Error formatting date:", e);
                            // Fallback to a simpler formatting
                            if (outFormat === 'DD-MMM-YYYY') {
                                // Custom fallback for DD-MMM-YYYY format
                                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                result = `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
                                console.log("Using custom fallback for DD-MMM-YYYY:", result);
                            } else if (outFormat === 'ddd, DD MMM YYYY') {
                                // Custom fallback for ddd, DD MMM YYYY format
                                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                result = `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
                                console.log("Using custom fallback for ddd, DD MMM YYYY:", result);
                            } else {
                                result = date.toLocaleDateString();
                            }
                        }
                    }
                } else {
                    // Simple fallback formatting
                    if (outFormat === 'unix') {
                        result = Math.floor(date.getTime() / 1000).toString();
                    } else if (outFormat === 'iso8601') {
                        result = date.toISOString();
                    } else if (outFormat === 'YYYY-MM-DD') {
                        result = date.toISOString().split('T')[0];
                    } else if (outFormat === 'MM/DD/YYYY') {
                        result = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                    } else if (outFormat === 'DD/MM/YYYY') {
                        result = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    } else if (outFormat === 'DD-MMM-YYYY') {
                        // Custom handling for DD-MMM-YYYY format
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        result = `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
                    } else if (outFormat === 'ddd, DD MMM YYYY') {
                        // Custom handling for ddd, DD MMM YYYY format
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        result = `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
                case 'DD-MMM-YYYY': return 'dd-LLL-yyyy';  // Using LLL for abbreviated month name
                case 'MMMM D, YYYY': return 'MMMM d, yyyy';
                case 'ddd, DD MMM YYYY': return 'iii, dd LLL yyyy';  // Using iii for abbreviated day name
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
            
            // Set the input date to ISO format and convert
            inputDate.value = date.toISOString().split('T')[0];
            inputFormat.value = 'YYYY-MM-DD'; // ISO format
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
        console.log("Setting up date converter event listeners");
        convertDateBtn.addEventListener('click', convertDate);
        copyDateBtn.addEventListener('click', copyDate);
        
        // Auto-convert when input or format changes
        inputDate.addEventListener('input', debounce(() => {
            if (inputDate.value.trim().length > 2) {
                convertDate();
            }
        }, 500));
        
        inputFormat.addEventListener('change', () => {
            if (inputDate.value.trim()) {
                convertDate();
            }
        });
        
        outputFormat.addEventListener('change', () => {
            if (inputDate.value.trim()) {
                convertDate();
            }
        });
        
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
    
    // IBAN Generator functionality
    if (generateBtn && ibanResult && copyBtn) {
        console.log("IBAN generator elements found");
        
        // Country names for display
        const countryNames = {
            'AT': 'Austria', 'BE': 'Belgium', 'BG': 'Bulgaria', 'CH': 'Switzerland',
            'CZ': 'Czech Republic', 'DE': 'Germany', 'DK': 'Denmark', 'ES': 'Spain',
            'FI': 'Finland', 'FR': 'France', 'GB': 'United Kingdom', 'GR': 'Greece',
            'HR': 'Croatia', 'HU': 'Hungary', 'IE': 'Ireland', 'IT': 'Italy',
            'LT': 'Lithuania', 'LU': 'Luxembourg', 'LV': 'Latvia', 'MT': 'Malta',
            'NL': 'Netherlands', 'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania',
            'SE': 'Sweden', 'SI': 'Slovenia', 'SK': 'Slovakia'
        };
        
        // Function to generate random IBAN
        function generateIBAN(countryCode) {
            // IBAN structure by country - based on real IBAN formats
            const ibanStructure = {
                'AT': { length: 20, format: 'AT00 0000 0000 0000 0000', bban: '16n' },
                'BE': { length: 16, format: 'BE00 0000 0000 0000', bban: '12n' },
                'BG': { length: 22, format: 'BG00 AAAA 0000 0000 0000 00', bban: '4a,6n,8c' },
                'CH': { length: 21, format: 'CH00 0000 0000 0000 0000 0', bban: '5n,12c' },
                'CZ': { length: 24, format: 'CZ00 0000 0000 0000 0000 0000', bban: '20n' },
                'DE': { length: 22, format: 'DE00 0000 0000 0000 0000 00', bban: '18n' },
                'DK': { length: 18, format: 'DK00 0000 0000 0000 00', bban: '14n' },
                'ES': { length: 24, format: 'ES00 0000 0000 0000 0000 0000', bban: '20n' },
                'FI': { length: 18, format: 'FI00 0000 0000 0000 00', bban: '14n' },
                'FR': { length: 27, format: 'FR00 0000 0000 0000 0000 0000 000', bban: '10n,11c,2n' },
                'GB': { length: 22, format: 'GB00 AAAA 0000 0000 0000 00', bban: '4a,14n' },
                'GR': { length: 27, format: 'GR00 0000 0000 0000 0000 0000 000', bban: '7n,16c' },
                'HR': { length: 21, format: 'HR00 0000 0000 0000 0000 0', bban: '17n' },
                'HU': { length: 28, format: 'HU00 0000 0000 0000 0000 0000 0000', bban: '24n' },
                'IE': { length: 22, format: 'IE00 AAAA 0000 0000 0000 00', bban: '4a,14n' },
                'IT': { length: 27, format: 'IT00 A000 0000 0000 0000 0000 000', bban: '1a,10n,12c' },
                'LT': { length: 20, format: 'LT00 0000 0000 0000 0000', bban: '16n' },
                'LU': { length: 20, format: 'LU00 0000 0000 0000 0000', bban: '3n,13c' },
                'LV': { length: 21, format: 'LV00 AAAA 0000 0000 0000 0', bban: '4a,13c' },
                'MT': { length: 31, format: 'MT00 AAAA 0000 0000 0000 0000 0000 000', bban: '4a,5n,18c' },
                'NL': { length: 18, format: 'NL00 AAAA 0000 0000 00', bban: '4a,10n' },
                'PL': { length: 28, format: 'PL00 0000 0000 0000 0000 0000 0000', bban: '24n' },
                'PT': { length: 25, format: 'PT00 0000 0000 0000 0000 0000 0', bban: '21n' },
                'RO': { length: 24, format: 'RO00 AAAA 0000 0000 0000 0000', bban: '4a,16c' },
                'SE': { length: 24, format: 'SE00 0000 0000 0000 0000 0000', bban: '20n' },
                'SI': { length: 19, format: 'SI00 0000 0000 0000 000', bban: '15n' },
                'SK': { length: 24, format: 'SK00 0000 0000 0000 0000 0000', bban: '20n' }
            };
            
            // Function to validate an IBAN
            function validateIBAN(iban) {
                // Remove spaces and convert to uppercase
                iban = iban.replace(/\s/g, '').toUpperCase();
                
                // Check length against country specification
                const countryCode = iban.substring(0, 2);
                const structure = ibanStructure[countryCode];
                if (!structure || iban.length !== structure.length) {
                    return false;
                }
                
                // Move first 4 chars to the end
                let rearranged = iban.substring(4) + iban.substring(0, 4);
                
                // Convert letters to numbers (A=10, B=11, ..., Z=35)
                let numerical = '';
                for (let i = 0; i < rearranged.length; i++) {
                    let char = rearranged.charAt(i);
                    let code = char.charCodeAt(0);
                    if (code >= 65 && code <= 90) {
                        numerical += (code - 55); // A=10, B=11, ...
                    } else {
                        numerical += char;
                    }
                }
                
                // Calculate mod 97 and check if it's 1
                let remainder = 0;
                for (let i = 0; i < numerical.length; i++) {
                    remainder = (remainder * 10 + parseInt(numerical.charAt(i))) % 97;
                }
                
                return remainder === 1;
            }
            
            // Get structure for the selected country
            const structure = ibanStructure[countryCode];
            if (!structure) {
                throw new Error(`Country code ${countryCode} not supported`);
            }
            
            // Parse the BBAN format and generate according to its rules
            function generateBBAN(bbanFormat) {
                // Format description: 
                // n: Digits (0-9)
                // a: Upper case letters (A-Z)
                // c: Alphanumeric (0-9, A-Z)
                let bban = '';
                const parts = bbanFormat.split(',');
                
                for (const part of parts) {
                    const length = parseInt(part);
                    const type = part.slice(String(length).length);
                    
                    for (let i = 0; i < length; i++) {
                        if (type === 'n') {
                            // Digits only
                            bban += Math.floor(Math.random() * 10).toString();
                        } else if (type === 'a') {
                            // Letters only
                            bban += String.fromCharCode(65 + Math.floor(Math.random() * 26));
                        } else if (type === 'c') {
                            // Alphanumeric
                            if (Math.random() > 0.7) { // 30% chance for letter
                                bban += String.fromCharCode(65 + Math.floor(Math.random() * 26));
                            } else {
                                bban += Math.floor(Math.random() * 10).toString();
                            }
                        }
                    }
                }
                
                return bban;
            }
            
            // Generate BBAN according to country format
            const bban = generateBBAN(structure.bban);
            
            // Temporary IBAN with '00' as check digits
            let tempIban = countryCode + '00' + bban;
            
            // Calculate check digits
            // Move first 4 chars to the end
            let rearranged = tempIban.substring(4) + tempIban.substring(0, 4);
            
            // Convert letters to numbers (A=10, B=11, ..., Z=35)
            let numerical = '';
            for (let i = 0; i < rearranged.length; i++) {
                let char = rearranged.charAt(i);
                let code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) {
                    numerical += (code - 55); // A=10, B=11, ...
                } else {
                    numerical += char;
                }
            }
            
            // Calculate mod 97
            let remainder = 0;
            for (let i = 0; i < numerical.length; i++) {
                remainder = (remainder * 10 + parseInt(numerical.charAt(i))) % 97;
            }
            
            // Check digits are 98 - remainder
            let checkDigits = 98 - remainder;
            checkDigits = checkDigits.toString().padStart(2, '0');
            
            // Final IBAN
            let iban = countryCode + checkDigits + bban;
            
            return iban;
        }
        
        // Function to format IBAN with spaces every 4 characters
        function formatIBAN(iban) {
            return iban.match(/.{1,4}/g).join(' ');
        }
        
        // Handle IBAN generation
        function handleIBANGeneration() {
            try {
                const countryCode = countrySelect.value;
                const iban = generateIBAN(countryCode);
                
                // Display formatted IBAN
                ibanResult.textContent = formatIBAN(iban);
                ibanResult.dataset.rawIban = iban; // Store raw IBAN for copying
                
                // Show success notification
                showNotification('IBAN generated successfully!', 'success');
                
                // Enable copy button
                copyBtn.disabled = false;
            } catch (error) {
                console.error('IBAN generation error:', error);
                ibanResult.textContent = `Error: ${error.message}`;
                showNotification('Failed to generate IBAN!', 'error');
            }
        }
        
        // Add event listener for IBAN generation
        generateBtn.addEventListener('click', handleIBANGeneration);
        
        // Copy button functionality
        copyBtn.addEventListener('click', () => {
            const rawIban = ibanResult.dataset.rawIban || ibanResult.textContent.replace(/\s/g, '');
            
            if (rawIban && rawIban !== "Click the button to generate an IBAN") {
                navigator.clipboard.writeText(rawIban)
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
                        alert('Failed to copy IBAN to clipboard');
                    });
            }
        });
    }
    
    // UUID Generator functionality
    if (generateUuidBtn && uuidResult) {
        console.log("UUID generator elements found");
        
        // Function to generate UUID v4 (random)
        function generateUUIDv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        // Function to generate UUID v1 (timestamp-based)
        function generateUUIDv1() {
            const now = new Date();
            const timestamp = now.getTime();
            const clockseq = Math.floor(Math.random() * 16384);
            const node = (Math.random() * 0x1000000000000).toString(16).padStart(12, '0');
            
            // Format timestamp in UUID v1 format
            const timeHigh = ((timestamp / 0x100000000 * 10000) + 0x01B21DD213814000) & 0xFFFFFFFF;
            const timeMid = ((timeHigh / 0x10000) & 0xFFFF).toString(16).padStart(4, '0');
            const timeHighAndVersion = ((timeHigh & 0xFFFF) | 0x1000).toString(16).padStart(4, '0');
            const clockSeqHiAndReserved = ((clockseq >> 8) | 0x80).toString(16).padStart(2, '0');
            const clockSeqLow = (clockseq & 0xFF).toString(16).padStart(2, '0');
            
            // Format the low part of the timestamp
            const timeLow = ((timestamp * 10000) & 0xFFFFFFFF).toString(16).padStart(8, '0');
            
            return `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`;
        }
        
        // Handle UUID generation
        function handleUUIDGeneration() {
            try {
                let uuid;
                
                // Get selected UUID version
                const selectedVersion = Array.from(uuidVersionRadios).find(radio => radio.checked).value;
                
                if (selectedVersion === 'v1') {
                    uuid = generateUUIDv1();
                } else {
                    uuid = generateUUIDv4();
                }
                
                // Display UUID
                uuidResult.textContent = uuid;
                
                // Show success notification
                showNotification('UUID generated successfully!', 'success');
            } catch (error) {
                console.error('UUID generation error:', error);
                uuidResult.textContent = `Error: ${error.message}`;
                showNotification('Failed to generate UUID!', 'error');
            }
        }
        
        // Add event listener for UUID generation
        generateUuidBtn.addEventListener('click', handleUUIDGeneration);
        
        // Copy UUID functionality
        if (uuidCopyBtn) {
            uuidCopyBtn.addEventListener('click', () => {
                const uuid = uuidResult.textContent;
                
                if (uuid && uuid !== "Click the button to generate a UUID") {
                    navigator.clipboard.writeText(uuid)
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
                            alert('Failed to copy UUID to clipboard');
                        });
                }
            });
        }
    }
    
    // Show notification function
    function showNotification(message, type) {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification ${type}`;
        notificationEl.textContent = message;
        
        // Add notification to the DOM
        document.body.appendChild(notificationEl);
        
        // Show notification
        setTimeout(() => {
            notificationEl.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notificationEl.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                notificationEl.remove();
            }, 300);
        }, 3000);
    }
    
    // Theme functions
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
        if (themeIcon) {
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
    applyTheme(getThemePreference());
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            
            // Add animation to icon
            if (themeIcon) {
                themeIcon.style.animation = 'none';
                setTimeout(() => {
                    themeIcon.style.animation = 'checkmark 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                }, 10);
            }
        });
    }
    
    // Tab functionality
    function switchToTab(tabId) {
        if (!generatorContent || !validatorContent) return;
        
        // Hide all content
        generatorContent.style.display = 'none';
        validatorContent.style.display = 'none';
        
        // Remove active class from all tabs
        if (generatorTab) generatorTab.classList.remove('active');
        if (validatorTab) validatorTab.classList.remove('active');
        
        // Show selected content and activate tab
        if (tabId === 'generator') {
            generatorContent.style.display = 'block';
            if (generatorTab) generatorTab.classList.add('active');
        } else if (tabId === 'validator') {
            validatorContent.style.display = 'block';
            if (validatorTab) validatorTab.classList.add('active');
        }
    }
    
    // Tab click handlers
    if (generatorTab) {
        generatorTab.addEventListener('click', () => switchToTab('generator'));
    }
    if (validatorTab) {
        validatorTab.addEventListener('click', () => switchToTab('validator'));
    }
    
    console.log("Script initialization complete");
    
    // Initialize IBAN validator
    initializeIbanValidator();
    
    // IBAN Validator functionality
    function initializeIbanValidator() {
        console.log("Initializing IBAN validator...");
        
        // Get all needed elements
        const ibanToValidate = getElement('iban-to-validate');
        const validateIbanBtn = getElement('validate-iban-btn');
        const validationResult = getElement('validation-result');
        
        // Exit if essential elements are missing
        if (!ibanToValidate || !validateIbanBtn || !validationResult) {
            console.error("Essential IBAN validator elements missing - aborting initialization");
            return;
        }
        
        console.log("IBAN validator elements found");
        
        // Define IBAN structure for validator (independent of generator)
        const ibanStructure = {
            'AT': { length: 20, format: 'AT00 0000 0000 0000 0000', bban: '16n' },
            'BE': { length: 16, format: 'BE00 0000 0000 0000', bban: '12n' },
            'BG': { length: 22, format: 'BG00 AAAA 0000 0000 0000 00', bban: '4a,6n,8c' },
            'CH': { length: 21, format: 'CH00 0000 0000 0000 0000 0', bban: '5n,12c' },
            'CZ': { length: 24, format: 'CZ00 0000 0000 0000 0000 0000', bban: '20n' },
            'DE': { length: 22, format: 'DE00 0000 0000 0000 0000 00', bban: '18n' },
            'DK': { length: 18, format: 'DK00 0000 0000 0000 00', bban: '14n' },
            'ES': { length: 24, format: 'ES00 0000 0000 0000 0000 0000', bban: '20n' },
            'FI': { length: 18, format: 'FI00 0000 0000 0000 00', bban: '14n' },
            'FR': { length: 27, format: 'FR00 0000 0000 0000 0000 0000 000', bban: '10n,11c,2n' },
            'GB': { length: 22, format: 'GB00 AAAA 0000 0000 0000 00', bban: '4a,14n' },
            'GR': { length: 27, format: 'GR00 0000 0000 0000 0000 0000 000', bban: '7n,16c' },
            'HR': { length: 21, format: 'HR00 0000 0000 0000 0000 0', bban: '17n' },
            'HU': { length: 28, format: 'HU00 0000 0000 0000 0000 0000 0000', bban: '24n' },
            'IE': { length: 22, format: 'IE00 AAAA 0000 0000 0000 00', bban: '4a,14n' },
            'IT': { length: 27, format: 'IT00 A000 0000 0000 0000 0000 000', bban: '1a,10n,12c' },
            'LT': { length: 20, format: 'LT00 0000 0000 0000 0000', bban: '16n' },
            'LU': { length: 20, format: 'LU00 0000 0000 0000 0000', bban: '3n,13c' },
            'LV': { length: 21, format: 'LV00 AAAA 0000 0000 0000 0', bban: '4a,13c' },
            'MT': { length: 31, format: 'MT00 AAAA 0000 0000 0000 0000 0000 000', bban: '4a,5n,18c' },
            'NL': { length: 18, format: 'NL00 AAAA 0000 0000 00', bban: '4a,10n' },
            'PL': { length: 28, format: 'PL00 0000 0000 0000 0000 0000 0000', bban: '24n' },
            'PT': { length: 25, format: 'PT00 0000 0000 0000 0000 0000 0', bban: '21n' },
            'RO': { length: 24, format: 'RO00 AAAA 0000 0000 0000 0000', bban: '4a,16c' },
            'SE': { length: 24, format: 'SE00 0000 0000 0000 0000 0000', bban: '20n' },
            'SI': { length: 19, format: 'SI00 0000 0000 0000 000', bban: '15n' },
            'SK': { length: 24, format: 'SK00 0000 0000 0000 0000 0000', bban: '20n' }
        };
        
        // Country names for validator
        const countryNames = {
            'AT': 'Austria', 'BE': 'Belgium', 'BG': 'Bulgaria', 'CH': 'Switzerland',
            'CZ': 'Czech Republic', 'DE': 'Germany', 'DK': 'Denmark', 'ES': 'Spain',
            'FI': 'Finland', 'FR': 'France', 'GB': 'United Kingdom', 'GR': 'Greece',
            'HR': 'Croatia', 'HU': 'Hungary', 'IE': 'Ireland', 'IT': 'Italy',
            'LT': 'Lithuania', 'LU': 'Luxembourg', 'LV': 'Latvia', 'MT': 'Malta',
            'NL': 'Netherlands', 'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania',
            'SE': 'Sweden', 'SI': 'Slovenia', 'SK': 'Slovakia'
        };
        
        // Function to validate an IBAN with detailed results
        function validateIBANWithDetails(iban) {
            // Remove spaces and convert to uppercase
            iban = iban.replace(/\s/g, '').toUpperCase();
            
            // Basic format check: length and country code
            if (iban.length < 5) {
                return {
                    isValid: false,
                    message: 'IBAN is too short',
                    details: {
                        country: 'Unknown',
                        length: iban.length,
                        format: 'Invalid',
                        checkDigits: 'Invalid'
                    }
                };
            }
            
            const countryCode = iban.substring(0, 2);
            const structure = ibanStructure[countryCode];
            
            // Check if country code is valid
            if (!structure) {
                return {
                    isValid: false,
                    message: 'Invalid country code',
                    details: {
                        country: 'Unknown (' + countryCode + ')',
                        length: iban.length,
                        format: 'Invalid',
                        checkDigits: 'Invalid'
                    }
                };
            }
            
            // Check length
            if (iban.length !== structure.length) {
                return {
                    isValid: false,
                    message: `IBAN length incorrect (should be ${structure.length} characters)`,
                    details: {
                        country: countryNames[countryCode] || countryCode,
                        length: `${iban.length} (should be ${structure.length})`,
                        format: 'Invalid length',
                        checkDigits: 'Not checked'
                    }
                };
            }
            
            // Character validation (only A-Z, 0-9 allowed)
            if (!/^[A-Z0-9]+$/.test(iban)) {
                return {
                    isValid: false,
                    message: 'IBAN contains invalid characters',
                    details: {
                        country: countryNames[countryCode] || countryCode,
                        length: iban.length,
                        format: 'Invalid characters',
                        checkDigits: 'Not checked'
                    }
                };
            }
            
            // Check digits validation (MOD 97-10)
            const checkDigits = iban.substring(2, 4);
            
            // Rearrange and convert to numeric
            let rearranged = iban.substring(4) + iban.substring(0, 4);
            let numerical = '';
            
            for (let i = 0; i < rearranged.length; i++) {
                let char = rearranged.charAt(i);
                if (/[A-Z]/.test(char)) {
                    numerical += (char.charCodeAt(0) - 55);
                } else {
                    numerical += char;
                }
            }
            
            // Calculate remainder
            let remainder = 0;
            for (let i = 0; i < numerical.length; i++) {
                remainder = (remainder * 10 + parseInt(numerical.charAt(i))) % 97;
            }
            
            const isValidChecksum = remainder === 1;
            
            return {
                isValid: isValidChecksum,
                message: isValidChecksum ? 'IBAN is valid' : 'Invalid check digits',
                details: {
                    country: countryNames[countryCode] || countryCode,
                    length: `${iban.length} (correct)`,
                    format: structure.format || 'Valid format',
                    checkDigits: isValidChecksum ? 'Valid' : 'Invalid'
                }
            };
        }
        
        // Handle IBAN validation
        function handleIBANValidation() {
            console.log("Validating IBAN...");
            
            const iban = ibanToValidate.value.trim();
            console.log("IBAN to validate:", iban);
            
            if (!iban) {
                showNotification('Please enter an IBAN to validate', 'error');
                return;
            }
            
            try {
                // Validate the IBAN
                const result = validateIBANWithDetails(iban);
                console.log("Validation result:", result);
                
                // Get or create validation message
                let validationMessage = validationResult.querySelector('.validation-message');
                if (!validationMessage) {
                    validationMessage = document.createElement('div');
                    validationMessage.className = 'validation-message';
                    validationResult.appendChild(validationMessage);
                }
                
                // Get or create validation icon
                let validationIcon = validationResult.querySelector('.validation-icon');
                if (!validationIcon) {
                    validationIcon = document.createElement('div');
                    validationIcon.className = 'validation-icon';
                    const iconI = document.createElement('i');
                    iconI.className = result.isValid ? 'fas fa-check-circle' : 'fas fa-times-circle';
                    validationIcon.appendChild(iconI);
                    validationResult.prepend(validationIcon);
                } else {
                    // Update existing icon
                    let iconI = validationIcon.querySelector('i');
                    if (!iconI) {
                        iconI = document.createElement('i');
                        validationIcon.appendChild(iconI);
                    }
                    iconI.className = result.isValid ? 'fas fa-check-circle' : 'fas fa-times-circle';
                }
                
                // Update validation result display
                validationResult.style.display = 'flex';
                validationMessage.textContent = result.message;
                
                if (result.isValid) {
                    validationResult.classList.add('valid');
                    validationResult.classList.remove('invalid');
                } else {
                    validationResult.classList.add('invalid');
                    validationResult.classList.remove('valid');
                }
                
                // Update validation details
                const validationDetails = document.getElementById('validation-details');
                if (validationDetails) {
                    validationDetails.style.display = 'block';
                    
                    // Get or create detail elements
                    const detailElements = {
                        country: validationDetails.querySelector('#iban-country'),
                        length: validationDetails.querySelector('#iban-length'),
                        format: validationDetails.querySelector('#iban-format'),
                        checkDigits: validationDetails.querySelector('#iban-check-digits')
                    };
                    
                    // Update details
                    if (detailElements.country) detailElements.country.textContent = result.details.country;
                    if (detailElements.length) detailElements.length.textContent = result.details.length;
                    if (detailElements.format) detailElements.format.textContent = result.details.format;
                    if (detailElements.checkDigits) detailElements.checkDigits.textContent = result.details.checkDigits;
                }
                
                showNotification('IBAN validation complete', result.isValid ? 'success' : 'error');
            } catch (error) {
                console.error('IBAN validation error:', error);
                showNotification('Error validating IBAN: ' + error.message, 'error');
            }
        }
        
        // Add event listener for IBAN validation
        validateIbanBtn.addEventListener('click', () => {
            console.log("Validate IBAN button clicked!");
            handleIBANValidation();
        });
        
        // Validate IBAN on Enter key in input field
        ibanToValidate.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleIBANValidation();
            }
        });
        
        // Link between generator and validator (if they exist)
        const validateGeneratedLink = getElement('validate-generated-link');
        const generateNewLink = getElement('generate-new-link');
        const ibanResult = getElement('iban-result');
        const generatorTab = getElement('generator-tab');
        const validatorTab = getElement('validator-tab');
        
        if (validateGeneratedLink && ibanResult) {
            validateGeneratedLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get the generated IBAN
                const generatedIban = ibanResult.textContent.trim();
                if (!generatedIban || generatedIban === 'Click the button to generate an IBAN') {
                    showNotification('Please generate an IBAN first', 'error');
                    return;
                }
                
                // Switch to validator tab
                if (validatorTab) validatorTab.click();
                
                // Set the IBAN in the validator input
                ibanToValidate.value = generatedIban;
                
                // Validate the IBAN
                setTimeout(handleIBANValidation, 100);
            });
        }
        
        // Link from validator to generator
        if (generateNewLink && generatorTab) {
            generateNewLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Switch to generator tab
                generatorTab.click();
            });
        }
        
        console.log("IBAN validator initialization complete");
    }
    
    // Debug function to test an IBAN validation
    // Comment out after use
    function testIbanValidation() {
        const testIban = "DE37071853LT8028S97606";
        console.log("Testing IBAN validation for:", testIban);
        
        // Remove spaces and convert to uppercase
        const iban = testIban.replace(/\s/g, '').toUpperCase();
        
        // Basic format check: length and country code
        if (iban.length < 5) {
            console.log("Error: IBAN is too short");
            return;
        }
        
        const countryCode = iban.substring(0, 2);
        const structure = ibanStructure[countryCode];
        
        // Check if country code is valid
        if (!structure) {
            console.log("Error: Invalid country code");
            return;
        }
        
        console.log("Country:", countryNames[countryCode]);
        console.log("Expected length:", structure.length, "Actual length:", iban.length);
        console.log("Expected format:", structure.format);
        console.log("Expected BBAN format:", structure.bban);
        
        // Check length
        if (iban.length !== structure.length) {
            console.log("Error: IBAN length incorrect");
        }
        
        // Character validation (only A-Z, 0-9 allowed)
        if (!/^[A-Z0-9]+$/.test(iban)) {
            console.log("Error: IBAN contains invalid characters");
        }
        
        // Check format compliance
        // For DE, should be only digits in BBAN
        const bban = iban.substring(4);
        if (countryCode === 'DE' && !/^\d+$/.test(bban)) {
            console.log("Error: BBAN should only contain digits for Germany");
            console.log("BBAN part:", bban);
            console.log("Contains non-digits:", bban.match(/[^\d]/g));
        }
        
        // Check digits validation (MOD 97-10)
        const checkDigits = iban.substring(2, 4);
        console.log("Check digits:", checkDigits);
        
        // Rearrange and convert to numeric
        let rearranged = iban.substring(4) + iban.substring(0, 4);
        let numerical = '';
        
        for (let i = 0; i < rearranged.length; i++) {
            let char = rearranged.charAt(i);
            let code = char.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                numerical += (code - 55); // A=10, B=11, ...
            } else {
                numerical += char;
            }
        }
        
        // Calculate mod 97
        let remainder = 0;
        for (let i = 0; i < numerical.length; i++) {
            remainder = (remainder * 10 + parseInt(numerical.charAt(i))) % 97;
        }
        
        console.log("MOD 97 result:", remainder, "Should be 1 for valid IBAN");
        console.log("IBAN is", remainder === 1 ? "VALID" : "INVALID");
    }
    
    // Run the test when page loads
    testIbanValidation();
});