import bcrypt from 'bcryptjs';
export const JWT_SECRET = 'LA_TEVA_CLAU_SECRETA';
export const JWT_EXPIRY = 3600; // 1 hora
export const JWT_COOKIE_NAME = 'auth_token';

export const encryptPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (candidatePassword: string, hashedPassword: string |
undefined): Promise<boolean> => {
    if (!hashedPassword) return false;
    return bcrypt.compare(candidatePassword, hashedPassword);
};