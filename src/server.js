const express = require('express');
const routes = require('./routes/router');
const app = express();
const PORT = 5000;

app.use(express.json())
app.use(routes);
app.use((request, response) =>{
  response.status(404).send({
    messsage: "404-Ups Resource not Found"
  });
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});