export const storage = {
    local: {
      set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
      get: (key) => JSON.parse(localStorage.getItem(key)),
      remove: (key) => localStorage.removeItem(key)
    },
    
    session: {
      set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
      get: (key) => JSON.parse(sessionStorage.getItem(key)),
      remove: (key) => sessionStorage.removeItem(key)
    }
  };
  