/**
 * Application
 */
const extractor = require('./extractor');

const filterAndValueArray = [{
    "a": "a value",
    "b": "b value",
    "c": "",
    "d": "d value"
}, {
    "a": "",
    "b": "b value",
    "c": "",
    "d": "d value",
    "e": "e value"
}, {
    "a": "",
    "b": "",
    "c": "",
    "d": ""
}];

const criteriae = 
    extractor.createCriteriaeBuilder()
        .appendCriteria('a', 'la valeur A')
        .appendCriteria('c', 'la valeur c')
        .appendCriteria('d', 'la valeur d')
        .appendCriteria('e', 'la valeur e')
        .build();

const writeFilterObjectToConsole = function(filter) {
    Object.keys(filter)
        .forEach(key => console.log(`${key}: ${filter[key]}`));

    console.log("--------------------");
}        

extractor.createExtractorParser()
    .withFiltersAndValues(filterAndValueArray)
    .withCriteriae(criteriae)
    .parse()
    .forEach((err, filter) => {
        if(err) throw err;
        writeFilterObjectToConsole(filter);
    });

/**
 * Nouvelle execution
 */
console.log("\n");
extractor.createExtractorParser()
    .withFiltersAndValues([{
            "aa": "aa value",
            "bb": "bb value",
            "cc": "",
            "dd": "dd value"
        }, {
            "aa": "",
            "bb": "bb value",
            "cc": "",
            "dd": "dd value",
            "ee": "ee value"
        }, {
            "aa": "",
            "bb": "",
            "cc": "",
            "dd": ""
        }]
    )
    .withCriteriae(
        extractor.createCriteriaeBuilder()
            .appendCriteria('dd', 'la valeur dd')
            .appendCriteria('ee', 'la valeur ee')
            .build()
    )
    .parse()
    .getResult()
    .forEach(writeFilterObjectToConsole);