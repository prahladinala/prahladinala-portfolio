const query = `
  query Publication {
    publication(host: "prahladinala.hashnode.dev") {
      id
    }
  }
`;

fetch("https://gql.hashnode.com", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
})
.then(res => {
  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));
  return res.text();
})
.then(text => console.log("Response:", text.substring(0, 200)))
.catch(console.error);
