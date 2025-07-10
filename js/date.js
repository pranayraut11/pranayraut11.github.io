document.addEventListener('DOMContentLoaded', () => {
    console.log("Date converter initialized");
    
    // Get elements
    const inputDate = document.getElementById('input-date');
    const inputFormat = document.getElementById('input-format');
    const outputFormat = document.getElementById('output-format');
    const convertDateBtn = document.getElementById('convert-date-btn');
    const dateResult = document.getElementById('date-result');
    const copyDateBtn = document.getElementById('copy-date-btn');
    const quickDateBtns = document.querySelectorAll('.quick-date-btn');
    const copyNotification = document.getElementById('copy-notification');
    
    // Function to get format string based on selected format
    function getFormatString(format) {
        switch (format) {
            case 'YYYY-MM-DD':
                return 'yyyy-MM-dd';
            case 'MM/DD/YYYY':
                return 'MM/dd/yyyy';
            case 'DD/MM/YYYY':
                return 'dd/MM/yyyy';
            case 'YYYY/MM/DD':
                return 'yyyy/MM/dd';
            case 'DD-MMM-YYYY':
                return 'dd-MMM-yyyy';
            case 'MMMM D, YYYY':
                return 'MMMM d, yyyy';
            case 'ddd, DD MMM YYYY':
                return 'EEE, dd MMM yyyy';
            default:
                return 'yyyy-MM-dd';
        }
    }
    
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
                    
                    try {
                        result = dateFns.format(date, formatString);
                    } catch (e) {
                        console.error("Error formatting date:", e);
                        // Fallback to a simpler formatting
                        if (outFormat === 'DD-MMM-YYYY') {
                            // Custom fallback for DD-MMM-YYYY format
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            result = `${date.getDate().toString().padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
                        } else if (outFormat === 'ddd, DD MMM YYYY') {
                            // Custom fallback for ddd, DD MMM YYYY format
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                            result = `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
                        } else {
                            result = date.toLocaleDateString();
                        }
                    }
                }
            } else {
                // Fallback if date-fns is not available
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
            
            // Enable copy button
            copyDateBtn.disabled = false;
        } catch (error) {
            console.error('Date conversion error:', error);
            dateResult.textContent = `Error: ${error.message}`;
        }
    }
    
    // Function to copy date
    function copyDate() {
        const content = dateResult.textContent;
        
        if (content && content !== 'Converted date will appear here' && content !== 'Please enter a date') {
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
    
    // Function to handle quick date button clicks
    function handleQuickDate(value) {
        let date = new Date();
        
        switch (value) {
            case 'now':
                // Current date and time (already set above)
                break;
            case 'tomorrow':
                date.setDate(date.getDate() + 1);
                break;
            case 'yesterday':
                date.setDate(date.getDate() - 1);
                break;
            case 'next-week':
                date.setDate(date.getDate() + 7);
                break;
            case 'last-month':
                date.setMonth(date.getMonth() - 1);
                break;
            default:
                break;
        }
        
        // Format the date according to the input format
        const inFormat = inputFormat.value;
        let formattedDate;
        
        if (typeof dateFns !== 'undefined') {
            if (inFormat === 'unix') {
                formattedDate = Math.floor(date.getTime() / 1000).toString();
            } else {
                const formatString = getFormatString(inFormat);
                try {
                    formattedDate = dateFns.format(date, formatString);
                } catch (e) {
                    formattedDate = date.toISOString().split('T')[0]; // Fallback to YYYY-MM-DD
                }
            }
        } else {
            if (inFormat === 'unix') {
                formattedDate = Math.floor(date.getTime() / 1000).toString();
            } else {
                formattedDate = date.toISOString().split('T')[0]; // Fallback to YYYY-MM-DD
            }
        }
        
        // Set the input date
        inputDate.value = formattedDate;
        
        // Trigger conversion
        convertDate();
    }
    
    // Add event listeners
    
    // Convert button
    convertDateBtn.addEventListener('click', convertDate);
    
    // Copy button
    copyDateBtn.addEventListener('click', copyDate);
    
    // Quick date buttons
    quickDateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleQuickDate(btn.dataset.value);
        });
    });
    
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
    
    // Handle Enter key in input
    inputDate.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            convertDate();
        }
    });
    
    // Initialize with current date
    handleQuickDate('now');
});
