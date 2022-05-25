module.exports = function(req, res, next) {
    const { name, password } = req.body;
      
    if (req.path === "/register") {
      console.log(!email.length);
      if (![name, password].every(Boolean)) {
        return res.json("Missing Credentials");
      }
    } else if (req.path === "/") {
      if (![password].every(Boolean)) {
        return res.json("Missing Credentials");
      }
    }
  
    next();
  };