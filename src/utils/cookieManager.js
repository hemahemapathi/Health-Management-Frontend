export const cookieManager = {
    set: (name, value, days) => {
      const secure = window.location.protocol === 'https:';
      document.cookie = `${name}=${value}; Path=/; SameSite=Strict; Secure=${secure}; max-age=${days * 24 * 60 * 60}`;
    },
    
    get: (name) => {
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith(name + '='));
      return cookie ? cookie.split('=')[1] : null;
    },
    
    remove: (name) => {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
  };
  