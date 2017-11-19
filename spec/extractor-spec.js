const extractor = require('../extractor');

describe("Tester les crtieriae", () => {
    let criteriaeBuilder;

    beforeEach(() => {
        criteriaeBuilder = extractor.createCriteriaeBuilder();
    });

    it("doit retourner une nouvelle instance de criteriaa builder", () => {
        // WHEN
        const nouvelleInstance = extractor.createCriteriaeBuilder();

        // THEN
        expect(nouvelleInstance).not.toBe(criteriaeBuilder);
    });

    it("doit créer un critera", () => {
        // WHEN
        const criteria = criteriaeBuilder.buildCriteria("key", "humanValue", "filter");

        // THEN
        expect(criteria).toEqual({key: 'key', humanValue: 'humanValue', keyFilter: 'filter'});
    });

    it("doit ajouter un critera avec le filtre par défaut", () => {     
        // WHEN
        criteriaeBuilder.appendCriteria("key", "humanValue");

        // THEN
        expect(criteriaeBuilder.criteriaValues.length).toBe(1);

        const critera = criteriaeBuilder.criteriaValues[0];
        expect(critera.key).toBe("key");
        expect(critera.humanValue).toBe("humanValue");
        expect(critera.keyFilter("key")).toBeTruthy();
        expect(critera.keyFilter("key-false")).toBeFalsy();
    })

    it("doit ajouter un critera avec le filtre définit", () => {     
        // WHEN
        criteriaeBuilder.appendCriteria("key", "humanValue", key => key === "ma clef");

        // THEN
        expect(criteriaeBuilder.criteriaValues.length).toBe(1);

        const critera = criteriaeBuilder.criteriaValues[0];
        expect(critera.key).toBe("key");
        expect(critera.humanValue).toBe("humanValue");
        expect(critera.keyFilter("ma clef")).toBeTruthy();
        expect(critera.keyFilter("key")).toBeFalsy();
    })

    it("doit retourner la liste des criterae", () => {
        // GIVEN
        criteriaeBuilder.appendCriteria("key", "humanValue");

        // WHEN
        const criterae = criteriaeBuilder.build();

        // THEN
        expect(criterae.length).toBe(1);

        const critera = criteriaeBuilder.criteriaValues[0];
        expect(critera.key).toBe("key");
        expect(critera.humanValue).toBe("humanValue");
    });
});

describe("Tester l'extraction des filtres", () => {
    it("doit filtrer les filters suivant les criterae", () => {
        // GIVEN
        const criteriae = extractor.createCriteriaeBuilder()
            .appendCriteria('key-gardee', "human key-gardee")
            .build();

        const filters = {
            'key-gardee': 'key-gardee value',
            'key-exclue': 'key-exclue value'
        };
            
        // WHEN
        const filter_gardees = extractor.createExtractorParser()
            .withFiltersAndValues(filters)
            .withCriteriae(criteriae)
            .parse()
            .getResult();
        
        // THEN
        expect(filter_gardees.length).toBe(1);

        const filter_gardee = filter_gardees[0];
        expect(filter_gardee).toEqual({'human key-gardee': "key-gardee value"});
    });
});