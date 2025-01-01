const prisma = require('../../prismaClient');
const { decodeToken } = require('../utils/tokenUtils');

async function authenticationMiddleWare(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  try {
    const userId = decodeToken(token);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
} 