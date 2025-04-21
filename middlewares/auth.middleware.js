const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // lấy token (phần tử thứ 2 của array)
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAdmin }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

//Bearer {token} --> format thông thường của authorization request header
//gửi tới header của req = authorization
//token hoạt động dựa trên phương pháp mã hóa.
//Best practice khi dùng jwt là phải có private key và public key riêng biệt.
//Token được jwt đưa cho front để giao tiêp với back
