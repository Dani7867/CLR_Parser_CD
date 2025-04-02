document.addEventListener('DOMContentLoaded', function() {
    const parseBtn = document.getElementById('parse-btn');
    const clearBtn = document.getElementById('clear-btn');
    const grammarInput = document.getElementById('grammar-input');
    const stringInput = document.getElementById('string-input');
    const loading = document.getElementById('loading');
    const resultPanel = document.getElementById('result-panel');
    const resultStatus = document.querySelector('.result-status');
    
    // Set default grammar example
    grammarInput.value = 'S->CC\nC->cC\nC->d';
    stringInput.value = 'cdcd';
    
    // Create toast container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(toastContainer);
    
    // Function to show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
    
    // Parse button click handler
    parseBtn.addEventListener('click', function() {
        // Show loading with enhanced animation
        loading.classList.remove('d-none');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.opacity = '1';
        }, 10);
        
        // Get grammar and input string
        const grammar = grammarInput.value.trim().split('\n').filter(line => line.trim() !== '');
        const inputString = stringInput.value.trim();
        
        // Validate inputs
        if (grammar.length === 0 || inputString === '') {
            showToast('Please enter both grammar and input string', 'danger');
            loading.classList.add('d-none');
            return;
        }
        
        // Send request to API
        fetch('/parse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grammar: grammar,
                input_string: inputString
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.detail || 'Failed to parse input');
                });
            }
            return response.json();
        })
        .then(data => {
            // Hide loading with fade out
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.classList.add('d-none');
            }, 300);
            
            // Display result with animation
            resultPanel.style.opacity = '0';
            setTimeout(() => {
                displayResult(data);
                resultPanel.style.opacity = '1';
            }, 300);
            
            // Show toast notification
            showToast(
                `Input string "${inputString}" was ${data.is_accepted ? 'accepted' : 'rejected'}`,
                data.is_accepted ? 'success' : 'danger'
            );
        })
        .catch(error => {
            // Hide loading with fade out
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.classList.add('d-none');
            }, 300);
            
            // Show error toast
            showToast(error.message, 'danger');
        });
    });
    
    // Clear button click handler with animation
    clearBtn.addEventListener('click', function() {
        // Fade out inputs
        grammarInput.style.opacity = '0';
        stringInput.style.opacity = '0';
        
        setTimeout(() => {
            grammarInput.value = '';
            stringInput.value = '';
            clearResult();
            
            // Fade in inputs
            grammarInput.style.opacity = '1';
            stringInput.style.opacity = '1';
        }, 300);
        
        showToast('Inputs cleared successfully', 'success');
    });
    
    // Function to display parsing result with animations
    function displayResult(data) {
        // Set status with animation
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge bg-${data.is_accepted ? 'success' : 'danger'}`;
        statusBadge.textContent = data.is_accepted ? 'Accepted' : 'Rejected';
        statusBadge.style.opacity = '0';
        
        resultStatus.innerHTML = '';
        resultStatus.appendChild(statusBadge);
        
        setTimeout(() => {
            statusBadge.style.opacity = '1';
        }, 50);
        
        // Display non-terminals and terminals with staggered animation
        displaySymbols(data.non_terminals, data.terminals);
        
        // Display first/follow sets with animation
        displayFirstFollow(data.first_follow);
        
        // Display parsing table with animation
        displayParseTable(data.parse_table, data.terminals, data.non_terminals);
        
        // Display parsing steps with animation
        displayParsingSteps(data.parsing_steps);
        
        // Display conflicts with animation
        displayConflicts(data.conflicts);
    }
    
    // Function to display symbols with staggered animation
    function displaySymbols(nonTerminals, terminals) {
        const ntContainer = document.getElementById('non-terminals');
        const tContainer = document.getElementById('terminals');
        
        ntContainer.innerHTML = '';
        tContainer.innerHTML = '';
        
        nonTerminals.forEach((nt, index) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = 'symbol-badge';
                span.textContent = nt;
                span.style.opacity = '0';
                ntContainer.appendChild(span);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                }, 50);
            }, index * 100);
        });
        
        terminals.forEach((t, index) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.className = 'symbol-badge';
                span.textContent = t;
                span.style.opacity = '0';
                tContainer.appendChild(span);
                
                setTimeout(() => {
                    span.style.opacity = '1';
                }, 50);
            }, index * 100);
        });
    }
    
    // Function to display first/follow sets with animation
    function displayFirstFollow(firstFollow) {
        const container = document.getElementById('first-follow-sets');
        container.innerHTML = '';
        
        Object.entries(firstFollow).forEach(([symbol, sets], index) => {
            setTimeout(() => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'first-follow-item';
                itemDiv.style.opacity = '0';
                
                const header = document.createElement('h6');
                header.textContent = `Non-terminal: ${symbol}`;
                itemDiv.appendChild(header);
                
                const firstDiv = document.createElement('div');
                firstDiv.className = 'mb-2';
                firstDiv.innerHTML = '<strong>FIRST:</strong> ';
                
                sets.first.forEach(item => {
                    const span = document.createElement('span');
                    span.className = 'set-item';
                    span.textContent = item;
                    firstDiv.appendChild(span);
                });
                
                const followDiv = document.createElement('div');
                followDiv.innerHTML = '<strong>FOLLOW:</strong> ';
                
                sets.follow.forEach(item => {
                    const span = document.createElement('span');
                    span.className = 'set-item';
                    span.textContent = item;
                    followDiv.appendChild(span);
                });
                
                itemDiv.appendChild(firstDiv);
                itemDiv.appendChild(followDiv);
                container.appendChild(itemDiv);
                
                setTimeout(() => {
                    itemDiv.style.opacity = '1';
                }, 50);
            }, index * 150);
        });
    }
    
    // Function to display parsing table with animation
    function displayParseTable(parseTable, terminals, nonTerminals) {
        const table = document.getElementById('parsing-table');
        table.innerHTML = '';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Add state header
        const stateHeader = document.createElement('th');
        stateHeader.textContent = 'State';
        headerRow.appendChild(stateHeader);
        
        // Add terminals and non-terminals headers
        const symbols = [...nonTerminals, ...terminals];
        
        symbols.forEach(symbol => {
            const th = document.createElement('th');
            th.textContent = symbol;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        // For each state in the parse table
        Object.entries(parseTable).forEach(([state, actions], rowIndex) => {
            setTimeout(() => {
                const row = document.createElement('tr');
                row.style.opacity = '0';
                
                // Add state number
                const stateCell = document.createElement('td');
                stateCell.className = 'fw-bold text-center';
                stateCell.textContent = state;
                row.appendChild(stateCell);
                
                // Add actions for each symbol
                symbols.forEach(symbol => {
                    const cell = document.createElement('td');
                    cell.className = 'action-cell';
                    
                    if (actions[symbol]) {
                        const action = actions[symbol];
                        
                        if (typeof action === 'string') {
                            if (action === 'accept') {
                                cell.innerHTML = '<span class="accept-action">accept</span>';
                            } else if (!isNaN(action)) {
                                cell.innerHTML = `<span class="goto-action">${action}</span>`;
                            } else {
                                cell.textContent = action;
                            }
                        } else if (Array.isArray(action)) {
                            action.forEach((act, index) => {
                                if (act.startsWith('s')) {
                                    cell.innerHTML += `<span class="shift-action">${act}</span>`;
                                } else if (act.startsWith('r')) {
                                    cell.innerHTML += `<span class="reduce-action">${act}</span>`;
                                } else {
                                    cell.innerHTML += act;
                                }
                                
                                if (index < action.length - 1) {
                                    cell.innerHTML += ', ';
                                }
                            });
                        }
                    }
                    
                    row.appendChild(cell);
                });
                
                tbody.appendChild(row);
                
                setTimeout(() => {
                    row.style.opacity = '1';
                }, 50);
            }, rowIndex * 100);
        });
        
        table.appendChild(tbody);
    }
    
    // Function to display parsing steps with animation
    function displayParsingSteps(steps) {
        const tbody = document.querySelector('#steps-table tbody');
        tbody.innerHTML = '';
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                const row = document.createElement('tr');
                row.style.opacity = '0';
                
                const stepCell = document.createElement('td');
                stepCell.textContent = index + 1;
                row.appendChild(stepCell);
                
                const stackCell = document.createElement('td');
                stackCell.style.fontFamily = 'monospace';
                stackCell.textContent = step.stack;
                row.appendChild(stackCell);
                
                const inputCell = document.createElement('td');
                inputCell.style.fontFamily = 'monospace';
                inputCell.textContent = step.input;
                row.appendChild(inputCell);
                
                const actionCell = document.createElement('td');
                let actionClass = '';
                let actionText = step.action || '';
                
                if (actionText.startsWith('reduce(')) {
                    const match = actionText.match(/reduce\((.*?),(r\d+)\)/);
                    if (match && match[1] && match[2]) {
                        const production = match[1];
                        const ruleNumber = match[2];
                        const [left, right] = production.split('->');
                        actionText = `Reduce ${left} → ${right} (${ruleNumber})`;
                        actionClass = 'reduce';
                    }
                } else if (actionText.startsWith('shift(')) {
                    const match = actionText.match(/shift\((.*?)\)/);
                    if (match && match[1]) {
                        const stateNumber = match[1];
                        const prevInput = index > 0 ? steps[index - 1].input[0] : '';
                        actionText = `Shift ${prevInput} → s${stateNumber}`;
                        actionClass = 'shift';
                    }
                } else if (actionText === 'start') {
                    actionClass = '';
                    actionText = 'Start';
                } else if (actionText === 'accept') {
                    actionClass = 'accept';
                    actionText = 'Accept';
                } else if (actionText === 'reject' || actionText === 'error') {
                    actionClass = 'reject';
                    actionText = 'Reject';
                }
                
                if (actionClass) {
                    actionCell.innerHTML = `<span class="action-label ${actionClass}">${actionText}</span>`;
                } else {
                    actionCell.textContent = actionText;
                }
                
                row.appendChild(actionCell);
                tbody.appendChild(row);
                
                setTimeout(() => {
                    row.style.opacity = '1';
                }, 50);
            }, index * 100);
        });
    }
    
    // Function to display conflicts with animation
    function displayConflicts(conflicts) {
        const container = document.getElementById('conflicts');
        container.innerHTML = '';
        
        if (conflicts['s/r'] === 0 && conflicts['r/r'] === 0) {
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success';
            successAlert.style.opacity = '0';
            successAlert.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>No conflicts detected in the parsing table.';
            container.appendChild(successAlert);
            
            setTimeout(() => {
                successAlert.style.opacity = '1';
            }, 50);
            return;
        }
        
        let html = '';
        
        if (conflicts['s/r'] > 0) {
            html += `<div class="conflict-item" style="opacity: 0">
                <span class="conflict-badge sr-conflict">${conflicts['s/r']}</span> Shift/Reduce Conflicts
            </div>`;
        }
        
        if (conflicts['r/r'] > 0) {
            html += `<div class="conflict-item" style="opacity: 0">
                <span class="conflict-badge rr-conflict">${conflicts['r/r']}</span> Reduce/Reduce Conflicts
            </div>`;
        }
        
        html += `<div class="alert alert-warning mt-2" style="opacity: 0">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Conflicts may lead to ambiguous parsing. Consider revising your grammar.
        </div>`;
        
        container.innerHTML = html;
        
        // Animate each element
        const elements = container.children;
        Array.from(elements).forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
            }, index * 150);
        });
    }
    
    // Function to show errors
    function showError(message) {
        resultStatus.innerHTML = `<span class="badge bg-danger">Error</span>`;
        document.getElementById('conflicts').innerHTML = 
            `<div class="alert alert-danger"><i class="bi bi-x-circle-fill me-2"></i>${message}</div>`;
    }
    
    // Function to clear result with animation
    function clearResult() {
        resultStatus.innerHTML = '';
        
        const elements = [
            document.getElementById('non-terminals'),
            document.getElementById('terminals'),
            document.getElementById('first-follow-sets'),
            document.getElementById('parsing-table'),
            document.getElementById('steps-table').querySelector('tbody'),
            document.getElementById('conflicts')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.innerHTML = '';
                }, 300);
            }
        });
    }
});