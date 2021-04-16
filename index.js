/**
 * JavaScript dataset creation algorithm:
 * 
 * Data generated on Repl.it
 * 
 * Must be run multiple times due to rate limiting
 */


// API Endpoint: https://api.github.com/search/repositories?q=language:<language>&order=desc

// List of languages (as YAML): https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml
// YAML-JSON Converter: https://www.convertjson.com/yaml-to-json.htm

// After retrieving the JSON, I put it into langs.json
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('data.json'));


let langsList = JSON.parse(fs.readFileSync('langs.json'));

// The below code is used to modify the langs.json file to be smaller and only contain needed information. Code below this that is commented out should be commented out when running this section.
/*
let listTemp = {};
for(let i in langsList) {
    if (langsList[i].type == "programming")listTemp[i] = langsList[i];
}
fs.writeFileSync("langs.json", JSON.stringify(Object.keys(listTemp)));*/

// The following code writes to the actual data file. 

// Print percent complete at start
console.log(`Start percent: ${Object.keys(data).length / langsList.length * 100}%`)

const fetch = require('node-fetch');

/**
 * Function to get a language's popularity
 */
function getLang(value) {
    fetch(`https://api.github.com/search/repositories?q=language:${encodeURIComponent(value.split(" ").join("-"))}&order=desc`).then(n=>n.json()).then(n=>{
        if("total_count" in n) {
            data[value] = n.total_count;
            console.log(`${value}: ${n.total_count}`);
            fs.writeFileSync("data.json", JSON.stringify(data));
        }
    });
}

// Get popularity of languages not in data file
for(let lang of langsList)if(!(lang in data))getLang(lang);