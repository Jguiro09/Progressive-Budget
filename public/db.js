let db;
let budgetVersion;

// Creating the budget database within the IndexDB
const request = indexedDB.open('budgetDB', budgetVesion || 21);

// Checks if an update is needed, if it is needed we update the database
request.onupgradeneeded = e => {
    const newVersion = e.newVersion || db.version;

    console.log(`DB Version is now: ${newVersion}`)

    db = e.target.result;

    if(db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {autoIncrement: true})
    }
};

// Error handling
request.onerror = function (e) {
    console.log(e.target.errorCode)
};

// Inputting any info from the database into API (if theres any)
function checkDatabase () {
    // Creates a transaction for our database (A transaction is a method within IDBDatabase that will return a "Transaction" object with our objectstore within it.)
    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    // Accessing our "BudgetStore" object specifically within our transaction
    const store = transaction.objectStore('BudgetStore');

    // Gets all the records within our 'BudgetStore' so we can store it into our API
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'applcation/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((res) => {
                if (res.length !== 0) {
                    transaction = db.transaction(['BudgetStore'], 'readwrite');

                    const currentStore = transaction.objectStore('BudgetStore');

                    currentStore.clear();
                    console.log('Clearing!');
                }
            })
        }
    }
}