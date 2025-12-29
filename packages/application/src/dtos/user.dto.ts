export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateUserProfileDto {
    firstName: string;
    lastName: string;
}

export interface BanUserDto {
    userId: string;
}
