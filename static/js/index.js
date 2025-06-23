$(document).ready(function() {
    // Sticky Nav functionality
    const navbar = $('#sticky-navbar');
    const buttonGroup = $('#button-group-original');
    
    // Check if the button group exists to avoid errors
    if (buttonGroup.length) {
      const stickyPoint = buttonGroup.offset().top + buttonGroup.outerHeight();

      $(window).scroll(function() {
        if ($(window).scrollTop() > stickyPoint) {
          navbar.addClass('visible');
        } else {
          navbar.removeClass('visible');
        }
      });
    }

    // Hamburger menu functionality
    $('#hamburger-menu').on('click', function() {
      $('#nav-links').toggleClass('active');
    });
  });

  // KaTeX rendering logic
  document.addEventListener("DOMContentLoaded", function() {

    
    // --- NEW: Consistent Color Palette ---
    const softBlue = 'rgba(116, 174, 204, 0.7)';
    const softBlueBorder = 'rgba(116, 174, 204, 1)';
    const softOrange = 'rgba(244, 162, 97, 0.7)';
    const softOrangeBorder = 'rgba(244, 162, 97, 1)';
    const softGreen = 'rgba(131, 184, 153, 0.7)';
    const softGreenBorder = 'rgba(131, 184, 153, 1)';
    const softRed = 'rgba(231, 111, 81, 0.7)';
    const softRedBorder = 'rgba(231, 111, 81, 1)';
    const darkBlue = 'rgba(38, 70, 83, 0.7)';
    const darkBlueBorder = 'rgba(38, 70, 83, 1)';
    const softYellow = 'rgba(233, 196, 106, 0.7)';
    const softYellowBorder = 'rgba(233, 196, 106, 1)';

    // New color palette for the pie chart with softer colors
    const pieChartColors = [
        '#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5',
        '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
        '#cab2d6', '#cccccc', '#48a9a6'
    ];


    // Descriptions for the data splits tooltip
    const splitDescriptions = {
        'Best-of-n': 'Problems from the IMOSL, BMOSL, USAMO with solutions specific for best-of-n sampling.',
        'Generic (Train)': 'A general collection of problems from various sources.',
        'MathArena': 'Contains problems from MathArena, used to measure difference between final-answer accuracy and proof validity.',
        'PutnamBench': 'Contains problems from the PutnamBench, used to compare formal and natural language proof generation.',
        'Generic (Test)': 'A general collection of problems from various sources.'
    };

    // --- Chart 1: Data Splits (Updated Colors) ---
    const dataSplitsCtx = document.getElementById('dataSplitsChart').getContext('2d');
    new Chart(dataSplitsCtx, {
        type: 'bar',
        data: {
            labels: ['Generic (Train)', 'Best-of-n', 'PutnamBench', 'MathArena',  'Generic (Test)'],
            datasets: [
                {
                    label: 'Number of Problems',
                    data: [611, 152, 114, 112, 65],
                    backgroundColor: softBlue,
                    borderColor: softBlueBorder,
                    borderWidth: 1
                },
                {
                    label: 'Number of Solutions',
                    data: [3011, 252 + 477, 564, 438, 320],
                    backgroundColor: softOrange,
                    borderColor: softOrangeBorder,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        afterBody: function(context) {
                            const label = context[0].label;
                            return splitDescriptions[label] || '';
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Problems and Judgments per Data Split'
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Count' } },
                x: { title: { display: true, text: 'Split Name' } }
            }
        }
    });

    // --- Chart 2: Problems per Model (Updated Colors) ---
    const modelsCtx = document.getElementById('modelsChart').getContext('2d');
    new Chart(modelsCtx, {
        type: 'bar',
        data: {
            labels: ['o4-mini', 'o3', 'Qwen3-235B', 'Gemini-2.5-Pro', 'Grok-3-Mini', 'Deepseek-R1 (05/28)'],
            datasets: [{
                label: '# of Problems',
                data: [1615, 892, 890, 878, 461, 326],
                backgroundColor: softBlue,
                borderColor: softBlueBorder,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Number of Solutions per Model' }
            },
            scales: {
                x: { title: { display: true, text: 'Number of Solutions' } }
            }
        }
    });

    // --- Chart 3: Problems per Competition (Updated to Pie Chart with Softer Colors) ---
    const competitionsCtx = document.getElementById('competitionsChart').getContext('2d');
    
    // 1. All competition data is now stored in this single array, aggregated from your table.
    const competitionSourceData = [
        { abbr: 'IMO SL', fullName: 'IMO Shortlist', problems: 178, desc: 'Shortlist of problems, from which the IMO is selected' },
        { abbr: 'Putnam', fullName: 'Putnam', problems: 122, desc: 'Undergraduate competition, regarded as one of the most difficult' },
        { abbr: 'BMOSL', fullName: 'Balkan MO Shortlist', problems: 106, desc: 'Competition between Balkan countries' },
        { abbr: 'USAMO', fullName: 'USAMO', problems: 64, desc: 'The final round of the USA Math Olympiad' },
        { abbr: 'Baltic Way', fullName: 'Baltic Way MO', problems: 80, desc: 'Northern and Central European Olympiad' },
        { abbr: 'Irish MO', fullName: 'Irish MO', problems: 51, desc: 'Final round of the Irish Olympiad' },
        { abbr: 'Bulgarian SC', fullName: 'Bulgarian Seasonal Competitions', problems: 49, desc: 'Seasonal Competitions hosted in Bulgaria (8th-12th grade)' },
        { abbr: 'EGMO', fullName: "European Girls' MO", problems: 47, desc: 'Europe-wide olympiad allowing only girls as participants' },
        { abbr: 'IZHO', fullName: 'International Zhautykov MO', problems: 41, desc: 'Kazakhstan-based olympiad with near-IMO-level questions' },
        { abbr: 'SMT', fullName: 'SMT 2025', problems: 33, desc: 'Answer-based competition hosted by Stanford' },
        { abbr: 'IMC', fullName: 'IMC', problems: 29, desc: 'International competition for university students' },
        { abbr: 'BRUMO', fullName: 'BRUMO 2025', problems: 28, desc: 'Answer-based competition hosted by Brown University' },
        { abbr: 'BMO Prelim', fullName: 'British MO Prelim', problems: 28, desc: 'Preliminary round for the British Olympiad' },
        { abbr: 'HMMT', fullName: 'HMMT February 2025', problems: 26, desc: 'Answer-based competition hosted by Harvard and MIT' },
        { abbr: 'AIME', fullName: 'AIME 2025', problems: 24, desc: 'Answer-based competition, serving as a qualifier for the USAMO' },
        { abbr: 'USA JMO', fullName: 'USA Junior MO', problems: 25, desc: 'USA olympiad that allows only junior students' },
        { abbr: 'BMO Final', fullName: 'British MO Final', problems: 23, desc: 'Final round of the British Olympiad' },
        { abbr: 'RMM', fullName: 'Romanian Masters of Mathematics Extralist', problems: 33, desc: 'IMO-level competition hosted in Romania' },
        { abbr: 'Swiss MO', fullName: 'Swiss MO', problems: 8, desc: 'Various problems from the Swiss Olympiad' }
    ];

    // 2. We process the array above to feed the data into Chart.js
    const chartLabels = competitionSourceData.map(c => c.abbr);
    const chartData = competitionSourceData.map(c => c.problems);
    const chartFullNames = competitionSourceData.map(c => c.fullName);
    const chartDescriptions = competitionSourceData.map(c => c.desc);

    new Chart(competitionsCtx, {
        type: 'pie',
        data: {
            labels: chartLabels, // Use abbreviations for the legend
            datasets: [{
                label: '# of Problems',
                data: chartData,
                backgroundColor: pieChartColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { boxWidth: 15, font: { size: 10 } }
                },
                title: {
                    display: true,
                    text: 'Proportion of Problems by Competition Source'
                },
                // 3. The tooltip is updated to show full names and new descriptions
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            // Show the full competition name in the tooltip title
                            const dataIndex = context[0].dataIndex;
                            return chartFullNames[dataIndex];
                        },
                        afterBody: function(context) {
                            // Show the new description from the table below the problem count
                            const dataIndex = context[0].dataIndex;
                            return chartDescriptions[dataIndex];
                        }
                    }
                }
            }
        }
    });

    // Data for charts
    const weightedScores = {
        'Gemini-2.5-Pro': 0.556,
        'o3': 0.528,
        'o4-mini': 0.513,
        'Qwen3-235B': 0.383,
        // 'Grok-3-Mini': 0.408,
        // 'Deepseek-R1': 0.262
    };

    const naturalLanguageProofCorrectness = {
        'Gemini-2.5-Pro': 0.827,
        'o4-mini': 0.776,
        'o3': 0.765,
        'Qwen3-235B': 0.615,
        'Grok-3-Mini': 0.581
    };
    const formalProofCorrectness = 0.07446;

    const finalAnswerVsProofCorrectness = {
        'Gemini-2.5-Pro': [0.849, 0.770],
        'o4-mini': [0.874, 0.803],
        'o3': [0.876, 0.595],
        'Qwen3-235B': [0.767, 0.570]
    };

    const scoresSelectorMethods = {
        'pass@n': [0.265, 0.364, 0.422, 0.462, 0.493, 0.517, 0.535, 0.550],
        'Discrete': [0.265, 0.282, 0.302, 0.318, 0.328, 0.334, 0.340, 0.346],
        'Continuous': [0.265, 0.290, 0.315, 0.333, 0.345, 0.352, 0.356, 0.360],
        'Ranking (Knockout)': [0.265, 0.297, 0.328, 0.357, 0.384, 0.408, 0.421, 0.442],
        'Ranking (Swiss)': [0.265, 0.299, 0.340, 0.366, 0.396, 0.424, 0.441, 0.465]
    };

    // Chart for Conclusion 1 (Updated Colors)
    const conclusion1Ctx = document.getElementById('conclusion1Chart').getContext('2d');
    new Chart(conclusion1Ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(weightedScores),
            datasets: [{
                label: 'Weighted Average Score',
                data: Object.values(weightedScores),
                backgroundColor: [softBlue, softOrange, softGreen, softRed, darkBlue]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'LLM Performance in Natural Language Proof Generation'
                },
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true },
                x: { ticks: { font: { size: 9 } } }
            }
        }
    });

    // Chart for Conclusion 2 (Updated Colors)
    const conclusion2Ctx = document.getElementById('conclusion2Chart').getContext('2d');
    const nlModels = Object.keys(naturalLanguageProofCorrectness);
    const nlScores = Object.values(naturalLanguageProofCorrectness);
    const allLabels = [...nlModels, 'Formal Proof'];
    const allScores = [...nlScores, formalProofCorrectness];
    new Chart(conclusion2Ctx, {
        type: 'bar',
        data: {
            labels: allLabels,
            datasets: [{
                label: 'Correctness Score',
                data: allScores,
                backgroundColor: [...Array(nlModels.length).fill(softBlue), softRed]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Natural Language vs. Formal Proof Correctness'
                },
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true },
                x: { ticks: { font: { size: 9 } } }
            }
        }
    });
    
    // Chart for Conclusion 3 (Updated Colors)
    const conclusion3Ctx = document.getElementById('conclusion3Chart').getContext('2d');
    new Chart(conclusion3Ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(finalAnswerVsProofCorrectness),
            datasets: [
                {
                    label: 'Final-Answer Correctness',
                    data: Object.values(finalAnswerVsProofCorrectness).map(v => v[0]),
                    backgroundColor: softBlue
                },
                {
                    label: 'Proof Correctness',
                    data: Object.values(finalAnswerVsProofCorrectness).map(v => v[1]),
                    backgroundColor: softOrange
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Final-Answer Correctness vs. Proof Correctness'
                }
            },
            scales: {
                y: { beginAtZero: true },
                x: { ticks: { font: { size: 9 } } }
            }
        }
    });

    // Chart for Conclusion 4 (Updated Colors)
    const conclusion4Ctx = document.getElementById('conclusion4Chart').getContext('2d');
    const lineChartColors = [
        '#4e79a7', // Muted Blue
        '#f28e2c', // Muted Orange
        '#e15759', // Muted Red
        '#76b7b2', // Muted Teal
        '#af7aa1'  // Muted Purple
    ];
    new Chart(conclusion4Ctx, {
        type: 'line',
        data: {
            labels: [...Array(8).keys()].map(i => i + 1),
            datasets: Object.keys(scoresSelectorMethods).map((method, index) => ({
                label: method,
                data: scoresSelectorMethods[method],
                fill: false,
                tension: 0.1,
                borderColor: lineChartColors[index % lineChartColors.length]
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Effectiveness of Best-of-n Selection Strategies'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'n (Number of Selections)'
                    }
                },
                y: {
                    min: 0.25,
                    max: 0.60,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            }
        }
    });

    renderProblems(problemData, 'problem-container');


});
/**
 * HELPER: Creates an element, sets its properties, and appends children.
 * @param {string} tag - The HTML tag to create (e.g., 'div', 'p').
 * @param {object} props - An object of properties (e.g., { className: 'my-class', textContent: 'Hello' }).
 * @param  {...(Node|string)} children - Child elements or strings to append.
 * @returns {HTMLElement} The created element.
 */
function createElement(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.keys(props).forEach(key => {
        if (key in el) {
            el[key] = props[key];
        } else {
            el.setAttribute(key, props[key]);
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child) {
            el.appendChild(child);
        }
    });
    return el;
}


/**
 * Opens a specific tab, hiding other tabs in the same group.
 * This function now works more reliably with nested tab structures.
 * @param {Event} evt The mouse click event.
 * @param {string} contentId The ID of the tab content element to display.
 */
function openTab(evt, contentId) {
    const clickedButton = evt.currentTarget;
    const tabContainer = clickedButton.closest('.tab-container');
    
    // Hide all tab content within this specific tab container
    const tabContents = tabContainer.querySelectorAll('.tabcontent');
    tabContents.forEach(tc => tc.style.display = 'none');

    // Remove the "active" class from all tab buttons in this tab bar
    const tablinks = tabContainer.querySelector('.tab').querySelectorAll('.tablinks');
    tablinks.forEach(tl => tl.classList.remove('active'));

    // Show the current tab, and add an "active" class to the button that opened the tab
    const contentToShow = document.getElementById(contentId);
    if (contentToShow) {
        contentToShow.style.display = 'block';
    }
    clickedButton.classList.add('active');
}

/**
 * Creates the HTML for a single model's attempt.
 * @param {object} attempt - An attempt object from the 'attempts' array.
 * @returns {DocumentFragment} A fragment containing the model's content.
 */
function createModelContent(attempt) {
    const fragment = document.createDocumentFragment();

    let feedbackClass = 'description-box'; // Default
    if (attempt.feedback === 'Correct') {
        feedbackClass = 'solution-box';
    } else if (attempt.feedback) {
        feedbackClass = 'incorrect-box';
    }

    const feedbackBox = createElement('div', { className: `box ${feedbackClass}` });
    const judgment = attempt.score === 1 ? 'correct' : 'incorrect';
    feedbackBox.innerHTML = `<strong>Judgment (${judgment})</strong>: ${attempt.feedback || 'No feedback provided.'}`;
    fragment.appendChild(feedbackBox);

    const responseBox = createElement('div', { className: 'box response-box' },
        createElement('h4', { textContent: 'Model Response' }),
        // We set textContent here to safely render the raw solution string
        createElement('div', { textContent: attempt.solution })
    );
    fragment.appendChild(responseBox);
    
    return fragment;
}


/**
 * Creates the inner tabs for all model attempts for a given problem.
 * @param {Array} attempts - The array of attempt objects.
 * @param {string} problemId - The unique ID of the parent problem.
 * @returns {HTMLElement} A div element containing the complete inner tabs structure.
 */
function createModelTabs(attempts, problemId) {
    if (!attempts || attempts.length === 0) {
        return createElement('h6', { textContent: 'No model attempts available for this problem.' });
    }

    const tabContainer = createElement('div', { className: 'tab-container' });
    const tabBar = createElement('div', { className: 'tab' });
    
    const contentElements = [];

    attempts.forEach((attempt, index) => {
        const modelId = attempt.model_id.replace(/[^a-zA-Z0-9]/g, '_');
        const contentId = `${problemId}_model_${index}`;
        
        const tabButton = createElement('button', {
            className: 'tablinks',
            textContent: attempt.model_id,
            onclick: (e) => openTab(e, contentId)
        });
        tabBar.appendChild(tabButton);
        
        const tabContent = createElement('div', {
            id: contentId,
            className: 'tabcontent model-tab-content',
            style: 'display: none;' // Hide by default
        });
        tabContent.appendChild(createModelContent(attempt));
        contentElements.push(tabContent);
    });

    tabContainer.appendChild(tabBar);
    contentElements.forEach(el => tabContainer.appendChild(el));

    return tabContainer;
}

/**
 * Renders a list of problems into the specified container.
 * @param {Array} problems - An array of problem objects.
 * @param {string} containerId - The ID of the HTML element to render into.
 */
function renderProblems(problems, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }
    container.innerHTML = ''; // Clear previous content

    const mainTabContainer = createElement('div', { className: 'tab-container' });
    const mainTabBar = createElement('div', { className: 'tab' });
    const mainContentElements = [];

    problems.forEach((problem) => {
        const problemId = problem.problem_id;
        const problemContentId = `${problemId}_main_content`;

        const tabButton = createElement('button', {
            className: 'tablinks',
            textContent: `${problemId}`,
            onclick: (e) => openTab(e, problemContentId)
        });
        mainTabBar.appendChild(tabButton);

        const problemContent = createElement('div', { id: problemContentId, className: 'tabcontent problem-tab-content', style: 'display: none;' });

        problemContent.appendChild(createElement('div', { className: 'box problem-box' },
            createElement('h4', { textContent: 'Problem Statement' }),
            createElement('p', { textContent: problem.problem })
        ));

        problemContent.appendChild(createElement('div', { className: 'box solution-box' },
            createElement('h4', { textContent: 'Ground-Truth Solution' }),
            problem.solution
                ? createElement('p', { textContent: problem.solution })
                : createElement('h6', { textContent: 'No ground-truth solution exists.' })
        ));
        
        problemContent.appendChild(createElement('h4', { textContent: 'Model Attempts' }));
        problemContent.appendChild(createModelTabs(problem.attempts, problemId));
        
        mainContentElements.push(problemContent);
    });

    mainTabContainer.appendChild(mainTabBar);
    mainContentElements.forEach(el => mainTabContainer.appendChild(el));
    container.appendChild(mainTabContainer);

    // IMPORTANT: Re-render math equations after inserting all new DOM elements
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(container, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\begin{equation}", right: "\\end{equation}", display: true},
                {left: "\\begin{align}", right: "\\end{align}", display: true},
                {left: "\\begin{alignat}", right: "\\end{alignat}", display: true},
                {left: "\\begin{gather}", right: "\\end{gather}", display: true},
                {left: "\\begin{CD}", right: "\\end{CD}", display: true},
                {left: "\\[", right: "\\]", display: true}
            ],
            ignoreHtml: true,
            throwOnError: false
        });
    } else {
        console.warn("KaTeX 'renderMathInElement' function not found. Math will not be rendered.");
    }

    // Automatically open the first problem and the first model tab within it
    const firstProblemTab = container.querySelector('.tablinks');
    if (firstProblemTab) {
        firstProblemTab.click();
        
        const firstModelTabContainer = firstProblemTab.closest('.tab-container').querySelector('.tab-container');
        if (firstModelTabContainer) {
            const firstModelTab = firstModelTabContainer.querySelector('.tablinks');
            if (firstModelTab) {
                firstModelTab.click();
            }
        }
    }
}