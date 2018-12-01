const pageNotFound = (req, res, next) => {
  res.status(404).render('page-not-found');
};

module.exports = { pageNotFound };
