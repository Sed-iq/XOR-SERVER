module.exports = (errmsg, status, res) => {
  if (res) {
    res.status(status || 404).json({ message: errmsg });
  } else console.error(errmsg);
};
