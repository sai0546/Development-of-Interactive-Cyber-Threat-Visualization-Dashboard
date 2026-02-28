const fetch = require('node-fetch');

async function testAdminLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@cybershield.io',
                password: 'admin123'
            })
        });

        const data = await response.json();
        
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('✅ Admin login successful!');
            console.log('Role:', data.role);
            console.log('Token:', data.token ? 'Generated' : 'Missing');
        } else {
            console.log('❌ Admin login failed');
            console.log('Error:', data.message);
        }
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
}

testAdminLogin();