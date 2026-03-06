require("dotenv").config();
const app = require("./app");
const { PORT } = require("./src/config");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
