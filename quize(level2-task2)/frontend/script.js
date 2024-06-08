// List of light, study-friendly colors
const colors = [
    '#f0f8ff', // AliceBlue
    '#e6e6fa', // Lavender
    '#fffacd', // LemonChiffon
    '#f5f5dc', // Beige
    '#f0fff0', // Honeydew
    '#e0ffff', // LightCyan
    '#f5f5f5', // WhiteSmoke
    '#fafad2', // LightGoldenrodYellow
];

// Function to change background color
function changeBackgroundColor() {
    const colorIndex = Math.floor(Math.random() * colors.length);
    document.body.style.backgroundColor = colors[colorIndex];
}

// Change background color every second
setInterval(changeBackgroundColor, 1000);

let currentCategory = '';
let currentQuestions = [];
let answers = [];
let currentPage = 0;

function checkLogin() {
    const token = localStorage.getItem('token');
}


// Logout function to clear the token and redirect to login page
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Fetch categories from the server and populate the dropdown
async function fetchCategories() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found in localStorage');
        }

        const response = await fetch('http://localhost:3000/api/admin/getCategory', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 403) {
                throw new Error(`403 Forbidden: ${errorData.error}`);
            }
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const categorySelect = document.getElementById('category');

        // Clear existing options
        categorySelect.innerHTML = '<option value="">Select Category</option>';

        data.category.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id; // Use category ID as value
            option.textContent = category.name; // Use category name as the displayed text
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert(error.message || 'An error occurred while fetching categories. Please try again later.');
    }
}

// Fetch questions based on the selected category
async function fetchQuestions(category) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found in localStorage');
        }

        console.log('Fetching questions for category:', category);

        const response = await fetch('http://localhost:3000/api/admin/getQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category }) // Sending the selected category to the API
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 403) {
                throw new Error(`403 Forbidden: ${errorData.error}`);
            }
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched questions:', data.question); // Log the questions fetched

        return data.question; // Assuming the API returns { question: [...] }
    } catch (error) {
        console.error('Error fetching questions:', error);
        alert(error.message || 'An error occurred while fetching questions. Please try again later.');
        return [];
    }
}

// Call fetchCategories when the page loads
document.addEventListener('DOMContentLoaded', () => {
    checkLogin(); // Check if user is logged in
    fetchCategories();
    loadQuizState();
});

// Start quiz and fetch questions dynamically
async function startQuiz() {
    const categorySelect = document.getElementById('category');
    currentCategory = categorySelect.value;
    if (!currentCategory) {
        alert('Please select a category.');
        return;
    }

    console.log('Selected Category:', currentCategory); // Log the selected category

    currentQuestions = await fetchQuestions(currentCategory);
    console.log('Loaded Questions for the selected category:', currentQuestions); // Log the loaded questions

    if (!currentQuestions.length) {
        alert('No questions found for the selected category.');
        return;
    }

    answers = new Array(currentQuestions.length).fill(null);
    currentPage = 0;
    document.getElementById('quiz-header').style.display = 'none';
    document.getElementById('quiz-body').style.display = 'block';
    loadQuestions();
    saveQuizState();
}

// Load questions for the current page from currentQuestions
function loadQuestions() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';
    const start = currentPage * 2;
    const end = Math.min(start + 2, currentQuestions.length);

    currentQuestions.slice(start, end).forEach((q, index) => {
        const questionIndex = start + index;
        const questionElement = document.createElement('div');
        questionElement.classList.add('question'); // Add a class for styling purposes
        questionElement.innerHTML = `
        <p><strong>Question ${questionIndex + 1}:</strong> ${q.question}</p>
        `;

        // Loop through options and add radio buttons and labels
        q.options.forEach((opt, j) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option'); // Add a class for styling purposes
            optionElement.innerHTML = `
                <input type="radio" name="question${questionIndex}" value="${opt}" id="question${questionIndex}-option${j}" ${answers[questionIndex] === opt ? 'checked' : ''}>
                <label for="question${questionIndex}-option${j}">${opt}</label>
            `;
            questionElement.appendChild(optionElement);
        });

        questionContainer.appendChild(questionElement);
    });

    document.getElementById('navigation-buttons').style.display = 'block';
    document.getElementById('prev-button').style.display = currentPage === 0 ? 'none' : 'inline';
    document.getElementById('next-button').style.display = end === currentQuestions.length ? 'none' : 'inline';
    document.getElementById('submit-button').style.display = end === currentQuestions.length ? 'inline' : 'none';
}


function nextPage() {
    saveCurrentAnswers();
    currentPage++;
    loadQuestions();
    saveQuizState();
}

function prevPage() {
    saveCurrentAnswers();
    currentPage--;
    loadQuestions();
    saveQuizState();
}

function saveCurrentAnswers() {
    const start = currentPage * 2;
    const end = Math.min(start + 2, currentQuestions.length);
    for (let i = start; i < end; i++) {
        const selectedOption = document.querySelector(`input[name="question${i}"]:checked`);
        if (selectedOption) {
            answers[i] = selectedOption.value;
        }
    }
}

function submitQuiz() {
    saveCurrentAnswers();
    const score = calculateScore();
    const studentName = prompt('Enter your name:');
    if (!studentName) {
        alert('Name is required to submit the quiz.');
        return;
    }
    const studentDetails = { name: studentName, category: currentCategory, score };
    saveResult(studentDetails);

    alert(`Your score is: ${score}`);
    resetQuiz();
}

function calculateScore() {
    let score = 0;
    answers.forEach((answer, index) => {
        if (currentQuestions[index] && answer === currentQuestions[index].answer) {
            score += 1;
        }
    });
    return score;
}

function saveResult(studentDetails) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    fetch('http://localhost:3000/result/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentDetails)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

function resetQuiz() {
    document.getElementById('quiz-header').style.display = 'block';
    document.getElementById('quiz-body').style.display = 'none';
    localStorage.removeItem('quizState');
}

function saveQuizState() {
    const quizState = {
        currentCategory,
        currentQuestions,
        answers,
        currentPage
    };
    localStorage.setItem('quizState', JSON.stringify(quizState));
}

function loadQuizState() {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
        const { currentCategory: savedCategory, currentQuestions: savedQuestions, answers: savedAnswers, currentPage: savedPage } = JSON.parse(savedState);
        if (savedCategory && savedQuestions && savedAnswers) {
            currentCategory = savedCategory;
            currentQuestions = savedQuestions;
            answers = savedAnswers;
            currentPage = savedPage;
            console.log("Loaded Saved State - Category:", currentCategory);
            console.log("Loaded Saved Questions:", currentQuestions);
            document.getElementById('quiz-header').style.display = 'none';
            document.getElementById('quiz-body').style.display = 'block';
            loadQuestions();
            alert('Please complete the test!');
        }
    }
}