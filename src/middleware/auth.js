const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send({
      status: 401,
      message: "Unauthorized Request",
    });
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  const isAuthorized = token === "abc";
  if (!isAuthorized) {
    res.status(401).send({
      status: 401,
      message: "Unauthorized Request",
    });
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
