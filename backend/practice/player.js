PlayerSchema = {
    username: "string",
    email: "email",
    password: "password",
    resetPassword: "string",
    resetPasswordExpires: "number",
    campaigns: [
        {
            campaigns: "MongoID",
            dm: "boolean",
        },
        {
            campaigns: "MongoID",
            dm: "boolean",
        }
    ]
}