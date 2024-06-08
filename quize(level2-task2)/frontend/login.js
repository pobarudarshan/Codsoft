document.getElementById('login-form').addEventListener('submit', async(e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            // Decode the token to get the user role
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            if (payload.role === 'admin') {
                window.location.href = './admin.html';
            } else {
                window.location.href = './index.html';
            }
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});