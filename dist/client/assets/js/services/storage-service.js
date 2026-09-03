export function createStorageService(key) {
  let available = true;
  return {
    read(){try{return localStorage.getItem(key)}catch(error){available=false;return null}},
    write(value){try{localStorage.setItem(key,value)}catch(error){available=false}},
    remove(){try{localStorage.removeItem(key)}catch(error){available=false}},
    available(){return available}
  };
}
