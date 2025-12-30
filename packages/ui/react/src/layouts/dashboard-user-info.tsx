interface DashboardUserInfoProps {
    firstName: string;
    lastName: string;
    email: string;
}

export function DashboardUserInfo({ firstName, lastName, email }: DashboardUserInfoProps) {
    return (
        <div className="text-sm text-right">
            <p className="font-medium">{firstName} {lastName}</p>
            <p className="text-muted-foreground text-xs">{email}</p>
        </div>
    );
}
