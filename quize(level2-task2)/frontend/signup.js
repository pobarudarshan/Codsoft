document.getElementById('signup-form').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = './login.html'; // Redirect to login page after successful signup
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});