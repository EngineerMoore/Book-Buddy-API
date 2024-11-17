const { id_ID } = require("@faker-js/faker");
const prisma = require(`../prisma`);
const express = require(`express`);
const router= express.Router();
module.exports = router;


router.get(`/`, async (req, res, next) => {
  try{
    const books =await prisma.book.findMany();
    res.json(books);
  } catch (e) {
    next(e);
  }
});

router.get(`/:id`, async (req, res, next) => {
  const { id } = req.params;
  try{
    const book = await prisma.book.findUnique({ where: { id: +id } });
  if (book) {
    res.json(book);
  } else {
    next({ status: 404, message: `Book with id ${id} does not exist.` });
  }
} catch (e) {
  next(e);
}
});

router.put(`/:id`, async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;
  if(!title) {
    return next({
      status: 400,
      message: `Title must be provided.`
    });
  }
  try {
    const book = await prisma.book.findUnique({ where: {id: +id} });
    if (!book) {
      return next({
        status: 404,
        message: `No book with id: ${id} found.`
      });
    }
    const updatedBook = await prisma.book.update({
      where: { id: +id},
      data: {title},
    });
    res.status(200).json(updatedBook);
    next({status: 400, message: `title required (title: String).`})
  } catch (err){
    next(err);
  }});

/* How does it know which book to return?
because const book is tied to only what was created w/ .create({ data: {title} }) */
router.post(`/`, async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next({
      status: 400, 
      message: `title required to add new book (title: String).`
    });
  }
  try {
    const book = await prisma.book.create({ data: {title} });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({ where: {id: +id} });
    if (!book){
      return next ({
        status : 404,
        message: `Book with id: ${id} does not exist.`
      });
      }
    await prisma.book.delete({ where: {id: +id}});
    res.sendStatus(204);
    } catch (err) {
      next(err);
  }
})