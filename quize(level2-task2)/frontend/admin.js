document.getElementById('add-category-form').addEventListener('submit', async(e) => {
    e.preventDefault();
    const category = document.getElementById('category').value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/admin/category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: category })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});

document.getElementById('add-question-form').addEventListener('submit', async(e) => {
    e.preventDefault();
    const category = document.getElementById('category_select').value;

    const question = document.getElementById('question').value;
    const options = document.getElementById('options').value.split(',');
    const answer = document.getElementById('answer').value;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/admin/question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category, question, options, answer })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});