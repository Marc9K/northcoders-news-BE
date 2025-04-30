const app = require("./controllers/app.controllers");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
