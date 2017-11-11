const createCriteriaeBuilder = function () {
    return {
        criteriaValues: [],

        // private
        buildCriteria(key, humanValue, keyFilter) {
            return {
                key,
                humanValue,
                keyFilter
            }
        },

        appendCriteria(key, humanValue, keyFilter = keyFilter => keyFilter === key) {
            this.criteriaValues.push(
                this.buildCriteria(
                    key, 
                    humanValue, 
                    keyFilter
                )
            );
            return this;
        },

        build() {
            return this.criteriaValues;
        },
    }
}

const filterExtractor = function (fromFilter = {}) {
    return {
        filter: fromFilter,

        filterKey: (key, criteriae) => (
            key 
            && criteriae 
            && criteriae.find(criteria => criteria && criteria.keyFilter(key))
        ),

        filterValues: (key, filter) => key && filter && filter[key],

        // private
        applyFilter(action) {
            return this.filter && action && 
                Object.keys(this.filter)
                    .filter(action)
                    .reduce((result, key) => {
                        result[key] = this.filter[key];
                        return result;
                    }, {})
                || {};
        },

        keepFilterWithCriteriae(criteriae = []) {
            this.filter = this.applyFilter(key => this.filterKey(key, criteriae));
            return this;
        },

        keepFilterWithValue() {
            this.filter = this.applyFilter(key => this.filterValues(key, this.filter));
            return this;
        },

        extract() {
            return this.filter;
        },
    }
}

const createExtractorParser = function () {
    return {        
        filtersAndValues: [],
        criteriae: [],
        entries: [],

        filterNotEmpty: (key, filter) => key && filter && filter[key],
        
        withCriteriae(criteriae = []) {
            this.criteriae = criteriae;
            return this;
        },
        
        withFiltersAndValues(filtersAndValues = []) {
            this.filtersAndValues = filtersAndValues;
            return this;
        },

        // private
        extractor: (filterAndValue, criteriae) => {
            return filterExtractor(filterAndValue)
                .keepFilterWithCriteriae(criteriae)
                .extract();
        },

        // private
        createEntry(filter) {
            return this.criteriae
                .filter(criteria => filter && criteria && filter[criteria.key])
                .reduce((result, criteria) => {
                    result[criteria.humanValue] = filter[criteria.key];
                    return result;
                }, {});
        },

        // private
        isNotEmptyFilter(filter) {
            return Object.keys(filter)
                .some(key => this.filterNotEmpty(key, filter));
        },
        
        parse() {
            this.entries = this.filtersAndValues &&
                this.filtersAndValues
                    .filter(filterAndValue => !!filterAndValue)
                    .map(filterAndValue => this.extractor(filterAndValue, this.criteriae))
                    .filter(filter => this.isNotEmptyFilter(filter))
                    .map(filter => this.createEntry(filter))
                || [];
            return this;
        },

        getResult() {
            return this.entries;
        },

        forEach(cusomer/*(err, filter)*/ = null) {
            cusomer && this.entries &&
                this.entries.forEach(entry => cusomer(null, entry));
        },
    }
};

module.exports = {
    createCriteriaeBuilder,
    filterExtractor,
    createExtractorParser,
};