const DB_NAME = "Bmw";
const TABLE_NAME = "users";
const readwrite = "readwrite"
const readonly = "readonly"

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(TABLE_NAME)) {
                db.createObjectStore(TABLE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log("db opened");
            resolve(db);
        };

        request.onerror = (event) => {
            console.error("error:", event.target.error);
            reject(event.target.error);
        };
    });
}


async function checkIfUserExist(gmail) {
    const db = await openDB();
    const tx = db.transaction(TABLE_NAME, readonly);
    const store = tx.objectStore(TABLE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const user = request.result.find(user => user.gmail === gmail);
            resolve(user);
        };
        request.onerror = () => reject(request.error);
    });
}

async function add(data) {
    const existingUser = await checkIfUserExist(data.gmail);
    if (existingUser) {
        console.log("User already exists:", existingUser);
        return;
    }

    const db = await openDB();
    const tx = db.transaction(TABLE_NAME, readwrite);
    const store = tx.objectStore(TABLE_NAME);
    const request = store.add(data);

    request.onsuccess = (e) => {
        console.log("Added:", { id: e.target.result, ...data });
    };
    request.onerror = (e) => console.error("Add error:", e.target.error);
}


async function deleteById(id) {
    const db = await openDB();
    const tx = db.transaction(TABLE_NAME, readwrite);
    const store = tx.objectStore(TABLE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => console.log("user deleted", id);
    request.onerror = (e) => console.error("erorr", id, e.target.error);
}

async function deleteAll() {
    const db = await openDB();
    const tx = db.transaction(TABLE_NAME, readwrite);
    const store = tx.objectStore(TABLE_NAME);

    const request = store.clear();

    request.onsuccess = () => console.log("data cleared");
    request.onerror = (e) => console.error("erorr", e.target.error);
}
// const user = {
//     name: "mohamed Abbas",
//     age: 22,
//     gmail: "mohamed123@gmail.com",
//     postion: "developer"
// }
// const user1 = {
//     name: "ahmed Abbas",
//     age: 25,
//     gmail: "ahmed@gmail.com",
//     postion: "Doctor"
// }
// add(user);
// add(user1);

// deleteById(30);


deleteAll();
