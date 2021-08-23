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

