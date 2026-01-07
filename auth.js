

const API_URL = 'http://localhost:3000/api';

// Enable detailed logging for debugging
const DEBUG = true;

function debugLog(message, data = null) {
    if (DEBUG) {
        console.log('[AUTH DEBUG]', message, data || '');
    }
}

// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    debugLog('Checking authentication:', token ? 'Token exists' : 'No token');
    return token !== null;
}

// Get current user info
function getCurrentUser() {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : null;
}

// Save auth data
function saveAuthData(token, user) {
    debugLog('Saving auth data for user:', user.username);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
}

// Clear auth data
function clearAuthData() {
    debugLog('Clearing auth data');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Verify token with server
async function verifyToken() {
    const token = getAuthToken();
    if (!token) {
        debugLog('No token to verify');
        return false;
    }
    
    try {
        debugLog('Verifying token with server');
        const response = await fetch(`${API_URL}/check-auth`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            debugLog('Token verification failed:', response.status);
            clearAuthData();
            return false;
        }
        
        const data = await response.json();
        debugLog('Token verified successfully');
        return data.authenticated;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// Register function
async function register(formData) {
    debugLog('Starting registration for:', formData.username);
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        debugLog('Registration response status:', response.status);
        const data = await response.json();
        debugLog('Registration response data:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        
        saveAuthData(data.token, data.user);
        debugLog('Registration successful');
        return { success: true, message: data.message, user: data.user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
}

// Login function
async function login(username, password) {
    debugLog('Starting login for:', username);
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        debugLog('Login response status:', response.status);
        const data = await response.json();
        debugLog('Login response data:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        saveAuthData(data.token, data.user);
        debugLog('Login successful');
        return { success: true, message: data.message, user: data.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

// Logout function
async function logout() {
    debugLog('Logging out');
    
    try {
        const token = getAuthToken();
        
        if (token) {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        
        clearAuthData();
        localStorage.removeItem('cart'); // Clear cart on logout
        debugLog('Logout complete, redirecting to home');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        clearAuthData();
        window.location.href = 'index.html';
    }
}

// Create order function
async function createOrder(orderData) {
    debugLog('Creating order');
    
    try {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        
        debugLog('Order creation response status:', response.status);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Order creation failed');
        }
        
        debugLog('Order created successfully:', data.order.id);
        return { success: true, message: data.message, order: data.order };
    } catch (error) {
        console.error('Order creation error:', error);
        return { success: false, error: error.message };
    }
}

// Get user orders
async function getUserOrders() {
    debugLog('Fetching user orders');
    
    try {
        const token = getAuthToken();
        
        if (!token) {
            throw new Error('Not authenticated');
        }
        
        const response = await fetch(`${API_URL}/orders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch orders');
        }
        
        debugLog('Orders fetched successfully:', data.orders.length);
        return { success: true, orders: data.orders };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error.message };
    }
}

// Display user info in navbar (optional)
function displayUserInfo() {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        const navbar = document.querySelector('#navbar .navbar-nav');
        
        if (navbar && user) {
            // Check if user info already exists
            if (!document.getElementById('user-info')) {
                const userInfo = document.createElement('li');
                userInfo.className = 'nav-item dropdown';
                userInfo.id = 'user-info';
                userInfo.innerHTML = `
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <i class="fa-solid fa-user"></i> ${user.name}
                    </a>
                    <ul class="dropdown-menu" style="background-color: rgb(67 0 86);">
                        <li><a class="dropdown-item" href="#" onclick="logout(); return false;">Logout</a></li>
                    </ul>
                `;
                navbar.appendChild(userInfo);
                debugLog('User info added to navbar:', user.name);
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    debugLog('auth.js initialized');
    debugLog('API URL:', API_URL);
    displayUserInfo();
});

// Log that auth.js is loaded
debugLog('auth.js file loaded successfully');