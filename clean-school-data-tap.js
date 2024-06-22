const fs = require('fs');

console.log('Running clean-schools-data.js');

const DATA_FOLDER_PATH = 'src/data/';
const SOURCE_FILE_NAME = 'schools-api.json';
const DESTINATION_FILE_NAME = 'schools.json';

function cleanSchoolsData() {
    // Read the JSON file at DATA_FOLDER_PATH + SOURCE_FILE_NAME
    readJsonFile(DATA_FOLDER_PATH + SOURCE_FILE_NAME, (err, data) => {
        result = data['Schools'];

        // Loop through result and rename the key "name" to "school"
        result.forEach((school) => {
            school['school'] = school['name'];
            delete school['name'];
        });

        // Trim the school names
        result.forEach((school) => {
            school['school'] = school['school'].trim();
        });

        //add aliases: Los Angeles <-> LA, bidirectionally
        let alias_map = new Map([
            ['LA', 'Los Angeles']
        ]);

        result.forEach((school) => {
            //NOTE: An assumption is being made here that each school will have at most one alias to prevent ballooning results!
            alias_map.forEach((value, key) => {
                let keyRegex = new RegExp("(^|\\s)" + key + "(\\s|$)", "g");
                let replacedKey = school['school'].replace(keyRegex, "$1" + value + "$2");
                if (replacedKey !== school['school']) {
                    school['alias'] = replacedKey;
                } else {
                    let valueRegex = new RegExp("(^|\\s)" + value + "(\\s|$)", "g");
                    let replacedValue = school['school'].replace(valueRegex, "$1" + key + "$2");
                    if (replacedValue !== school['school']) {
                        school['alias'] = replacedValue;
                    }
                }
            });
        });

        saveJsonFile(DATA_FOLDER_PATH + DESTINATION_FILE_NAME, result, (err) => {
            if (err) {
                console.error('Error saving JSON file:', err);
                return;
            }

            console.log('Data cleaned successfully');
        });
    });
}

function readJsonFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            callback(err, null);
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            callback(null, jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            callback(parseError, null);
        }
    });
}

function saveJsonFile(filePath, jsonData, callback) {
    const jsonString = JSON.stringify(jsonData);

    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error saving file:', err);
            callback(err);
            return;
        }

        console.log('File saved successfully:', filePath);
        callback(null);
    });
}


cleanSchoolsData();
