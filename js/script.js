document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle elements
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
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
    const validationMessage = validationResult.querySelector('.validation-message');
    const ibanCountryDetail = document.getElementById('iban-country');
    const ibanLengthDetail = document.getElementById('iban-length');
    const ibanFormatDetail = document.getElementById('iban-format');
    const ibanCheckDigitsDetail = document.getElementById('iban-check-digits');
    
    // JSON FORMATTER FUNCTIONS
    
    // Get JSON formatter elements
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const formatJsonBtn = document.getElementById('format-json-btn');
    const minifyJsonBtn = document.getElementById('minify-json-btn');
    const clearJsonBtn = document.getElementById('clear-json-btn');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const indentWithTabs = document.getElementById('indent-with-tabs');
    const indentSpaces = document.getElementById('indent-spaces');
    
    // Get sample JSON button
    const sampleJsonBtn = document.getElementById('sample-json-btn');
    
    console.log('JSON formatter elements:');
    console.log('jsonInput:', jsonInput);
    console.log('jsonOutput:', jsonOutput);
    console.log('formatJsonBtn:', formatJsonBtn);
    console.log('minifyJsonBtn:', minifyJsonBtn);
    console.log('clearJsonBtn:', clearJsonBtn);
    console.log('copyJsonBtn:', copyJsonBtn);
    console.log('indentWithTabs:', indentWithTabs);
    console.log('indentSpaces:', indentSpaces);
    console.log('sampleJsonBtn:', sampleJsonBtn);
    
    // Function to syntax highlight JSON
    function syntaxHighlightJson(json) {
        if (!json) return '';
        
        // Replace JSON syntax with HTML spans for styling
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                    // Remove the colon for the key
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
    
    // Initialize theme
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
    
    // Tab functionality
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
    
    generateNewLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchToTab('generator');
        generateBtn.click(); // Automatically generate a new IBAN
    });
    
    // Country names by country code
    const countryNames = {
        'AT': 'Austria',
        'BE': 'Belgium',
        'BG': 'Bulgaria',
        'CH': 'Switzerland',
        'CZ': 'Czech Republic',
        'DE': 'Germany',
        'DK': 'Denmark',
        'ES': 'Spain',
        'FI': 'Finland',
        'FR': 'France',
        'GB': 'United Kingdom',
        'GR': 'Greece',
        'HR': 'Croatia',
        'HU': 'Hungary',
        'IE': 'Ireland',
        'IT': 'Italy',
        'LT': 'Lithuania',
        'LU': 'Luxembourg',
        'LV': 'Latvia',
        'MT': 'Malta',
        'NL': 'Netherlands',
        'PL': 'Poland',
        'PT': 'Portugal',
        'RO': 'Romania',
        'SE': 'Sweden',
        'SI': 'Slovenia',
        'SK': 'Slovakia',
    };
    
    // IBAN structure details by country code
    const ibanStructure = {
        'AT': { length: 20, bban: 16 }, // Austria
        'BE': { length: 16, bban: 12 }, // Belgium
        'BG': { length: 22, bban: 18 }, // Bulgaria
        'CH': { length: 21, bban: 17 }, // Switzerland
        'CZ': { length: 24, bban: 20 }, // Czech Republic
        'DE': { length: 22, bban: 18 }, // Germany
        'DK': { length: 18, bban: 14 }, // Denmark
        'ES': { length: 24, bban: 20 }, // Spain
        'FI': { length: 18, bban: 14 }, // Finland
        'FR': { length: 27, bban: 23 }, // France
        'GB': { length: 22, bban: 18 }, // United Kingdom
        'GR': { length: 27, bban: 23 }, // Greece
        'HR': { length: 21, bban: 17 }, // Croatia
        'HU': { length: 28, bban: 24 }, // Hungary
        'IE': { length: 22, bban: 18 }, // Ireland
        'IT': { length: 27, bban: 23 }, // Italy
        'LT': { length: 20, bban: 16 }, // Lithuania
        'LU': { length: 20, bban: 16 }, // Luxembourg
        'LV': { length: 21, bban: 17 }, // Latvia
        'MT': { length: 31, bban: 27 }, // Malta
        'NL': { length: 18, bban: 14 }, // Netherlands
        'PL': { length: 28, bban: 24 }, // Poland
        'PT': { length: 25, bban: 21 }, // Portugal
        'RO': { length: 24, bban: 20 }, // Romania
        'SE': { length: 24, bban: 20 }, // Sweden
        'SI': { length: 19, bban: 15 }, // Slovenia
        'SK': { length: 24, bban: 20 }, // Slovakia
    };
    
    // Generate a random IBAN
    function generateRandomIBAN(countryCode) {
        // Get the structure for the selected country
        const structure = ibanStructure[countryCode];
        if (!structure) {
            return 'Invalid country code';
        }
        
        // Generate random BBAN (Basic Bank Account Number)
        const bbanChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let bban = '';
        for (let i = 0; i < structure.bban; i++) {
            bban += bbanChars.charAt(Math.floor(Math.random() * bbanChars.length));
        }
        
        // Initial IBAN without check digits
        let iban = countryCode + '00' + bban;
        
        // Calculate check digits (ISO 7064 MOD 97-10)
        // Move the first four characters to the end
        let rearranged = iban.substring(4) + iban.substring(0, 4);
        
        // Convert letters to numbers (A=10, B=11, ..., Z=35)
        let numeric = '';
        for (let i = 0; i < rearranged.length; i++) {
            let char = rearranged.charAt(i);
            if (/[A-Z]/.test(char)) {
                numeric += (char.charCodeAt(0) - 55);
            } else {
                numeric += char;
            }
        }
        
        // Calculate mod 97 and subtract from 98
        let remainder = 0;
        for (let i = 0; i < numeric.length; i++) {
            remainder = (remainder * 10 + parseInt(numeric.charAt(i))) % 97;
        }
        
        let checkDigits = (98 - remainder).toString().padStart(2, '0');
        
        // Final IBAN with correct check digits
        return countryCode + checkDigits + bban;
    }
    
    // Format IBAN with spaces for better readability
    function formatIBAN(iban) {
        return iban.replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Generate IBAN when button is clicked
    generateBtn.addEventListener('click', () => {
        const countryCode = countrySelect.value;
        const rawIban = generateRandomIBAN(countryCode);
        
        // Animated display of IBAN
        ibanResult.textContent = "Generating...";
        ibanResult.style.opacity = "0.5";
        
        setTimeout(() => {
            const formattedIban = formatIBAN(rawIban);
            ibanResult.textContent = formattedIban;
            ibanResult.dataset.rawIban = rawIban; // Store unformatted IBAN for copying
            ibanResult.style.opacity = "1";
            
            // Add a highlight effect
            ibanResult.style.animation = 'none';
            setTimeout(() => {
                ibanResult.style.animation = 'fadeIn 0.5s ease-out';
            }, 10);
        }, 300);
    });
    
    // Copy IBAN to clipboard
    copyBtn.addEventListener('click', () => {
        const ibanToCopy = ibanResult.dataset.rawIban || ibanResult.textContent.replace(/\s/g, '');
        
        // Copy to clipboard
        navigator.clipboard.writeText(ibanToCopy)
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
    });
    
    // Generate an initial IBAN on page load
    generateBtn.click();
    
    // UUID GENERATOR FUNCTIONS
    
    // Generate a random UUID v4
    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Generate a time-based UUID v1
    function generateUUIDv1() {
        // Get current timestamp in milliseconds since epoch
        const now = new Date().getTime();
        
        // Create a timestamp part (first 8 chars are based on time)
        const timeLow = ((now & 0xffffffff) >>> 0).toString(16).padStart(8, '0');
        
        // Middle part (4 chars) - time mid
        const timeMid = ((now & 0xffff00000000) >>> 32).toString(16).padStart(4, '0');
        
        // Time high and version (4 chars) - first 12 bits time high + 4 bits version (0001 for v1)
        let timeHighAndVersion = ((now & 0xfff000000000000) >>> 48).toString(16).padStart(3, '0');
        timeHighAndVersion = timeHighAndVersion + '1'; // Add version 1
        
        // Generate clock sequence and node parts with randomness
        const clockSeqHiAndReserved = (Math.random() * 0x100 | 0x80).toString(16).padStart(2, '0');
        const clockSeqLow = (Math.random() * 0x100).toString(16).padStart(2, '0');
        
        // Node part (12 chars) - use random values
        const node = Array.from({length: 6}, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
        ).join('');
        
        // Combine all parts
        return `${timeLow}-${timeMid}-${timeHighAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`;
    }
    
    // Get selected UUID version
    function getSelectedUUIDVersion() {
        for (const radio of uuidVersionRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'v4'; // Default to v4
    }
    
    // Generate UUID based on selected version
    function generateUUID() {
        const version = getSelectedUUIDVersion();
        
        if (version === 'v1') {
            return generateUUIDv1();
        } else {
            return generateUUIDv4();
        }
    }
    
    // Generate UUID when button is clicked
    generateUuidBtn.addEventListener('click', () => {
        // Show loading animation
        uuidResult.textContent = "Generating...";
        uuidResult.style.opacity = "0.5";
        
        setTimeout(() => {
            const uuid = generateUUID();
            uuidResult.textContent = uuid;
            uuidResult.dataset.uuid = uuid; // Store UUID for copying
            uuidResult.style.opacity = "1";
            
            // Add a highlight effect
            uuidResult.style.animation = 'none';
            setTimeout(() => {
                uuidResult.style.animation = 'fadeIn 0.5s ease-out';
            }, 10);
        }, 300);
    });
    
    // Copy UUID to clipboard
    uuidCopyBtn.addEventListener('click', () => {
        const uuidToCopy = uuidResult.dataset.uuid || uuidResult.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(uuidToCopy)
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
    });
    
    // Generate an initial UUID on page load
    generateUuidBtn.click();
    
    // IBAN VALIDATOR FUNCTIONS
    
    // Function to validate IBAN
    function validateIBAN(iban) {
        // Remove spaces and convert to uppercase
        iban = iban.replace(/\s/g, '').toUpperCase();
        
        // Check if IBAN is empty
        if (iban.length === 0) {
            return {
                isValid: false,
                message: 'Please enter an IBAN',
                details: {
                    country: '-',
                    length: '-',
                    format: '-',
                    checkDigits: '-'
                }
            };
        }
        
        // Check if IBAN has at least 5 characters (2 country code + 2 check digits + at least 1 character)
        if (iban.length < 5) {
            return {
                isValid: false,
                message: 'IBAN is too short',
                details: {
                    country: iban.substring(0, 2),
                    length: iban.length.toString(),
                    format: 'Invalid',
                    checkDigits: iban.length >= 4 ? iban.substring(2, 4) : '-'
                }
            };
        }
        
        // Extract country code and check if it's valid
        const countryCode = iban.substring(0, 2);
        if (!/^[A-Z]{2}$/.test(countryCode)) {
            return {
                isValid: false,
                message: 'Invalid country code (must be 2 letters)',
                details: {
                    country: countryCode,
                    length: iban.length.toString(),
                    format: 'Invalid',
                    checkDigits: iban.substring(2, 4)
                }
            };
        }
        
        // Check if country code is supported
        if (!ibanStructure[countryCode]) {
            return {
                isValid: false,
                message: `Country code "${countryCode}" is not supported`,
                details: {
                    country: countryCode,
                    length: iban.length.toString(),
                    format: 'Unknown',
                    checkDigits: iban.substring(2, 4)
                }
            };
        }
        
        // Check IBAN length
        const expectedLength = ibanStructure[countryCode].length;
        if (iban.length !== expectedLength) {
            return {
                isValid: false,
                message: `Invalid length for ${countryCode} IBAN (should be ${expectedLength})`,
                details: {
                    country: countryNames[countryCode] || countryCode,
                    length: `${iban.length} (Expected: ${expectedLength})`,
                    format: 'Invalid length',
                    checkDigits: iban.substring(2, 4)
                }
            };
        }
        
        // Check if characters are valid (only letters and numbers)
        if (!/^[A-Z0-9]+$/.test(iban)) {
            return {
                isValid: false,
                message: 'IBAN contains invalid characters',
                details: {
                    country: countryNames[countryCode] || countryCode,
                    length: iban.length.toString(),
                    format: 'Invalid characters',
                    checkDigits: iban.substring(2, 4)
                }
            };
        }
        
        // Check digits validation (MOD 97-10)
        // Move the first four characters to the end
        const rearranged = iban.substring(4) + iban.substring(0, 4);
        
        // Convert letters to numbers (A=10, B=11, ..., Z=35)
        let numeric = '';
        for (let i = 0; i < rearranged.length; i++) {
            const char = rearranged.charAt(i);
            if (/[A-Z]/.test(char)) {
                numeric += (char.charCodeAt(0) - 55);
            } else {
                numeric += char;
            }
        }
        
        // Calculate mod 97
        let remainder = 0;
        for (let i = 0; i < numeric.length; i++) {
            remainder = (remainder * 10 + parseInt(numeric.charAt(i))) % 97;
        }
        
        // If remainder is 1, the IBAN is valid
        const isValidChecksum = remainder === 1;
        
        if (!isValidChecksum) {
            return {
                isValid: false,
                message: 'Invalid IBAN (check digits validation failed)',
                details: {
                    country: countryNames[countryCode] || countryCode,
                    length: `${iban.length} (Correct)`,
                    format: 'Valid format, invalid checksum',
                    checkDigits: iban.substring(2, 4) + ' (Invalid)'
                }
            };
        }
        
        return {
            isValid: true,
            message: 'Valid IBAN',
            details: {
                country: countryNames[countryCode] || countryCode,
                length: `${iban.length} (Correct)`,
                format: 'Valid',
                checkDigits: iban.substring(2, 4) + ' (Valid)'
            }
        };
    }
    
    // Function to display validation result
    function displayValidationResult(validationResult, result) {
        // Reset classes first
        validationResult.className = 'validation-result';
        
        // Clear any existing animation
        validationResult.style.animation = 'none';
        
        // Reset the validation icon
        const validationIcon = validationResult.querySelector('.validation-icon i');
        validationIcon.className = '';
        
        setTimeout(() => {
            if (result.isValid) {
                validationResult.classList.add('valid');
                validationIcon.className = 'fas fa-check-circle';
            } else {
                validationResult.classList.add('invalid');
                validationIcon.className = 'fas fa-exclamation-circle';
            }
            
            // Re-apply animation
            validationResult.style.animation = result.isValid ? 
                'validPulse 1s ease-out' : 
                'invalidPulse 1s ease-out';
                
        }, 10);
        
        validationMessage.textContent = result.message;
        
        // Update details with animation
        const details = [
            { element: ibanCountryDetail, value: result.details.country },
            { element: ibanLengthDetail, value: result.details.length },
            { element: ibanFormatDetail, value: result.details.format },
            { element: ibanCheckDigitsDetail, value: result.details.checkDigits }
        ];
        
        details.forEach((detail, index) => {
            // Add a small delay for each detail to create a cascade effect
            setTimeout(() => {
                detail.element.textContent = detail.value;
                detail.element.style.animation = 'none';
                setTimeout(() => {
                    detail.element.style.animation = 'fadeIn 0.3s ease-out';
                }, 10);
            }, index * 100);
        });
    }
    
    // Validate IBAN when button is clicked
    validateIbanBtn.addEventListener('click', () => {
        const iban = ibanToValidate.value.trim();
        const result = validateIBAN(iban);
        displayValidationResult(validationResult, result);
    });
    
    // Validate on Enter key
    ibanToValidate.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            validateIbanBtn.click();
        }
    });
    
    // Create particle effects for a more modern look
    function createParticleEffect() {
        const container = document.querySelector('.container');
        
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
    
    // Event listeners for JSON formatter
    console.log('Adding JSON formatter event listeners');
    formatJsonBtn.addEventListener('click', () => {
        console.log('Format JSON button clicked');
        formatJson();
    });
    minifyJsonBtn.addEventListener('click', () => {
        console.log('Minify JSON button clicked');
        minifyJson();
    });
    clearJsonBtn.addEventListener('click', () => {
        console.log('Clear JSON button clicked');
        clearJson();
    });
    copyJsonBtn.addEventListener('click', () => {
        console.log('Copy JSON button clicked');
        copyJson();
    });
    sampleJsonBtn.addEventListener('click', () => {
        console.log('Sample JSON button clicked');
        insertSampleJson();
    });
    
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
    
    // Function to check if all elements exist
    function checkElements() {
        console.log('Checking all elements at DOMContentLoaded');
        const elements = {
            'themeToggle': document.getElementById('theme-toggle'),
            'jsonInput': document.getElementById('json-input'),
            'jsonOutput': document.getElementById('json-output'),
            'formatJsonBtn': document.getElementById('format-json-btn'),
            'minifyJsonBtn': document.getElementById('minify-json-btn'),
            'clearJsonBtn': document.getElementById('clear-json-btn'),
            'copyJsonBtn': document.getElementById('copy-json-btn'),
            'indentWithTabs': document.getElementById('indent-with-tabs'),
            'indentSpaces': document.getElementById('indent-spaces'),
            'sampleJsonBtn': document.getElementById('sample-json-btn')
        };
        
        let allElementsExist = true;
        for (const [name, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element ${name} does not exist!`);
                allElementsExist = false;
            }
        }
        
        if (allElementsExist) {
            console.log('All elements exist.');
        } else {
            console.error('Some elements are missing!');
        }
        
        return allElementsExist;
    }
    
    // Call this function early
    checkElements();
});
