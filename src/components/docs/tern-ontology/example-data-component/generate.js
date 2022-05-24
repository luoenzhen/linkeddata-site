import { useSparql } from "../../../../data/dataFetcher";

const { hyphenate, uuidv4, getCurrentTime } = require("./utils");

export function useGenerate(
  observableProperty,
  sparqlQuery,
  sparqlEndpoint,
  datasetUri,
  baseObservationUri,
  baseFeatureOfInterestUri,
  exampleData,
  env
) {
  const { data, error } = useSparql(sparqlEndpoint, sparqlQuery);
  if (error) return null;
  if (!data) return null;

  const observableProperties = processData({
    results: {
      bindings: data.results.bindings.filter(
        (row) => row.uri.value === observableProperty
      ),
    },
  });
  const examples = [];

  const seen = [];
  for (const op of observableProperties) {
    if (seen.includes(op.uri)) {
      continue;
    }
    const example = generateObservationExample(
      op,
      datasetUri,
      baseObservationUri,
      baseFeatureOfInterestUri,
      exampleData,
      env
    );
    examples.push(example);
    seen.push(op.uri);
  }

  return examples;
}

function getExampleData(observedPropertyUri, exampleData) {
  // check if observedPropertyUri is in exampleData
  const data = exampleData[observedPropertyUri];
  if (data) {
    return data;
  } else {
    console.warn(`No example data for ${observedPropertyUri}`);
  }
}

function getResultObject(
  valueType,
  hyphenateValue,
  observedPropertyUri,
  observationId,
  baseObservationUri,
  exampleData,
  categoricalCollection = null
) {
  let resultObject = {
    "@id": `${baseObservationUri}/${hyphenateValue}/result`,
  };
  switch (valueType) {
    case "https://w3id.org/tern/ontologies/tern/CategoricalValue":
    case "https://w3id.org/tern/ontologies/tern/IRI":
      resultObject = {
        ...resultObject,
        ...getExampleData(observedPropertyUri, exampleData),
      };
      resultObject.isResultOf = observationId;
      resultObject.vocabulary = categoricalCollection;
      break;
    case "https://w3id.org/tern/ontologies/tern/QuantitativeMeasure":
    case "https://w3id.org/tern/ontologies/tern/Text":
    case "https://w3id.org/tern/ontologies/tern/Boolean":
    case "https://w3id.org/tern/ontologies/tern/Integer":
    case "https://w3id.org/tern/ontologies/tern/Float":
      resultObject = {
        ...resultObject,
        ...getExampleData(observedPropertyUri, exampleData),
      };
      resultObject.isResultOf = observationId;
      break;
    default:
      throw Error(`Unexpected value type ${valueType}`);
  }
  return resultObject;
}

function generateObservationExample(
  observableProperty,
  datasetUri,
  baseObservationUri,
  baseFeatureOfInterestUri,
  exampleData,
  env
) {
  const example = {};

  const { value, uri, valueType, featureType, categoricalCollection, method } =
    observableProperty;
  const observationUUID = uuidv4();
  const hyphenateValue = hyphenate(value);
  const observationId = `${baseObservationUri}/${hyphenateValue}/${observationUUID}`;

  example["@id"] = observationId;
  example["@type"] = "https://w3id.org/tern/ontologies/tern/Observation";
  example["hasFeatureOfInterest"] = {
    "@id": `${baseFeatureOfInterestUri}/${uuidv4()}`,
    "@type": "https://w3id.org/tern/ontologies/tern/FeatureOfInterest",
    featureType: featureType,
    inDataset: datasetUri,
  };
  example["observedProperty"] = uri;
  example.usedProcedure = method;
  example.hasResult = getResultObject(
    valueType,
    hyphenateValue,
    uri,
    observationId,
    baseObservationUri,
    exampleData,
    categoricalCollection
  );
  const simpleValue = example.hasResult.value?.["@value"]
    ? example.hasResult.value?.["@value"]
    : example.hasResult.value?.["@id"];
  example.hasSimpleResult = simpleValue;
  const currentTime = getCurrentTime();
  example.phenomenonTime = {
    "@id": `${observationId}/phenomenonTime`,
    "@type": "https://w3id.org/tern/ontologies/tern/Instant",
    inXSDDateTimeStamp: {
      "@value": currentTime,
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
    },
  };
  example.resultTime = currentTime;
  example.inDataset = datasetUri;

  if (env === "test" && !example.hasResult["value"]) {
    throw new Error(
      `Example for observable property ${example.observedProperty} has no result value.`
    );
  }

  return example;
}

function processData(data) {
  const observableProperties = [];
  data.results.bindings.forEach((binding) => {
    const {
      label,
      uri,
      valueType,
      featureType,
      categoricalCollection,
      method,
    } = binding;
    const { value } = label;
    const { value: uriValue } = uri;
    const { value: valueTypeValue } = valueType;
    const { value: featureTypeValue } = featureType;
    const { value: categoricalCollectionValue } = categoricalCollection || {
      value: "https://todo.placeholder.com",
    };
    const { value: methodValue } = method;
    observableProperties.push({
      value: value,
      uri: uriValue,
      valueType: valueTypeValue,
      featureType: featureTypeValue,
      categoricalCollection: categoricalCollectionValue,
      method: methodValue,
    });
  });

  return observableProperties;
}
