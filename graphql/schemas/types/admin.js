let user;

module.exports = () => [user];

user = `
  type user {
    id: Int
    name: String 
    username: String 
    email: String 
    password: String 
    phone: String
    id_card: String 
    sip: String
    photo: String 
  }

  type getAlluser {
    user: [user]
    error: String
  }

  type createNewUserPayload {
    user: user
    error: String
  }

  type loginAdminPayload {
    token: String 
    role: Int,
    error: String
  }

  input loginAdmin {
    username: String
    password: String
  }

  input newUser {
    name: String 
    username: String 
    email: String 
    password: String 
    phone: String
    id_card: String 
    sip: String 
    photo: String
  }

  input updateAdmin {
    id: Int
    name: String 
    username: String 
    email: String 
    phone: String
    id_card: String 
    sip: String 
    photo: String
  }

  input deleteAdmin {
    id: Int
  }
`;