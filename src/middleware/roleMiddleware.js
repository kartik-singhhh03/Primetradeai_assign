const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden. You do not have permission.",
        });
    }
    next();
  };
};

module.exports = authorizeRole;
