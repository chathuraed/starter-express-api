const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key"; // Replace with your actual secret key

const verifyToken =
  (requiredRoles: string[]) => (req: any, res: any, next: any) => {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      // If the token is valid, extract user information from the decoded payload
      const userRole = decoded.role;

      // Check if the user's role matches the required role
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ error: "Access denied. Insufficient privileges." });
      }

      // If the user role matches the required role, store it in the request object for later use
      req.userId = decoded.userId;
      req.userRole = userRole;

      next();
    });
  };

export { verifyToken };
