const express = require(`express`);
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(`/books`, require(`./API/books`));

app.use((req, res, next) => {
  next({status: 404, message: `Endpoint Does Not Exist`});
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? `Something went wrong`);
});

app.listen(PORT, () => {
  console.log(`Lisenting on port ${PORT}`)
})
