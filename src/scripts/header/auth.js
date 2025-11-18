const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const removeAccessToken = () => {
    localStorage.removeItem('accessToken');
};

const logout = () => {
    removeAccessToken();
    window.location.href = '/auth';
};

const getCurrentUser = async () => {
    const token = getAccessToken();
    if (!token) return null;

    const query = `
    query GetCurrentUser {
      me {
        id
        email
        phoneNumber
        name
        profile {
          id
          company
        }
      }
    }
  `;

    try {
        const graphqlUrl = window.PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql';
        const response = await fetch(graphqlUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL errors:', result.errors);
            removeAccessToken();
            return null;
        }

        return result.data?.me || null;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        removeAccessToken();
        return null;
    }
};

const updateNavbarUserInfo = (user) => {
    if (!user) return;

    const userName = user.name || user.email || user.phoneNumber || 'کاربر';

    const desktopUserElements = document.querySelectorAll('[data-user-name]');
    desktopUserElements.forEach(el => {
        el.textContent = userName;
    });

    const mobileUserElements = document.querySelectorAll('[data-user-name-mobile]');
    mobileUserElements.forEach(el => {
        el.textContent = userName;
    });
};

const initializeAuth = async () => {
    const token = getAccessToken();

    const loggedInElements = document.querySelectorAll('[data-auth-state="logged-in"]');
    const loggedOutElements = document.querySelectorAll('[data-auth-state="logged-out"]');

    if (token) {
        const user = await getCurrentUser();

        if (user) {
            loggedInElements.forEach(el => el.classList.remove('hidden'));
            loggedOutElements.forEach(el => el.classList.add('hidden'));
            updateNavbarUserInfo(user);
        } else {
            loggedInElements.forEach(el => el.classList.add('hidden'));
            loggedOutElements.forEach(el => el.classList.remove('hidden'));
        }
    } else {
        loggedInElements.forEach(el => el.classList.add('hidden'));
        loggedOutElements.forEach(el => el.classList.remove('hidden'));
    }

    const logoutButtons = document.querySelectorAll('[data-logout-btn]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
};

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuth);
    } else {
        initializeAuth();
    }
}
