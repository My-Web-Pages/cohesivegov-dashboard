// CohesiveGov - Enhanced Initiative Dashboard
const app = (() => {
    // ========== STATE ==========
    const state = {
        initiatives: [],
        filtered: [],
        viewMode: 'grid', // grid, table
        filters: {
            status: [],
            focusArea: [],
            leadAgency: [],
            priority: [],
            buyIn: []
        },
        searchQuery: '',
        sortBy: 'lastUpdate', // lastUpdate, progress, title, priority
        sortDirection: 'desc',
        isDarkTheme: true
    };

    // ========== DOM ELEMENTS ==========
    const elements = {
        grid: document.getElementById('initiative-grid'),
        tableView: document.getElementById('table-view'),
        timelineView: document.getElementById('timeline-view'),
        modalOverlay: document.getElementById('detail-modal'),
        modalContainer: document.getElementById('modal-container'),
        statTotal: document.getElementById('stat-total'),
        statActive: document.getElementById('stat-active'),
        statPlanned: document.getElementById('stat-planned'),
        activeFiltersContainer: document.getElementById('active-filters'),
        viewContainer: document.getElementById('view-container')
    };

    // ========== INITIALIZATION ==========
    function init() {
        if (window.INITIATIVE_DATA) {
            state.initiatives = [...window.INITIATIVE_DATA];
            applyFilters();
        } else {
            console.error("No data found in window.INITIATIVE_DATA");
        }

        renderStats();
        renderView();
        setupEventListeners();

        if (window.lucide) window.lucide.createIcons();
    }

    // ========== EVENT LISTENERS ==========
    function setupEventListeners() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-group')) {
                document.querySelectorAll('.filter-dropdown').forEach(dd => {
                    dd.classList.remove('open');
                });
            }
        });
    }

    // ========== FILTERING & SORTING ==========
    function applyFilters() {
        let results = [...state.initiatives];

        // Apply search
        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            results = results.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.focusArea.toLowerCase().includes(query) ||
                item.leadAgency.toLowerCase().includes(query) ||
                item.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Apply filters
        Object.keys(state.filters).forEach(filterKey => {
            const filterValues = state.filters[filterKey];
            if (filterValues.length > 0) {
                results = results.filter(item => {
                    const itemValue = item[filterKey];
                    return filterValues.includes(itemValue);
                });
            }
        });

        // Apply sorting
        results.sort((a, b) => {
            let aVal, bVal;

            switch (state.sortBy) {
                case 'progress':
                    aVal = a.progress;
                    bVal = b.progress;
                    break;
                case 'title':
                    aVal = a.title.toLowerCase();
                    bVal = b.title.toLowerCase();
                    break;
                case 'priority':
                    const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                    aVal = priorityOrder[a.priority] || 0;
                    bVal = priorityOrder[b.priority] || 0;
                    break;
                case 'lastUpdate':
                default:
                    aVal = new Date(a.metrics.lastUpdate);
                    bVal = new Date(b.metrics.lastUpdate);
            }

            if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        state.filtered = results;
        renderView();
        renderStats();
        renderActiveFilters();
    }

    // ========== RENDERING ==========
    function renderStats() {
        const total = state.filtered.length;
        const active = state.filtered.filter(i => i.status === 'In Progress').length;
        const planned = state.filtered.filter(i => i.status === 'Planned').length;

        if (elements.statTotal) elements.statTotal.innerText = total;
        if (elements.statActive) elements.statActive.innerText = active;
        if (elements.statPlanned) elements.statPlanned.innerText = planned;
    }

    function renderView() {
        // Hide all views
        if (elements.grid) elements.grid.style.display = 'none';
        if (elements.tableView) elements.tableView.style.display = 'none';

        // Render active view
        switch (state.viewMode) {
            case 'table':
                renderTableView();
                break;
            case 'grid':
            default:
                renderGridView();
                break;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    function renderGridView() {
        if (!elements.grid) return;
        elements.grid.style.display = 'grid';
        elements.grid.innerHTML = state.filtered.map(item => createCardHTML(item)).join('');
    }

    function renderTableView() {
        if (!elements.tableView) return;
        elements.tableView.style.display = 'block';

        const tableHTML = `
            <table class="initiatives-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Focus Area</th>
                        <th>Lead Agency</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Progress</th>
                        <th>Project Status</th>
                        <th>Target Date</th>
                        <th>Buy-in</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.filtered.map(item => `
                        <tr onclick="app.openModal('${item.id}')">
                            <td><span class="card-id">${item.id}</span></td>
                            <td><strong>${item.title}</strong></td>
                            <td>${item.focusArea}</td>
                            <td>${item.leadAgency}</td>
                            <td><span class="status-badge ${item.status === 'In Progress' ? 'status-progress' : 'status-planned'}">${item.status}</span></td>
                            <td><span class="priority-badge priority-${item.priority.toLowerCase()}">${item.priority}</span></td>
                            <td>${item.progress}%</td>
                            <td><span class="status-badge ${item.metrics.projectStatus === 'On Track' ? 'status-progress' : 'status-planned'}">${item.metrics.projectStatus}</span></td>
                            <td>${item.metrics.targetDate}</td>
                            <td><span class="buyin-indicator buyin-${item.buyIn.toLowerCase()}">${getBuyInIcon(item.buyIn)} ${item.buyIn}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        elements.tableView.innerHTML = tableHTML;
    }

    function createCardHTML(item) {
        const statusClass = item.status === 'In Progress' ? 'status-progress' : 'status-planned';
        const priorityClass = `priority-${item.priority.toLowerCase()}`;
        const buyInClass = `buyin-${item.buyIn.toLowerCase()}`;

        return `
        <div class="initiative-card" onclick="app.openModal('${item.id}')">
            <div class="card-header">
                <span class="card-id">${item.id}</span>
                <span class="status-badge ${statusClass}">${item.status}</span>
            </div>
            
            <h3 class="card-title">${item.title}</h3>
            
            <div class="card-meta-row">
                <span class="priority-badge ${priorityClass}">${item.priority}</span>
                <span class="buyin-indicator ${buyInClass}">
                    ${getBuyInIcon(item.buyIn)} ${item.buyIn}
                </span>
            </div>
            
            <div class="card-meta">
                <span><i data-lucide="building-2" size="14"></i> ${item.leadAgency}</span>
                <span><i data-lucide="target" size="14"></i> ${item.focusArea}</span>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${item.progress}%"></div>
            </div>
            
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; display: flex; justify-content: space-between;">
                <span>${item.metrics.projectStatus}</span>
                <span>${item.progress}%</span>
            </div>
        </div>
        `;
    }

    function getBuyInIcon(buyIn) {
        const icons = {
            'Unified': '✓',
            'Divergent': '⚠',
            'Blocked': '✖'
        };
        return icons[buyIn] || '○';
    }

    function renderActiveFilters() {
        if (!elements.activeFiltersContainer) return;

        const chips = [];
        Object.keys(state.filters).forEach(filterKey => {
            state.filters[filterKey].forEach(value => {
                chips.push(`
                    <div class="filter-chip">
                        ${filterKey}: ${value}
                        <button onclick="app.removeFilter('${filterKey}', '${value}')">×</button>
                    </div>
                `);
            });
        });

        if (chips.length > 0) {
            elements.activeFiltersContainer.innerHTML = chips.join('') +
                `<button class="clear-filters" onclick="app.clearAllFilters()">Clear All</button>`;
        } else {
            elements.activeFiltersContainer.innerHTML = '';
        }
    }

    // ========== MODAL ==========
    function openModal(id) {
        const item = state.initiatives.find(i => i.id === id);
        if (!item) return;

        const buyInClass = `buyin-${item.buyIn.toLowerCase()}`;
        const priorityClass = `priority-${item.priority.toLowerCase()}`;

        const html = `
            <div class="modal-header">
                <div style="display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
                    <span class="card-id" style="font-size: 0.9rem">${item.id}</span>
                    <span class="status-badge ${item.status === 'In Progress' ? 'status-progress' : 'status-planned'}">${item.status}</span>
                    <span class="priority-badge ${priorityClass}">${item.priority} Priority</span>
                    <span class="buyin-indicator ${buyInClass}">${getBuyInIcon(item.buyIn)} ${item.buyIn}</span>
                </div>
                <h2 style="font-size: 1.8rem; font-weight: 700; line-height: 1.2">${item.title}</h2>
                <div style="margin-top: 1rem;">
                    <button onclick="app.exportToMarkdown('${item.id}')" style="background: rgba(59, 130, 246, 0.1); border: 1px solid var(--accent-blue); color: var(--accent-blue); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; font-family: inherit; transition: all 0.2s;">
                        <i data-lucide="download" size="14"></i> Download Summary
                    </button>
                </div>
            </div>
            
            <div class="modal-body">
                <!-- Status Notes -->
                ${item.statusNotes ? `
                <div style="background: rgba(59, 130, 246, 0.05); border-left: 3px solid var(--accent-blue); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">Current Status</h4>
                    <p style="color: var(--text-main); line-height: 1.6; font-size: 0.9rem;">${item.statusNotes}</p>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">Progress: ${item.progress}%</div>
                </div>
                ` : ''}

                <!-- Overview Grid -->
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
                    <div>
                        <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">Vision</h4>
                        <p style="color: var(--text-main); line-height: 1.6;">${item.vision || 'No vision statement provided.'}</p>
                    </div>
                    <div>
                        <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem;">Lead Agency</h4>
                        <div style="background: rgba(255,255,255,0.05); padding: 0.75rem 1rem; border-radius: 6px; display: inline-block;">
                            <i data-lucide="building-2" size="16"></i> ${item.leadAgency}
                        </div>
                    </div>
                </div>

                <!-- Rationale / Starting Point -->
                ${item.rationale ? `
                <div>
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem;">Starting Point</h4>
                    <p style="color: var(--text-main); line-height: 1.6;">${item.rationale}</p>
                </div>
                ` : ''}

                <!-- Goals -->
                <div>
                   <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem;">Goals</h4>
                   <ul style="list-style: none; display: grid; gap: 0.75rem;">
                        ${item.goals.map(g => `
                            <li style="display: flex; gap: 0.75rem; align-items: start; color: var(--text-muted);">
                                <i data-lucide="check-circle" size="16" style="color: var(--accent-emerald); margin-top: 3px;"></i>
                                <span>${g}</span>
                            </li>
                        `).join('')}
                   </ul>
                </div>

                <!-- Action Plan -->
                ${item.actionPlan && item.actionPlan.length > 0 ? `
                <div>
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem;">Action Plan</h4>
                    <div style="display: grid; gap: 0.75rem;">
                        ${item.actionPlan.map(ap => `
                            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border); display: grid; grid-template-columns: 100px 1fr auto; gap: 1rem; align-items: center;">
                                <span style="font-weight: 600; color: var(--accent-blue);">${ap.quarter}</span>
                                <span style="color: var(--text-main);">${ap.action}</span>
                                <span class="status-badge ${ap.status === 'In Progress' ? 'status-progress' : 'status-planned'}" style="font-size: 0.7rem;">${ap.status}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Key Metrics -->
                <div>
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 1rem;">Key Metrics</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Progress</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent-emerald);">${item.progress}%</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Project Status</div>
                            <div style="font-size: 1.2rem; font-weight: 700; color: ${item.metrics.projectStatus === 'On Track' ? 'var(--accent-emerald)' : '#f97316'};">${item.metrics.projectStatus}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Target Date</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${item.metrics.targetDate}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Budget</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${item.metrics.budget}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                            <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Last Update</div>
                            <div style="font-size: 1rem; font-weight: 700;">${item.metrics.lastUpdate}</div>
                        </div>
                    </div>
                </div>

                <!-- Initiative Roadmap -->
                <div>
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 1rem;">Initiative Roadmap</h4>
                    <div style="background: rgba(255,255,255,0.03); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--glass-border);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.85rem;">
                            <div>
                                <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Origin</div>
                                <div style="font-weight: 600;">${item.roadmap.origin}</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="color: var(--accent-blue); font-size: 0.75rem; margin-bottom: 0.25rem;">Current Phase</div>
                                <div style="font-weight: 600; color: var(--accent-blue);">${item.roadmap.currentPhase}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.25rem;">Destination</div>
                                <div style="font-weight: 600;">${item.roadmap.destination}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                            ${item.roadmap.milestones.map((wp, idx) => `
                                <div style="flex: 1; text-align: center; padding: 0.5rem; background: ${idx <= item.roadmap.milestones.indexOf(item.roadmap.currentPhase) ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)'}; border-radius: 4px; font-size: 0.75rem; ${idx <= item.roadmap.milestones.indexOf(item.roadmap.currentPhase) ? 'color: var(--accent-blue); font-weight: 600;' : 'color: var(--text-muted);'}">
                                    ${idx <= item.roadmap.milestones.indexOf(item.roadmap.currentPhase) ? '✓' : '○'} ${wp}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Stakeholders -->
                <div>
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem;">Stakeholders</h4>
                    <div style="display: grid; gap: 0.75rem;">
                        ${item.stakeholders.map(s => `
                            <div style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; border: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 600;">${s.name}</span>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">${s.role}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Reference Links -->
                ${item.referenceLinks && item.referenceLinks.length > 0 ? `
                <div>
                    <h4 style="color: var(--accent-blue); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.75rem;">Reference Links</h4>
                    <div style="display: grid; gap: 0.5rem;">
                        ${item.referenceLinks.map(link => `
                            <a href="${link.url}" target="_blank" style="color: var(--accent-blue); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 6px; transition: background 0.2s; hover:background: rgba(59, 130, 246, 0.05);">
                                <i data-lucide="external-link" size="14"></i>
                                <span>${link.title}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Tags -->
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem;">
                    ${item.tags.map(t => `<span style="font-size: 0.75rem; padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.05); border-radius: 20px; color: var(--text-muted);">${t}</span>`).join('')}
                </div>
            </div>
        `;

        elements.modalContainer.innerHTML = html;
        elements.modalOverlay.classList.add('open');

        if (window.lucide) window.lucide.createIcons();
    }

    function closeModal() {
        elements.modalOverlay.classList.remove('open');
    }

    // ========== PUBLIC API ==========
    function handleSearch(query) {
        state.searchQuery = query;
        applyFilters();
    }

    function toggleFilter(filterKey, value) {
        const index = state.filters[filterKey].indexOf(value);
        if (index > -1) {
            state.filters[filterKey].splice(index, 1);
        } else {
            state.filters[filterKey].push(value);
        }
        applyFilters();
    }

    function removeFilter(filterKey, value) {
        const index = state.filters[filterKey].indexOf(value);
        if (index > -1) {
            state.filters[filterKey].splice(index, 1);
        }
        applyFilters();
    }

    function clearAllFilters() {
        Object.keys(state.filters).forEach(key => {
            state.filters[key] = [];
        });
        applyFilters();
    }

    function setViewMode(mode) {
        state.viewMode = mode;

        // Update view button states
        document.querySelectorAll('.view-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${mode}"]`)?.classList.add('active');

        renderView();
    }

    function toggleFilterDropdown(filterKey) {
        const dropdown = document.getElementById(`filter-${filterKey}`);
        if (!dropdown) return;

        const isOpen = dropdown.classList.contains('open');

        // Close all dropdowns
        document.querySelectorAll('.filter-dropdown').forEach(dd => {
            dd.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    }

    function getUniqueValues(key) {
        return [...new Set(state.initiatives.map(item => item[key]))].sort();
    }

    function toggleTheme() {
        state.isDarkTheme = !state.isDarkTheme;
        document.body.classList.toggle('light-theme', !state.isDarkTheme);

        // Update toggle button icon
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', state.isDarkTheme ? 'sun' : 'moon');
            if (window.lucide) window.lucide.createIcons();
        }
    }

    function exportToMarkdown(id) {
        const item = state.initiatives.find(i => i.id === id);
        if (!item) return;

        const content = `${item.title}

${item.id}  ·  ${item.status}

VISION

${item.vision}

${item.rationale ? `STARTING POINT

${item.rationale}

` : ''}GOALS

${item.goals.map((g, idx) => `${idx + 1}. ${g}`).join('\n')}

${item.actionPlan && item.actionPlan.length > 0 ? `ACTION PLAN

${item.actionPlan.map(ap => `  ${ap.quarter}: ${ap.action} [${ap.status}]`).join('\n')}

` : ''}CURRENT STATUS

${item.statusNotes || 'No status updates available.'}

Progress: ${item.progress}%

TAGS

${item.tags.join(' · ')}

${item.referenceLinks && item.referenceLinks.length > 0 ? `REFERENCE LINKS

${item.referenceLinks.map(link => `  - ${link.title}\n    ${link.url}`).join('\n\n')}

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lead Agency: ${item.leadAgency}
Priority: ${item.priority}
Buy-in: ${item.buyIn}
Target Date: ${item.metrics.targetDate}
Budget: ${item.metrics.budget}
Last Updated: ${item.metrics.lastUpdate}

Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
`;

        // Create download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.id}_${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Initialize on load
    window.addEventListener('DOMContentLoaded', init);

    // Public API
    return {
        init,
        handleSearch,
        toggleFilter,
        removeFilter,
        clearAllFilters,
        setViewMode,
        toggleFilterDropdown,
        openModal,
        closeModal,
        getUniqueValues,
        toggleTheme,
        exportToMarkdown
    };
})();
