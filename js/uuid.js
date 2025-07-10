document.addEventListener('DOMContentLoaded', () => {
    console.log("UUID generator initialized");
    
    // Get elements
    const generateUuidBtn = document.getElementById('generate-uuid-btn');
    const uuidResult = document.getElementById('uuid-result');
    const copyUuidBtn = document.getElementById('copy-uuid-btn');
    const uuidVersionRadios = document.getElementsByName('uuid-version');
    const uuidFormatRadios = document.getElementsByName('uuid-format');
    const bulkGenerateBtn = document.getElementById('bulk-generate-btn');
    const bulkResultContainer = document.getElementById('bulk-result-container');
    const bulkResults = document.getElementById('bulk-results');
    const bulkCount = document.getElementById('bulk-count');
    const bulkCopyBtn = document.getElementById('bulk-copy-btn');
    
    const copyNotification = document.getElementById('copy-notification');
    
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
    
    // Function to format UUID according to selected format
    function formatUUID(uuid) {
        // Get selected format
        const selectedFormat = Array.from(uuidFormatRadios).find(radio => radio.checked).value;
        
        switch (selectedFormat) {
            case 'no-hyphens':
                return uuid.replace(/-/g, '');
            case 'braces':
                return `{${uuid}}`;
            case 'standard':
            default:
                return uuid;
        }
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
            
            // Format the UUID
            const formattedUuid = formatUUID(uuid);
            
            // Display UUID
            uuidResult.textContent = formattedUuid;
            
            // Store raw UUID for copying
            uuidResult.dataset.rawUuid = uuid;
            
            // Show success notification
            showNotification('UUID generated successfully!', 'success');
        } catch (error) {
            console.error('UUID generation error:', error);
            uuidResult.textContent = `Error: ${error.message}`;
            showNotification('Failed to generate UUID!', 'error');
        }
    }
    
    // Handle bulk UUID generation
    function handleBulkGeneration() {
        try {
            const count = parseInt(bulkCount.value) || 10;
            if (count < 1 || count > 100) {
                showNotification('Please enter a number between 1 and 100', 'error');
                return;
            }
            
            const selectedVersion = Array.from(uuidVersionRadios).find(radio => radio.checked).value;
            let uuids = [];
            
            for (let i = 0; i < count; i++) {
                let uuid;
                if (selectedVersion === 'v1') {
                    uuid = generateUUIDv1();
                } else {
                    uuid = generateUUIDv4();
                }
                
                const formattedUuid = formatUUID(uuid);
                uuids.push(formattedUuid);
            }
            
            // Display bulk UUIDs
            bulkResults.value = uuids.join('\n');
            bulkResultContainer.classList.remove('hidden');
            
            // Show success notification
            showNotification(`${count} UUIDs generated successfully!`, 'success');
        } catch (error) {
            console.error('Bulk UUID generation error:', error);
            showNotification('Failed to generate bulk UUIDs!', 'error');
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
    
    // Add event listeners
    
    // Generate UUID button
    generateUuidBtn.addEventListener('click', handleUUIDGeneration);
    
    // Generate initial UUID
    handleUUIDGeneration();
    
    // Format radios change
    uuidFormatRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // If we already have a UUID, reformat it
            if (uuidResult.dataset.rawUuid) {
                uuidResult.textContent = formatUUID(uuidResult.dataset.rawUuid);
            }
        });
    });
    
    // Bulk generate button
    bulkGenerateBtn.addEventListener('click', handleBulkGeneration);
    
    // Copy UUID functionality
    copyUuidBtn.addEventListener('click', () => {
        const uuid = uuidResult.textContent;
        
        if (uuid && uuid !== "Generated UUID will appear here") {
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
    
    // Copy bulk UUIDs functionality
    bulkCopyBtn.addEventListener('click', () => {
        const uuids = bulkResults.value;
        
        if (uuids) {
            navigator.clipboard.writeText(uuids)
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
                    alert('Failed to copy UUIDs to clipboard');
                });
        }
    });
});
