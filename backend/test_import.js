async function importDb() {
    try {
        console.log("Triggering DB import...");
        const res = await fetch('http://localhost:5285/api/Auth/import-db');
        const data = await res.text();
        console.log("Response:", res.status, data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}
importDb();
