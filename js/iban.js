document.addEventListener('DOMContentLoaded', () => {
    console.log("IBAN tools initialized");
    
    // Get elements
    const countryGrid = document.getElementById('country-grid');
    const countryButtons = document.querySelectorAll('.country-button');
    const countrySelectionPrompt = document.getElementById('country-selection-prompt');
    const formatInfo = document.getElementById('format-info');
    const formatText = document.getElementById('format-text');
    const bankCode = document.getElementById('bank-code');
    const bankCodeHelp = document.getElementById('bank-code-help');
    const accountNumber = document.getElementById('account-number');
    const accountNumberHelp = document.getElementById('account-number-help');
    const generateBtn = document.getElementById('generate-iban-btn');
    const copyBtn = document.getElementById('copy-iban-btn');
    const ibanResult = document.getElementById('iban-result');
    
    const ibanToValidate = document.getElementById('iban-to-validate');
    const validateIbanBtn = document.getElementById('validate-iban-btn');
    const validationResult = document.getElementById('validation-result');
    const validationDetails = document.getElementById('validation-details');
    const validationStatus = document.getElementById('validation-status');
    const validationIcon = document.getElementById('validation-icon');
    
    const copyNotification = document.getElementById('copy-notification');
    
    // Current selected country code
    let currentCountry = 'DE'; // Default to Germany
    
    // Define IBAN structure for each country
    const ibanStructure = {
        'AT': { 
            length: 20, 
            format: 'AT00 0000 0000 0000 0000', 
            bban: '16n',
            bankCodeLength: 5,
            accountNumberLength: 11,
            bankCodeFormat: 'Numeric (5 digits)',
            accountNumberFormat: 'Numeric (11 digits)'
        },
        'BE': { 
            length: 16, 
            format: 'BE00 0000 0000 0000', 
            bban: '12n',
            bankCodeLength: 3,
            accountNumberLength: 9,
            bankCodeFormat: 'Numeric (3 digits)',
            accountNumberFormat: 'Numeric (9 digits)'
        },
        'CH': { 
            length: 21, 
            format: 'CH00 0000 0000 0000 0000 0', 
            bban: '5n,12c',
            bankCodeLength: 5,
            accountNumberLength: 12,
            bankCodeFormat: 'Numeric (5 digits)',
            accountNumberFormat: 'Alphanumeric (12 characters)'
        },
        'DE': { 
            length: 22, 
            format: 'DE00 0000 0000 0000 0000 00', 
            bban: '18n',
            bankCodeLength: 8,
            accountNumberLength: 10,
            bankCodeFormat: 'Numeric (8 digits)',
            accountNumberFormat: 'Numeric (10 digits)'
        },
        'DK': { 
            length: 18, 
            format: 'DK00 0000 0000 0000 00', 
            bban: '14n',
            bankCodeLength: 4,
            accountNumberLength: 10,
            bankCodeFormat: 'Numeric (4 digits)',
            accountNumberFormat: 'Numeric (10 digits)'
        },
        'ES': { 
            length: 24, 
            format: 'ES00 0000 0000 0000 0000 0000', 
            bban: '20n',
            bankCodeLength: 8,
            accountNumberLength: 12,
            bankCodeFormat: 'Numeric (8 digits)',
            accountNumberFormat: 'Numeric (12 digits)'
        },
        'FI': { 
            length: 18, 
            format: 'FI00 0000 0000 0000 00', 
            bban: '14n',
            bankCodeLength: 6,
            accountNumberLength: 8,
            bankCodeFormat: 'Numeric (6 digits)',
            accountNumberFormat: 'Numeric (8 digits)'
        },
        'FR': { 
            length: 27, 
            format: 'FR00 0000 0000 0000 0000 0000 000', 
            bban: '10n,11c,2n',
            bankCodeLength: 10,
            accountNumberLength: 13,
            bankCodeFormat: 'Numeric (10 digits)',
            accountNumberFormat: 'Alphanumeric (13 characters)'
        },
        'GB': { 
            length: 22, 
            format: 'GB00 AAAA 0000 0000 0000 00', 
            bban: '4a,14n',
            bankCodeLength: 4,
            accountNumberLength: 14,
            bankCodeFormat: 'Alphabetic (4 letters)',
            accountNumberFormat: 'Numeric (14 digits)'
        },
        'IE': { 
            length: 22, 
            format: 'IE00 AAAA 0000 0000 0000 00', 
            bban: '4a,14n',
            bankCodeLength: 4,
            accountNumberLength: 14,
            bankCodeFormat: 'Alphabetic (4 letters)',
            accountNumberFormat: 'Numeric (14 digits)'
        },
        'IT': { 
            length: 27, 
            format: 'IT00 A000 0000 0000 0000 0000 000', 
            bban: '1a,10n,12c',
            bankCodeLength: 11,
            accountNumberLength: 12,
            bankCodeFormat: 'Alphanumeric (11 characters)',
            accountNumberFormat: 'Alphanumeric (12 characters)'
        },
        'NL': { 
            length: 18, 
            format: 'NL00 AAAA 0000 0000 00', 
            bban: '4a,10n',
            bankCodeLength: 4,
            accountNumberLength: 10,
            bankCodeFormat: 'Alphabetic (4 letters)',
            accountNumberFormat: 'Numeric (10 digits)'
        },
        'PL': { 
            length: 28, 
            format: 'PL00 0000 0000 0000 0000 0000 0000', 
            bban: '24n',
            bankCodeLength: 8,
            accountNumberLength: 16,
            bankCodeFormat: 'Numeric (8 digits)',
            accountNumberFormat: 'Numeric (16 digits)'
        },
        'PT': { 
            length: 25, 
            format: 'PT00 0000 0000 0000 0000 0000 0', 
            bban: '21n',
            bankCodeLength: 8,
            accountNumberLength: 13,
            bankCodeFormat: 'Numeric (8 digits)',
            accountNumberFormat: 'Numeric (13 digits)'
        },
        'SE': { 
            length: 24, 
            format: 'SE00 0000 0000 0000 0000 0000', 
            bban: '20n',
            bankCodeLength: 3,
            accountNumberLength: 17,
            bankCodeFormat: 'Numeric (3 digits)',
            accountNumberFormat: 'Numeric (17 digits)'
        }
    };
    
    // Function to update the format info
    function updateFormatInfo(countryCode) {
        const structure = ibanStructure[countryCode];
        if (structure) {
            const countryName = getCountryName(countryCode);
            formatText.textContent = `${countryName} IBAN format: ${structure.format} (${structure.length} characters)`;
        }
    }
    
    // Function to get country name from code
    function getCountryName(code) {
        // Find the country button with this code
        const button = Array.from(countryButtons).find(btn => btn.dataset.country === code);
        return button ? button.textContent.replace(code, '').trim() : code;
    }
    
    // Function to generate a random BBAN based on structure
    function generateBBAN(structure) {
        let bban = '';
        const parts = structure.split(',');
        
        for (const part of parts) {
            const length = parseInt(part);
            const type = part.slice(String(length).length);
            
            if (type === 'n') {
                // Numeric
                if (bankCode.value && accountNumber.value) {
                    // Use provided bank code and account number
                    let combined = bankCode.value + accountNumber.value;
                    combined = combined.padEnd(length, '0');
                    bban += combined.slice(0, length);
                } else {
                    // Generate random numbers
                    for (let i = 0; i < length; i++) {
                        bban += Math.floor(Math.random() * 10);
                    }
                }
            } else if (type === 'a') {
                // A-Z uppercase letters
                for (let i = 0; i < length; i++) {
                    bban += String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            } else if (type === 'c') {
                // Alphanumeric
                const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (let i = 0; i < length; i++) {
                    bban += chars.charAt(Math.floor(Math.random() * chars.length));
                }
            }
        }
        
        return bban;
    }
    
    // Function to generate an IBAN
    function generateIBAN(countryCode) {
        const structure = ibanStructure[countryCode];
        if (!structure) {
            throw new Error(`Country code ${countryCode} is not supported.`);
        }
        
        // Generate BBAN (Basic Bank Account Number)
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
        // Validate inputs first
        if (!currentCountry) {
            countrySelectionPrompt.classList.remove('hidden');
            countrySelectionPrompt.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        // Validate inputs (if provided)
        const inputsValid = validateInput();
        
        if (!inputsValid) {
            showNotification('Please correct the input fields or leave them empty for random generation.', 'error');
            return;
        }
        
        try {
            const iban = generateIBAN(currentCountry);
            
            // Display formatted IBAN
            ibanResult.textContent = formatIBAN(iban);
            ibanResult.dataset.rawIban = iban; // Store raw IBAN for copying
            
            // Show success notification
            showNotification('IBAN generated successfully!', 'success');
            
            // Enable copy button
            copyBtn.disabled = false;
            
            // Auto-scroll to the result
            ibanResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('IBAN generation error:', error);
            ibanResult.textContent = `Error: ${error.message}`;
            showNotification('Failed to generate IBAN!', 'error');
        }
    }
    
    // Function to validate an IBAN
    function validateIBAN(iban) {
        // Remove spaces and convert to uppercase
        iban = iban.replace(/\s/g, '').toUpperCase();
        
        // Basic format check
        if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(iban)) {
            return { 
                valid: false, 
                error: 'IBAN has invalid format. It should start with 2 letters followed by 2 digits and alphanumeric characters.' 
            };
        }
        
        // Check country code
        const countryCode = iban.substring(0, 2);
        if (!ibanStructure[countryCode]) {
            return { 
                valid: false, 
                error: `Country code ${countryCode} is not supported or invalid.` 
            };
        }
        
        // Check length
        if (iban.length !== ibanStructure[countryCode].length) {
            return { 
                valid: false, 
                error: `IBAN length is incorrect. Expected ${ibanStructure[countryCode].length} characters for ${countryCode}.` 
            };
        }
        
        // Check digits calculation (mod 97)
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
        
        // Calculate mod 97
        let remainder = 0;
        for (let i = 0; i < numerical.length; i++) {
            remainder = (remainder * 10 + parseInt(numerical.charAt(i))) % 97;
        }
        
        // Valid IBAN should have remainder = 1
        if (remainder !== 1) {
            return { 
                valid: false, 
                error: 'IBAN check digits are incorrect. The IBAN is invalid.' 
            };
        }
        
        // Extract parts for display
        const checkDigits = iban.substring(2, 4);
        const bban = iban.substring(4);
        
        // IBAN is valid
        return {
            valid: true,
            countryCode: countryCode,
            checkDigits: checkDigits,
            bban: bban,
            format: ibanStructure[countryCode].format
        };
    }
    
    // Handle IBAN validation
    function handleIBANValidation() {
        const iban = ibanToValidate.value.replace(/\s/g, '');
        
        if (!iban) {
            validationResult.classList.add('hidden');
            return;
        }
        
        // Show validation is in progress
        validationResult.classList.remove('hidden');
        validationIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        validationStatus.textContent = 'Validating...';
        validationDetails.innerHTML = '';
        
        // Validate the IBAN
        const result = validateIBAN(iban);
        
        // Add a small delay to show the validation is happening
        setTimeout(() => {
            if (result.valid) {
                // Valid IBAN
                validationIcon.innerHTML = '<i class="fas fa-check-circle success"></i>';
                validationStatus.textContent = 'Valid IBAN';
                validationStatus.className = 'success';
                
                // Build details
                let detailsHTML = `
                    <div class="validation-detail">
                        <span class="detail-label">Country:</span>
                        <span class="detail-value">${result.countryCode}</span>
                    </div>
                    <div class="validation-detail">
                        <span class="detail-label">Check Digits:</span>
                        <span class="detail-value">${result.checkDigits}</span>
                    </div>
                    <div class="validation-detail">
                        <span class="detail-label">BBAN:</span>
                        <span class="detail-value">${result.bban}</span>
                    </div>
                    <div class="validation-detail">
                        <span class="detail-label">Format:</span>
                        <span class="detail-value">${result.format}</span>
                    </div>
                `;
                
                validationDetails.innerHTML = detailsHTML;
            } else {
                // Invalid IBAN
                validationIcon.innerHTML = '<i class="fas fa-times-circle error"></i>';
                validationStatus.textContent = 'Invalid IBAN';
                validationStatus.className = 'error';
                
                // Display error
                validationDetails.innerHTML = `
                    <div class="validation-detail error">
                        <span class="detail-label">Error:</span>
                        <span class="detail-value">${result.error}</span>
                    </div>
                `;
            }
        }, 500);
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
    
    // Function to sync country selection
    function selectCountry(countryCode) {
        // Update current country
        currentCountry = countryCode;
        
        // Update grid
        countryButtons.forEach(btn => {
            if (btn.dataset.country === countryCode) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
        
        // Update format info
        updateFormatInfo(countryCode);
        
        // Update input placeholders and help text
        const structure = ibanStructure[countryCode];
        if (structure) {
            bankCode.placeholder = `Bank code (${structure.bankCodeLength} ${structure.bankCodeLength === 1 ? 'char' : 'chars'})`;
            accountNumber.placeholder = `Account number (${structure.accountNumberLength} ${structure.accountNumberLength === 1 ? 'char' : 'chars'})`;
            
            bankCodeHelp.textContent = `${structure.bankCodeFormat} - Optional for ${getCountryName(countryCode)}`;
            accountNumberHelp.textContent = `${structure.accountNumberFormat} - Optional for ${getCountryName(countryCode)}`;
        }
        
        // Update selection prompt
        updateSelectionPrompt();
        
        // Scroll to bank code input
        setTimeout(() => {
            bankCode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // Function to update the selection prompt visibility
    function updateSelectionPrompt() {
        if (currentCountry) {
            countrySelectionPrompt.classList.add('hidden');
        } else {
            countrySelectionPrompt.classList.remove('hidden');
        }
    }
    
    // Add event listeners
    
    // Country grid buttons
    countryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const countryCode = btn.dataset.country;
            selectCountry(countryCode);
        });
    });
    
    // IBAN generation
    generateBtn.addEventListener('click', handleIBANGeneration);
    
    // IBAN validation
    validateIbanBtn.addEventListener('click', handleIBANValidation);
    
    // Copy button functionality
    copyBtn.addEventListener('click', () => {
        const rawIban = ibanResult.dataset.rawIban || ibanResult.textContent.replace(/\s/g, '');
        
        if (rawIban && rawIban !== "Generated IBAN will appear here") {
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
    
    // Auto-validate generated IBAN
    generateBtn.addEventListener('click', function() {
        setTimeout(() => {
            const rawIban = ibanResult.dataset.rawIban;
            if (rawIban && rawIban !== "Generated IBAN will appear here") {
                ibanToValidate.value = rawIban;
                handleIBANValidation();
            }
        }, 500); // Small delay to allow IBAN generation to complete
    });
    
    // Handle Enter key in IBAN validation input
    ibanToValidate.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleIBANValidation();
        }
    });
    
    // Input validation events
    bankCode.addEventListener('input', validateInput);
    accountNumber.addEventListener('input', validateInput);
    
    // Initial setup
    updateFormatInfo('DE'); // Initialize with Germany
    updateSelectionPrompt(); // Initialize selection prompt
    
    // Set initial input placeholders and help text
    const initialStructure = ibanStructure['DE'];
    bankCode.placeholder = `Bank code (${initialStructure.bankCodeLength} chars)`;
    accountNumber.placeholder = `Account number (${initialStructure.accountNumberLength} chars)`;
    bankCodeHelp.textContent = `${initialStructure.bankCodeFormat} - Optional for Germany`;
    accountNumberHelp.textContent = `${initialStructure.accountNumberFormat} - Optional for Germany`;
    
    // Function to validate input based on current country
    function validateInput() {
        const structure = ibanStructure[currentCountry];
        if (!structure) return false;
        
        // Validate bank code (only if not empty)
        const bankCodeValue = bankCode.value.trim();
        const bankCodeValid = bankCodeValue === '' || validateField(bankCodeValue, structure.bankCodeFormat);
        
        // Validate account number (only if not empty)
        const accountNumberValue = accountNumber.value.trim();
        const accountNumberValid = accountNumberValue === '' || validateField(accountNumberValue, structure.accountNumberFormat);
        
        // Visual feedback
        if (bankCodeValid) {
            bankCode.classList.remove('error-input');
            bankCodeHelp.classList.remove('error-text');
        } else {
            bankCode.classList.add('error-input');
            bankCodeHelp.classList.add('error-text');
        }
        
        if (accountNumberValid) {
            accountNumber.classList.remove('error-input');
            accountNumberHelp.classList.remove('error-text');
        } else {
            accountNumber.classList.add('error-input');
            accountNumberHelp.classList.add('error-text');
        }
        
        return bankCodeValid && accountNumberValid;
    }
    
    // Helper function to validate a field based on format
    function validateField(value, format) {
        if (!value) return true; // Empty is valid since fields are optional
        
        if (format.includes('Numeric')) {
            return /^\d+$/.test(value);
        } else if (format.includes('Alphabetic')) {
            return /^[A-Z]+$/.test(value.toUpperCase());
        } else if (format.includes('Alphanumeric')) {
            return /^[A-Z0-9]+$/i.test(value);
        }
        
        return true;
    }
    
    // Add input validation on keyup
    bankCode.addEventListener('keyup', validateInput);
    accountNumber.addEventListener('keyup', validateInput);
    
    // Validate on generate button click
    generateBtn.addEventListener('click', () => {
        setTimeout(validateInput, 100);
    });
    
    // Validate on country change
    countryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(validateInput, 100);
        });
    });
});
