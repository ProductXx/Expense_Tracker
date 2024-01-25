const NotFound = async (req, res) => {
  res.status(404).json({ message: "Page does not exist!" });
};

module.exports = NotFound;
