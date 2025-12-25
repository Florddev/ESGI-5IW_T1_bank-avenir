export interface RegisterUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface ConfirmAccountDto {
    token: string;
}

export interface AuthResponseDto {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
}
