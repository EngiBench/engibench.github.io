// Global toggle function for collapsible examples
function toggleExample(exampleId) {
    const example = document.getElementById(exampleId);
    
    if (!example) {
        console.error('Example element not found:', exampleId);
        return;
    }
    
    const toggle = example.previousElementSibling;
    
    if (!toggle) {
        console.error('Toggle element not found for:', exampleId);
        return;
    }
    
    const arrow = toggle.querySelector('.toggle-arrow');
    const strongElement = toggle.querySelector('strong');
    
    if (example.style.display === 'none' || example.style.display === '') {
        example.style.display = 'block';
        if (arrow) arrow.classList.add('rotated');
        if (strongElement) strongElement.textContent = '📖 Hide Example';
    } else {
        example.style.display = 'none';
        if (arrow) arrow.classList.remove('rotated');
        if (strongElement) strongElement.textContent = '📖 Show Example';
    }
}

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

    // --- NEW: Performance Charts for Level 1 & Level 2 ---
    // Level 1 Accuracy Chart (sorted by perturbed L1)
    const level1AccuracyElement = document.getElementById('level1AccuracyChart');
    if (!level1AccuracyElement) {
        console.error('level1AccuracyChart element not found');
        return;
    }
    const level1AccuracyCtx = level1AccuracyElement.getContext('2d');
    const level1Models = [
        'Gemini 2.5 Flash', 'Llama 4', 'GPT-4.1', 'DeepSeek-V3', 'Gemini 2.0 Flash',
        'GPT-4.1 Nano', 'Claude 3.7 Sonnet', 'GLM-4-32B', 'GPT-4.1 Mini', 'Claude 3.5 Sonnet',
        'Qwen2.5-72B', 'Llama 3.3', 'GLM-4-9B', 'DeepSeek-R1 7B', 'Qwen2.5-7B', 'Mixtral-8x7B'
    ];
    
    const level1Original = [92.7, 90.1, 90.2, 89.5, 91.0, 81.2, 80.8, 84.6, 84.5, 80.7, 82.7, 83.5, 75.3, 75.7, 73.0, 64.8];
    const level1Perturbed = [75.1, 90.2, 87.5, 89.5, 86.3, 84.7, 84.1, 83.5, 83.5, 82.1, 77.6, 76.9, 75.8, 75.7, 73.0, 60.3];
    const level1Knowledge = [92.2, 92.2, 91.9, 90.6, 90.2, 88.9, 85.2, 85.8, 89.7, 82.2, 82.3, 82.4, 81.1, 81.8, 76.8, 69.6];
    const level1MathAbs = [95.3, 93.9, 95.3, 90.6, 94.5, 91.6, 92.7, 89.8, 90.6, 92.0, 86.0, 85.4, 84.5, 82.6, 84.0, 79.0];

    new Chart(level1AccuracyCtx, {
        type: 'bar',
        data: {
            labels: level1Models,
            datasets: [
                {
                    label: 'Original',
                    data: level1Original,
                    backgroundColor: 'rgba(169, 169, 169, 0.7)',
                    borderColor: 'rgba(169, 169, 169, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Perturbed',
                    data: level1Perturbed,
                    backgroundColor: 'rgba(70, 130, 180, 0.7)',
                    borderColor: 'rgba(70, 130, 180, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Knowledge-enhanced',
                    data: level1Knowledge,
                    backgroundColor: 'rgba(135, 206, 235, 0.7)',
                    borderColor: 'rgba(135, 206, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Math Abstraction',
                    data: level1MathAbs,
                    backgroundColor: 'rgba(173, 216, 230, 0.7)',
                    borderColor: 'rgba(173, 216, 230, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Level 1 Accuracy (sorted by perturbed L1)'
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        boxWidth: 12,
                        font: { size: 11 },
                        padding: 12,
                        usePointStyle: false
                    },
                    maxHeight: 40
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Accuracy (%)' }
                },
                x: { 
                    ticks: { 
                        maxRotation: 45,
                        font: { size: 9 }
                    }
                }
            }
        }
    });

    // Level 2 Accuracy Chart (sorted by perturbed L2)
    const level2AccuracyElement = document.getElementById('level2AccuracyChart');
    if (!level2AccuracyElement) {
        console.error('level2AccuracyChart element not found');
        return;
    }
    const level2AccuracyCtx = level2AccuracyElement.getContext('2d');
    const level2Models = [
        'Gemini 2.5 Flash', 'GPT-4.1', 'Llama 4', 'Claude 3.7 Sonnet', 'Gemini 2.0 Flash',
        'GPT-4.1 Mini', 'DeepSeek-V3', 'GLM-4-32B', 'Claude 3.5 Sonnet', 'GPT-4.1 Nano',
        'Qwen2.5-72B', 'DeepSeek-R1 7B', 'Llama 3.3', 'GLM-4-9B', 'Qwen2.5-7B', 'Mixtral-8x7B'
    ];
    
    const level2Original = [82.9, 80.0, 76.5, 73.5, 69.6, 69.0, 63.6, 62.0, 64.8, 59.1, 54.4, 52.5, 52.5, 50.5, 37.3, 30.0];
    const level2Perturbed = [91.7, 81.5, 76.3, 73.0, 75.7, 71.9, 72.0, 63.9, 68.5, 74.5, 55.4, 65.7, 55.3, 61.3, 53.9, 42.9];
    const level2Knowledge = [94.2, 85.3, 78.9, 77.2, 78.2, 82.5, 82.0, 77.0, 80.3, 83.3, 74.6, 73.0, 73.2, 70.2, 69.4, 57.7];
    const level2MathAbs = [94.2, 87.8, 89.8, 84.1, 87.4, 82.5, 82.0, 77.0, 80.3, 83.3, 74.6, 73.0, 73.2, 70.2, 69.4, 57.7];

    new Chart(level2AccuracyCtx, {
        type: 'bar',
        data: {
            labels: level2Models,
            datasets: [
                {
                    label: 'Original',
                    data: level2Original,
                    backgroundColor: 'rgba(169, 169, 169, 0.7)',
                    borderColor: 'rgba(169, 169, 169, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Perturbed',
                    data: level2Perturbed,
                    backgroundColor: 'rgba(220, 20, 60, 0.7)',
                    borderColor: 'rgba(220, 20, 60, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Knowledge-enhanced',
                    data: level2Knowledge,
                    backgroundColor: 'rgba(255, 182, 193, 0.7)',
                    borderColor: 'rgba(255, 182, 193, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Math Abstraction',
                    data: level2MathAbs,
                    backgroundColor: 'rgba(255, 218, 185, 0.7)',
                    borderColor: 'rgba(255, 218, 185, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Level 2 Accuracy (sorted by perturbed L2)'
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'center',
                    labels: {
                        boxWidth: 12,
                        font: { size: 11 },
                        padding: 12,
                        usePointStyle: false
                    },
                    maxHeight: 40
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Accuracy (%)' }
                },
                x: { 
                    ticks: { 
                        maxRotation: 45,
                        font: { size: 9 }
                    }
                }
            }
        }
    });

    // --- Key Finding Charts ---
    // Level 1 and Level 2 Accuracy Chart (按照图片中的确切数值和顺序)
    const levelAccuracyCtx = document.getElementById('levelAccuracyChart').getContext('2d');
    const modelNames = [
        'Gemini 2.5 Flash', 'GPT-4.1', 'Llama 4', 'Claude 3.7 Sonnet', 'Gemini-2.0 Flash',
        'GPT-4.1 Mini', 'DeepSeek-V3', 'GLM-4-32B', 'Claude 3.5 Sonnet', 'GPT-4.1 Nano',
        'Qwen2.5-72B', 'Llama 3.3', 'DeepSeek-R1 7B', 'GLM-4-9B', 'Qwen2.5-7B', 'Mistral-8x7B'
    ];
    const level1Data = [95.12, 87.50, 90.23, 84.06, 86.29, 83.48, 87.47, 83.52, 82.06, 84.70, 77.61, 76.91, 75.67, 75.84, 73.05, 60.27];
    const level2Data = [91.72, 81.53, 76.33, 72.96, 69.57, 68.95, 63.64, 62.96, 62.37, 59.07, 54.40, 52.51, 52.51, 50.53, 37.31, 30.00];

    new Chart(levelAccuracyCtx, {
        type: 'bar',
        data: {
            labels: modelNames,
            datasets: [
                {
                    label: 'Level 1',
                    data: level1Data,
                    backgroundColor: softBlue,
                    borderColor: softBlueBorder,
                    borderWidth: 1
                },
                {
                    label: 'Level 2',
                    data: level2Data,
                    backgroundColor: '#ffb3ba',
                    borderColor: '#ff8a95',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Level 1 and Level 2 Accuracy'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Accuracy (%)' }
                },
                x: { 
                    ticks: { 
                        maxRotation: 45,
                        font: { size: 9 }
                    }
                }
            }
        }
    });

    // Level 3 Score Chart (按照图片中的确切数值和顺序)
    const level3ScoreCtx = document.getElementById('level3ScoreChart').getContext('2d');
    const level3Models = [
        'GPT-4.1', 'Claude 3.7 Sonnet', 'GPT-4.1 Mini', 'DeepSeek-V3', 'Gemini 2.5 Flash',
        'Gemini 2.0 Flash', 'GPT-4.1 Nano', 'GLM-4-32B', 'GLM-4-9B', 'Claude 3.5 Sonnet',
        'Llama 3.3', 'Qwen2.5-72B', 'Qwen2.5-7B', 'Llama 4', 'DeepSeek-R1 7B', 'Mistral-8x7B'
    ];
    const level3Scores = [7.00, 6.45, 6.38, 6.33, 6.21, 5.99, 5.74, 5.65, 5.17, 5.05, 5.01, 4.72, 4.62, 3.86, 3.81, 3.48];
    const humanScore = 8.58;

    new Chart(level3ScoreCtx, {
        type: 'bar',
        data: {
            labels: level3Models,
            datasets: [
                {
                    label: 'Level 3',
                    data: level3Scores,
                    backgroundColor: softGreen,
                    borderColor: softGreenBorder,
                    borderWidth: 1
                },
                {
                    label: `Human Score (${humanScore})`,
                    data: new Array(level3Models.length).fill(humanScore),
                    type: 'line',
                    borderColor: '#e74c3c',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Level 3 Score'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    max: 10,
                    title: { display: true, text: 'Score' }
                },
                x: { 
                    ticks: { 
                        maxRotation: 45,
                        font: { size: 9 }
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
                    text: 'Top LLMs for proof generation'
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
                    text: 'Formal proof generation is much harder for LLMs'
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
                    text: 'Correct answer does not imply correct proof'
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
                    text: 'Best-of-n improves proof performance'
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

    // --- NEW: Performance Charts for Level 3 Tasks ---
    // Level 3 Heatmap Chart (True heatmap table visualization)
    const level3HeatmapElement = document.getElementById('level3HeatmapChart');
    if (!level3HeatmapElement) {
        console.error('level3HeatmapChart element not found');
        return;
    }
    
    // Create HTML table instead of chart for true heatmap visualization (transposed layout)
    const heatmapContainer = level3HeatmapElement.parentElement;
    heatmapContainer.innerHTML = `
        <div style="
            width: 100%;
            overflow-x: auto; 
            background: white; 
            border-radius: 16px; 
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); 
            padding: 24px;
            margin: 0;
            position: relative;
        ">
            <div style="position: relative; z-index: 1;">
                <h3 style="
                    text-align: center; 
                    margin: 0 0 20px 0; 
                    color: #2d3748; 
                    font-size: 24px; 
                    font-weight: 700;
                    letter-spacing: -0.5px;
                ">Level 3 Performance Heatmap</h3>
                
                <div style="
                    background: white;
                    border-radius: 12px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    max-width: 100%;
                    position: relative;
                ">
                    <table id="heatmapTable" style="
                        width: calc(180px + 17 * 70px); 
                        border-collapse: collapse; 
                        font-size: 10px; 
                        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
                        margin: 0;
                        background: white;
                        table-layout: fixed;
                        min-width: 1370px;
                    ">
                        <thead>
                            <tr style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);">
                                <th style="
                                    padding: 12px 16px; 
                                    text-align: left; 
                                    border-right: 2px solid rgba(255, 255, 255, 0.1);
                                    font-weight: 700; 
                                    width: 180px;
                                    color: white;
                                    font-size: 11px;
                                    position: sticky;
                                    left: 0;
                                    z-index: 20;
                                    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
                                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                                    box-shadow: 2px 0 4px rgba(0,0,0,0.1);
                                ">Domain</th>
                            </tr>
                        </thead>
                        <tbody id="heatmapTableBody">
                        </tbody>
                    </table>
                </div>
                
                <div style="
                    margin-top: 20px;
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 16px 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                ">
                    <div style="
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        gap: 24px;
                        flex-wrap: wrap;
                    ">
                        <span style="font-size: 14px; color: #2d3748; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">Score Scale:</span>
                        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 16px; background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                                <span style="font-size: 11px; color: #4a5568; font-weight: 600;">≤3.0</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 16px; background: #c6f6d5; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                                <span style="font-size: 11px; color: #4a5568; font-weight: 600;">4.0</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 16px; background: #68d391; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                                <span style="font-size: 11px; color: #4a5568; font-weight: 600;">6.0</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 16px; background: #38a169; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                                <span style="font-size: 11px; color: #4a5568; font-weight: 600;">8.0</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="width: 24px; height: 16px; background: #2f855a; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                                <span style="font-size: 11px; color: #4a5568; font-weight: 600;">≥9.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Transposed heatmap data - domains and models (横向布局，包含所有模型)
    const heatmapModels = [
        'Human Expert', 'GPT-4.1', 'Claude 3.7 Sonnet', 'GPT-4.1 Mini', 'DeepSeek-V3',
        'Gemini 2.5 Flash', 'Gemini 2.0 Flash', 'GPT-4.1 Nano', 'GLM-4-32B', 'GLM-4-9B',
        'Claude 3.5 Sonnet', 'Llama 3.3', 'Qwen2.5-72B', 'Qwen2.5-7B', 'Llama 4',
        'DeepSeek-R1 7B', 'Mixtral-8x7B'
    ];
    
    const heatmapDomains = [
        'Redundant Info (Original)',
        'Redundant Info (Rewritten)', 
        'Multi-objective (Original)',
        'Multi-objective (Rewritten)',
        'Knowledge (Original)',
        'Knowledge (Rewritten)',
        'Uncertainty (Original)', 
        'Uncertainty (Rewritten)',
        'Average (Original)',
        'Average (Rewritten)'
    ];
    
    // Original data matrix (models x domains) - 包含所有17个模型
    const originalData = [
        [9.134, 9.064, 8.295, 8.370, 8.701, 8.590, 8.782, 8.921, 8.552, 8.736], // Human Expert
        [8.334, 8.365, 7.419, 7.290, 6.598, 6.437, 6.081, 5.916, 7.108, 7.002], // GPT-4.1
        [8.349, 8.185, 6.096, 6.716, 6.229, 5.529, 5.951, 5.351, 6.656, 6.445], // Claude 3.7 Sonnet
        [7.793, 7.528, 6.880, 6.203, 6.179, 5.984, 6.322, 5.798, 6.793, 6.378], // GPT-4.1 Mini
        [7.561, 7.570, 6.375, 6.521, 5.850, 5.862, 5.369, 5.361, 6.289, 6.329], // DeepSeek-V3
        [8.320, 7.652, 6.434, 6.263, 4.746, 5.533, 5.287, 5.383, 6.197, 6.208], // Gemini 2.5 Flash
        [6.878, 7.015, 6.188, 6.067, 6.145, 5.892, 5.370, 4.990, 6.145, 5.991], // Gemini 2.0 Flash
        [7.118, 6.536, 6.080, 6.154, 5.236, 5.206, 5.438, 5.058, 5.968, 5.738], // GPT-4.1 Nano
        [6.937, 6.583, 5.902, 5.579, 4.512, 5.715, 5.110, 4.733, 5.615, 5.653], // GLM-4-32B
        [5.796, 5.959, 4.813, 5.399, 4.397, 4.734, 4.328, 4.586, 4.833, 5.169], // GLM-4-9B
        [6.444, 6.271, 5.774, 5.190, 4.173, 4.531, 4.520, 4.204, 5.228, 5.049], // Claude 3.5 Sonnet
        [5.840, 5.995, 4.965, 5.072, 4.385, 4.673, 4.157, 4.290, 4.837, 5.008], // Llama 3.3
        [6.075, 5.696, 4.896, 4.819, 4.479, 4.313, 4.289, 4.061, 4.935, 4.722], // Qwen2.5-72B
        [5.094, 5.541, 4.688, 4.731, 3.934, 4.218, 3.641, 3.988, 4.339, 4.619], // Qwen2.5-7B
        [5.562, 5.753, 3.076, 3.311, 3.519, 3.081, 2.912, 3.299, 3.767, 3.861], // Llama 4
        [5.051, 5.168, 4.015, 3.541, 3.254, 3.621, 3.853, 2.910, 4.043, 3.810], // DeepSeek-R1 7B
        [3.678, 4.443, 3.504, 3.319, 3.318, 3.248, 2.311, 2.893, 3.203, 3.476]  // Mixtral-8x7B
    ];
    
    // Transpose the data matrix (domains x models)
    const heatmapData = heatmapDomains.map((domain, domainIndex) =>
        heatmapModels.map((model, modelIndex) => originalData[modelIndex][domainIndex])
    );

    // Function to get color based on value with improved gradient
    function getHeatmapColor(value) {
        const clampedValue = Math.max(2, Math.min(9.5, value));
        
        if (clampedValue <= 3) {
            return '#f7fafc'; // Very light gray for low scores
        } else if (clampedValue <= 4) {
            return '#c6f6d5'; // Light green
        } else if (clampedValue <= 5) {
            return '#9ae6b4'; // Medium light green
        } else if (clampedValue <= 6) {
            return '#68d391'; // Medium green
        } else if (clampedValue <= 7) {
            return '#48bb78'; // Medium dark green
        } else if (clampedValue <= 8) {
            return '#38a169'; // Dark green
        } else {
            return '#2f855a'; // Very dark green for high scores
        }
    }

    // Function to get text color based on background
    function getTextColor(value) {
        return value > 6.5 ? 'white' : '#2d3748';
    }

    // Add model names as column headers dynamically
    const thead = document.querySelector('#heatmapTable thead tr');
    heatmapModels.forEach((model, index) => {
        const th = document.createElement('th');
        th.textContent = model;
        th.style.cssText = `
            padding: 8px 4px; 
            text-align: center; 
            ${index < heatmapModels.length - 1 ? 'border-right: 1px solid rgba(255, 255, 255, 0.1);' : ''}
            font-weight: 600; 
            color: white;
            font-size: 8px;
            width: 70px;
            max-width: 70px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            line-height: 1.1;
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        thead.appendChild(th);
    });
    
    // Populate the table with transposed data
    const tbody = document.getElementById('heatmapTableBody');
    heatmapDomains.forEach((domain, domainIndex) => {
        const row = document.createElement('tr');
        row.style.cssText = `
            ${domainIndex % 2 === 0 ? 'background: rgba(248, 250, 252, 0.5);' : 'background: white;'}
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(226, 232, 240, 0.3);
        `;
        
        // Add sophisticated hover effect
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = domainIndex % 2 === 0 ? 'rgba(248, 250, 252, 0.5)' : 'white';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Domain name cell (first column)
        const domainCell = document.createElement('td');
        domainCell.textContent = domain;
        domainCell.style.cssText = `
            padding: 10px 16px; 
            text-align: left; 
            border-right: 2px solid rgba(226, 232, 240, 0.3);
            font-weight: 700; 
            background: ${domainIndex % 2 === 0 ? 'rgba(248, 250, 252, 1)' : 'white'};
            color: #2d3748;
            font-size: 10px;
            position: sticky;
            left: 0;
            z-index: 15;
            text-shadow: 0 1px 2px rgba(0,0,0,0.05);
            width: 180px;
            box-shadow: 2px 0 4px rgba(0,0,0,0.05);
        `;
        row.appendChild(domainCell);
        
        // Data cells (one for each model)
        heatmapData[domainIndex].forEach((value, modelIndex) => {
            const cell = document.createElement('td');
            cell.textContent = value.toFixed(2);
            const bgColor = getHeatmapColor(value);
            const textColor = getTextColor(value);
            
            cell.style.cssText = `
                padding: 8px 4px; 
                text-align: center; 
                ${modelIndex < heatmapData[domainIndex].length - 1 ? 'border-right: 1px solid rgba(226, 232, 240, 0.2);' : ''}
                background: ${bgColor}; 
                color: ${textColor};
                font-weight: 700;
                font-size: 9px;
                position: relative;
                text-shadow: ${value > 6.5 ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'};
                transition: all 0.2s ease;
                width: 70px;
                max-width: 70px;
            `;
            
            // Add subtle hover effect for cells
            cell.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.zIndex = '10';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                this.style.borderRadius = '4px';
            });
            
            cell.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.zIndex = 'auto';
                this.style.boxShadow = 'none';
                this.style.borderRadius = '0';
            });
            
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
    
    // Initialize correlation analysis charts
    initCorrelationCharts();

}

// --- Correlation Analysis Charts ---
function initCorrelationCharts() {
    // Correlation data matching the scatter plot
    const correlationData = [
        { model: "GPT-4.1", level12Avg: 0.85, level3Score: 7.0, color: "#DEB4B5" },
        { model: "Claude 3.7 Sonnet", level12Avg: 0.82, level3Score: 6.5, color: "#DEB4B5" },
        { model: "GPT-4.1 Mini", level12Avg: 0.78, level3Score: 6.4, color: "#DEB4B5" },
        { model: "DeepSeek-V3", level12Avg: 0.81, level3Score: 6.3, color: "#8CB8D3" },
        { model: "Gemini 2.5 Flash", level12Avg: 0.92, level3Score: 6.2, color: "#8CB8D3" },
        { model: "Gemini 2.0 Flash", level12Avg: 0.81, level3Score: 6.0, color: "#8CB8D3" },
        { model: "GPT-4.1 Nano", level12Avg: 0.78, level3Score: 5.5, color: "#8CB8D3" },
        { model: "GLM-4-32B", level12Avg: 0.76, level3Score: 5.7, color: "#8CB8D3" },
        { model: "GLM-4-9B", level12Avg: 0.66, level3Score: 5.2, color: "#8CB8D3" },
        { model: "Claude 3.5 Sonnet", level12Avg: 0.88, level3Score: 5.0, color: "#8CB8D3" },
        { model: "Llama 3.3", level12Avg: 0.68, level3Score: 5.0, color: "#8CB8D3" },
        { model: "Qwen2.5-72B", level12Avg: 0.70, level3Score: 4.7, color: "#8CB8D3" },
        { model: "Qwen2.5-7B", level12Avg: 0.62, level3Score: 4.6, color: "#8CB8D3" },
        { model: "Llama 4", level12Avg: 0.88, level3Score: 3.8, color: "#DEB4B5" },
        { model: "DeepSeek-R1 7B", level12Avg: 0.66, level3Score: 3.8, color: "#DEB4B5" },
        { model: "Mixtral-8x7B", level12Avg: 0.52, level3Score: 3.5, color: "#8CB8D3" }
    ];

    // Chart 1: Correlation Scatter Plot with regression line
    const correlationCtx = document.getElementById('correlationScatterChart');
    if (correlationCtx) {
        // Calculate regression line
        const n = correlationData.length;
        const sumX = correlationData.reduce((sum, d) => sum + d.level12Avg, 0);
        const sumY = correlationData.reduce((sum, d) => sum + d.level3Score, 0);
        const sumXY = correlationData.reduce((sum, d) => sum + d.level12Avg * d.level3Score, 0);
        const sumXX = correlationData.reduce((sum, d) => sum + d.level12Avg * d.level12Avg, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Generate regression line points
        const regressionPoints = [
            { x: 0.5, y: slope * 0.5 + intercept },
            { x: 0.95, y: slope * 0.95 + intercept }
        ];

        new Chart(correlationCtx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Highlighted Models',
                        data: correlationData.filter(d => d.color === "#DEB4B5").map(d => ({
                            x: d.level12Avg,
                            y: d.level3Score,
                            modelName: d.model
                        })),
                        backgroundColor: '#DEB4B5',
                        borderColor: '#DEB4B5',
                        pointRadius: 8,
                        pointHoverRadius: 10
                    },
                    {
                        label: 'Other Models',
                        data: correlationData.filter(d => d.color === "#8CB8D3").map(d => ({
                            x: d.level12Avg,
                            y: d.level3Score,
                            modelName: d.model
                        })),
                        backgroundColor: '#8CB8D3',
                        borderColor: '#8CB8D3',
                        pointRadius: 8,
                        pointHoverRadius: 10
                    },
                    {
                        label: 'Regression Line',
                        data: regressionPoints,
                        type: 'line',
                        borderColor: 'rgba(128, 128, 128, 0.8)',
                        backgroundColor: 'rgba(128, 128, 128, 0.1)',
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        showLine: true,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        filter: function(tooltipItem) {
                            return tooltipItem.datasetIndex < 2; // Only show tooltip for data points, not regression line
                        },
                        callbacks: {
                            title: function(context) {
                                return context[0].raw.modelName;
                            },
                            label: function(context) {
                                return [
                                    `Level 1&2 Avg: ${(context.raw.x * 100).toFixed(0)}%`,
                                    `Level 3 Score: ${context.raw.y.toFixed(1)}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Average Accuracy (Level 1 & 2)',
                            font: { size: 14, weight: 'bold' }
                        },
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            }
                        },
                        min: 0.5,
                        max: 0.95,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Level 3 Score',
                            font: { size: 14, weight: 'bold' }
                        },
                        min: 3.2,
                        max: 7.2,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                }
            }
        });
    }

    // Chart 2: Model Comparison with Text Content
    const performanceCtx = document.getElementById('performanceComparisonChart');
    if (performanceCtx) {
                 // Replace the canvas with HTML content for text display
         const chartContainer = performanceCtx.parentElement;
         chartContainer.innerHTML = `
             <div style="
                 background: #f8f9fa;
                 border: 1px solid #e9ecef;
                 border-radius: 8px;
                 padding: 20px;
                 height: 400px;
                 overflow-y: auto;
                 font-family: 'Google Sans', sans-serif;
             ">
                 <!-- Controls and Legend -->
                 <div style="
                     display: flex;
                     justify-content: space-between;
                     align-items: center;
                     margin-bottom: 20px;
                     flex-wrap: wrap;
                     gap: 15px;
                 ">
                     <!-- Individual Toggle Buttons -->
                     <div style="
                         display: flex;
                         flex-wrap: wrap;
                         gap: 8px;
                         align-items: center;
                     ">
                         <span style="font-size: 11px; font-weight: 600; margin-right: 5px;">Highlights:</span>
                         <button class="capability-toggle" data-capability="info-extraction" onclick="toggleSpecificCapability('info-extraction')" style="
                             background: #F5E6B8;
                             color: #333;
                             border: 2px solid #E6D09B;
                             padding: 4px 8px;
                             border-radius: 4px;
                             cursor: pointer;
                             font-size: 10px;
                             font-weight: 600;
                             transition: all 0.3s ease;
                         ">Info Extract</button>
                         <button class="capability-toggle" data-capability="multi-objective" onclick="toggleSpecificCapability('multi-objective')" style="
                             background: #B8D4E3;
                             color: #333;
                             border: 2px solid #9BC4D6;
                             padding: 4px 8px;
                             border-radius: 4px;
                             cursor: pointer;
                             font-size: 10px;
                             font-weight: 600;
                             transition: all 0.3s ease;
                         ">Multi-obj</button>
                         <button class="capability-toggle" data-capability="uncertainty" onclick="toggleSpecificCapability('uncertainty')" style="
                             background: #E8C5C5;
                             color: #333;
                             border: 2px solid #DBB0B0;
                             padding: 4px 8px;
                             border-radius: 4px;
                             cursor: pointer;
                             font-size: 10px;
                             font-weight: 600;
                             transition: all 0.3s ease;
                         ">Uncertainty</button>
                         <button class="capability-toggle" data-capability="domain-reasoning" onclick="toggleSpecificCapability('domain-reasoning')" style="
                             background: #C5E8C5;
                             color: #333;
                             border: 2px solid #A8D8A8;
                             padding: 4px 8px;
                             border-radius: 4px;
                             cursor: pointer;
                             font-size: 10px;
                             font-weight: 600;
                             transition: all 0.3s ease;
                         ">Domain Reason</button>
                         <button onclick="toggleAllCapabilities()" style="
                             background: #6c757d;
                             color: white;
                             border: none;
                             padding: 4px 8px;
                             border-radius: 4px;
                             cursor: pointer;
                             font-size: 10px;
                             font-weight: 600;
                             transition: all 0.3s ease;
                             margin-left: 10px;
                         ">All On/Off</button>
                     </div>
                 </div>

                 <!-- GPT-4.1 Section -->
                 <div style="
                     background: white;
                     border: 1px solid #ddd;
                     border-radius: 8px;
                     padding: 15px;
                     margin-bottom: 15px;
                 ">
                     <div style="
                         display: flex;
                         align-items: center;
                         margin-bottom: 10px;
                     ">
                         <div style="
                             width: 24px;
                             height: 24px;
                             background: #333;
                             border-radius: 50%;
                             margin-right: 10px;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                             color: white;
                             font-size: 12px;
                             font-weight: bold;
                         ">⚙</div>
                         <strong style="font-size: 16px;">GPT-4.1</strong>
                         <span style="
                             margin-left: auto;
                             background: #e8f5e8;
                             color: #2d5a2d;
                             padding: 4px 8px;
                             border-radius: 4px;
                             font-size: 12px;
                             font-weight: bold;
                         ">Avg. Score: 8.25/10</span>
                     </div>
                     <div id="gpt41Content" style="font-size: 13px; line-height: 1.5;">
                         We evaluate the impact of opening gated communities using a multi-level metric framework.<br>
                         <span class="capability-highlight info-extraction"> At the network level, we define indicators such as road density, node degree, connectivity index, and betweenness centrality.<br>
                         At the corridor and intersection level, we include delay, throughput, and LOS classification.<br>
                                                   At the macro level, we assess total travel time, vehicle-kilometers traveled, emissions, and safety risks like crash hotspots <strong>(Information Extraction: 9/10)</strong></span>.<br>
                          <span class="capability-highlight multi-objective"> We analyze trade-offs between increased access and new bottlenecks, and evaluate efficiency vs. safety in scenario outcomes <strong>(Multi-objective Decision-making: 7.5/10)</strong></span>.<br>
                          <span class="capability-highlight uncertainty"> Sensitivity analysis is conducted under varying traffic volumes during peak/off-peak hours, using both static and dynamic traffic assignment models <strong>(Uncertainty Handling: 8/10)</strong></span>.<br>
                          <span class="capability-highlight domain-reasoning">The road network is modeled as a graph, with intersections as nodes and roads as edges. We simulate different configurations using tools like SUMO and MATSim to support policy decisions <strong>(Domain-specific Reasoning: 8.5/10)</strong></span>.
                     </div>
                 </div>

                 <!-- Llama 4 Section -->
                 <div style="
                     background: white;
                     border: 1px solid #ddd;
                     border-radius: 8px;
                     padding: 15px;
                 ">
                     <div style="
                         display: flex;
                         align-items: center;
                         margin-bottom: 10px;
                     ">
                         <div style="
                             width: 24px;
                             height: 24px;
                             background: #007BFF;
                             border-radius: 50%;
                             margin-right: 10px;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                             color: white;
                             font-size: 12px;
                             font-weight: bold;
                         ">∞</div>
                         <strong style="font-size: 16px;">Llama 4</strong>
                         <span style="
                             margin-left: auto;
                             background: #ffe8e8;
                             color: #8B0000;
                             padding: 4px 8px;
                             border-radius: 4px;
                             font-size: 12px;
                             font-weight: bold;
                         ">Avg. Score: 3.5/10</span>
                     </div>
                     <div id="llama4Content" style="font-size: 13px; line-height: 1.5;">
                                                   To evaluate the traffic impact of opening communities, <span class="capability-highlight info-extraction">we suggest measuring indicators such as average travel time, vehicle speed, traffic volume, intersection delay, and congestion index <strong>(Information Extraction: 6/10)</strong>.<br>
                          <span style="color: #888; font-style: italic;">These metrics help assess traffic flow and efficiency but do not include environmental or safety dimensions</span> <span style="color: red; font-weight: bold;">✗</span>.<br></span>
                          <span class="capability-highlight multi-objective"><span style="color: #888; font-style: italic;">We do not explicitly model trade-offs or consider the balance between multiple objectives like safety and efficiency</span> <span style="color: red; font-weight: bold;">🚫</span> <strong>(Multi-objective Decision-making: 0/10)</strong></span>.<br>
                          <span class="capability-highlight uncertainty">Traffic volume and peak hour patterns are mentioned as contextual factors, <span style="color: #888; font-style: italic;">but no modeling or sensitivity analysis is performed</span> <strong>(Uncertainty Handling: 4/10)</strong></span>.<br>
                          <span class="capability-highlight domain-reasoning">We propose using network analysis tools and traffic simulation models (e.g., VISSIM, SUMO), <span style="color: #888; font-style: italic;">but we do not describe how the models are constructed or used</span> <strong>(Domain-specific Reasoning: 4/10)</strong></span>.
                     </div>
                 </div>
             </div>
         `;
         
                  // Add CSS for capability highlights
         const style = document.createElement('style');
         style.textContent = `
             .capability-highlight {
                 padding: 2px 4px;
                 border-radius: 2px;
                 font-weight: 600;
                 transition: all 0.3s ease;
             }
             .capability-highlight.info-extraction {
                 background: #F5E6B8;
             }
             .capability-highlight.multi-objective {
                 background: #B8D4E3;
             }
             .capability-highlight.uncertainty {
                 background: #E8C5C5;
             }
             .capability-highlight.domain-reasoning {
                 background: #C5E8C5;
             }
             .capability-highlight.info-extraction.hidden {
                 background: transparent !important;
             }
             .capability-highlight.multi-objective.hidden {
                 background: transparent !important;
             }
             .capability-highlight.uncertainty.hidden {
                 background: transparent !important;
             }
             .capability-highlight.domain-reasoning.hidden {
                 background: transparent !important;
             }
             .capability-toggle.disabled {
                 opacity: 0.4;
                 border-style: dashed !important;
             }
         `;
         document.head.appendChild(style);
     }
 }

 // Global functions for toggling individual capability highlights
 function toggleSpecificCapability(capabilityType) {
     const highlights = document.querySelectorAll(`.capability-highlight.${capabilityType}`);
     const toggleButton = document.querySelector(`[data-capability="${capabilityType}"]`);
     
     if (!highlights.length || !toggleButton) return;
     
     const isHidden = highlights[0].classList.contains('hidden');
     
     highlights.forEach(highlight => {
         if (isHidden) {
             highlight.classList.remove('hidden');
         } else {
             highlight.classList.add('hidden');
         }
     });
     
     // Update button appearance
     if (isHidden) {
         toggleButton.classList.remove('disabled');
     } else {
         toggleButton.classList.add('disabled');
     }
 }

 function toggleAllCapabilities() {
     const allButtons = document.querySelectorAll('.capability-toggle');
     const allHighlights = document.querySelectorAll('.capability-highlight');
     
     if (!allButtons.length) return;
     
     // Check if any capability is currently enabled
     const anyEnabled = Array.from(allButtons).some(btn => !btn.classList.contains('disabled'));
     
     // Toggle all capabilities
     ['info-extraction', 'multi-objective', 'uncertainty', 'domain-reasoning'].forEach(capability => {
         const highlights = document.querySelectorAll(`.capability-highlight.${capability}`);
         const button = document.querySelector(`[data-capability="${capability}"]`);
         
         if (anyEnabled) {
             // Turn all off
             highlights.forEach(h => h.classList.add('hidden'));
             if (button) button.classList.add('disabled');
         } else {
             // Turn all on
             highlights.forEach(h => h.classList.remove('hidden'));
             if (button) button.classList.remove('disabled');
         }
     });
 }