module.exports = (req, res) => {
  res.status(404).json({
    status: false,
    message: 'Not found',
  });
};
