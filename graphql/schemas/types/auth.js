let auth

module.exports = () => [auth]

auth = `
    type authData{
        name: String,
        photo: String
    }

    type auth {
        auth: authData
        error: String
    }
`