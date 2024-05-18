const fs = require('fs');

console.log('Running clean-phone-data.js');

const DATA_FOLDER_PATH = 'src/data/';
const PHONE_FILE = 'schoolPhones.json';

// Read the JSON file
const phoneData = JSON.parse(fs.readFileSync(DATA_FOLDER_PATH + PHONE_FILE));

const cleanedData = phoneData.map(school => {
    let phoneResult = school.phone_list;

    if (phoneResult == 'NA') {
        phoneResult = '';
    }

    // find all possible phone numbers in the phoneResult string and format them as ###-###-####
    // match phone numbers that are formatted (###) ###-####
    const phoneNumbers = phoneResult.match(/\(\d{3}\) \d{3}-\d{4}/g);

    if (phoneNumbers) {
        phoneNumbers.forEach(phoneNumber => {
            phoneResult = phoneResult.replace(phoneNumber, phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        });
    }

    return {
        ...school,
        phone: phoneResult
    };
});

// Write the updated phoneData back to the JSON file
fs.writeFileSync(DATA_FOLDER_PATH + PHONE_FILE, JSON.stringify(cleanedData, null, 2));


