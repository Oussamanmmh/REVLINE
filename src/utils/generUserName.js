const prisma = require('../../prismaClient');
const generateUserName = async (firstName, lastName) => {
    const baseUserName = `${firstName}${lastName}`.toLowerCase();
    let userName = baseUserName;
    let attempts = 0;

    while (true) {
        const userExists = await prisma.user.findUnique({
            where: { userName },
        });

        if (!userExists) {
            return userName;
        }
        // Increment attempts and append a random number to the base username
        attempts++;
        userName = `${baseUserName}${Math.floor(Math.random() * 1000)}`;

        // Optional safety guard: Prevent infinite loops
        if (attempts > 1000) {
            throw new Error('Unable to generate a unique username after multiple attempts.');
        }
    }
};

module.exports = generateUserName;