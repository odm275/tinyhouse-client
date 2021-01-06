const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const REACT_APP_GRAPHQL_URI = "http://localhost:9000/api";

fetch(REACT_APP_GRAPHQL_URI, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: `{
            __schema {
                types {
                    kind
                    name
                    possibleTypes {
                        name
                    }
                }
            }
        }`,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    result.data.__schema.types = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    );
    fs.writeFileSync(
      path.resolve(__dirname, "./src/fragmentTypes.json"),
      JSON.stringify(result.data),
      (err) => {
        if (err) {
          console.error("Error writing fragmentTypes file", err);
        } else {
          console.log("Fragment types successfully extracted!");
        }
      }
    );
  });
