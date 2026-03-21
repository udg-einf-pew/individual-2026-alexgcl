import { Schema, model } from 'mongoose';
import { User } from '../types';
import validator from 'validator';
import { encryptPassword } from '../secure';

const userSchema = new Schema<User>({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, 'El correu proporcionat no és vàlid'],
        },
        password: {
            type: String,
            required: true,
            minlength: [8, 'La contrasenya cal que tingui més de 8 caràcters'],
            select: false,
        },
        passwordConfirmation: {
            type: String,
            required: [true, 'Cal confirmar la contrasenya'],
            validate: {
            validator: function(this: any, value: string) {
                return value === this.password;
            },
                message: 'Les contrasenyes no coincideixen',
            },
        },
        role: {
            type: String,
            default: 'user',
        },
    },
    { collection: 'user', timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre('save', async function(this: any) {
    if (!this.isModified('password')) return;
    try {
        this.password = await encryptPassword(this.password);
        this.passwordConfirmation = undefined;
    } catch (err: any) {
    }
});

export const UserModel = model<User>('User', userSchema);