const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    secure: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    message: message,
    success: true,
    user,
    token,
  });
};

export default sendToken;
