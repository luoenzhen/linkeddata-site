export const baseUri = "https://w3id.org/tern/ontologies/tern/";
const namedGraph = baseUri;

export function getDirectSubclasses(resourceUri) {
  return `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  SELECT DISTINCT ?directChildClass ?hasSubclass
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  WHERE {
    ?directChildClass rdfs:subClassOf <${resourceUri}> .
    ?class sh:targetClass ?directChildClass .
    
    BIND(
        EXISTS {
            ?childClass rdfs:subClassOf <${resourceUri}>
        }
        as ?hasSubclass
    )
  }
  order by ?directChildClass
  `;
}

export function getTopLevelClasses() {
  return `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  select distinct ?class ?hasSubclass
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  where {
      ?_class a sh:NodeShape .
      ?_class sh:targetClass ?class .
      optional {
          ?class rdfs:subClassOf ?parentClass .
          FILTER(isIRI(?parentClass))
      }

      FILTER(!isBlank(?class))
      FILTER(STRSTARTS(STR(?class), "${baseUri}"))

      FILTER NOT EXISTS {
          ?class rdfs:subClassOf ?other .
          FILTER(STRSTARTS(STR(?other), "${baseUri}"))
      }

      BIND(
          EXISTS {
              ?childClass rdfs:subClassOf ?class
          }
          as ?hasSubclass
      )
  }
  ORDER BY ?class
  `;
}

export const getClasses = () => {
  return `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  select distinct ?class
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  where {
    ?_class a sh:NodeShape .
    ?_class sh:targetClass ?class .
  
    filter(!isBlank(?class))
    filter(strstarts(str(?class), "${baseUri}"))
  }
  order by ?class
  `;

  return `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  select distinct ?class
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  where {
    {
      optional { ?class a rdfs:Class }        
    }
    union {
      optional { ?class a owl:Class }        
    }
    union {
        optional { ?class a sh:NodeShape }
    }
  
    filter(!isBlank(?class))
    filter(strstarts(str(?class), "${baseUri}"))
  }
  order by ?class
  `;
};

export function getResource(classUri) {
  return `
  PREFIX tern: <https://w3id.org/tern/ontologies/tern/>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  select *
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  where {
    {
      <${classUri}> ?p ?o .
      filter(!isBlank(?p))
      filter(!isBlank(?o))
    }
    UNION {
      ?class sh:targetClass <${classUri}> .
      ?class ?p ?o .
      filter(!isBlank(?p))
      filter(!isBlank(?o))
      filter(?p != sh:targetClass)
    }
  }
  order by ?p
  `;
}

export function getClassConstraints(classUri) {
  return `
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX tern: <https://w3id.org/tern/ontologies/tern/>

  SELECT ?id ?p ?o ?ppp ?ooo
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  WHERE { 
      ?class sh:targetClass <${classUri}> .
      ?class sh:property ?id .
      ?id ?p ?o .

      OPTIONAL { 
          ?o rdf:rest*/rdf:first ?oo .
          ?oo ?ppp ?ooo .
      }
  }
  `;
}

export function getLabel(resourceUri) {
  return `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  select *
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  where {
      <${resourceUri}> rdfs:label ?label .
  }
  limit 1
`;
}

export function getSuperClasses(resourceUri) {
  return `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX sh: <http://www.w3.org/ns/shacl#>
  select *
  from <http://www.ontotext.com/explicit>
  from <${namedGraph}>
  where {
      <${resourceUri}> rdfs:subClassOf+ ?superclass
      filter(!isBlank(?superclass))
      filter(strstarts(str(?superclass), "${baseUri}"))
  }
  `;
}

export function resourceExists(resourceUri) {
  return `
ask {
  graph <${namedGraph}> {
      <${resourceUri}>  ?p ?o .       
  }
}
`;
}
