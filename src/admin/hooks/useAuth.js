export const getToken = () => {
    return localStorage.getItem('alhady_admin_token');
};

export const setToken = (token) => {
    localStorage.setItem('alhady_admin_token', token);
};

export const clearToken = () => {
    localStorage.removeItem('alhady_admin_token');
};
