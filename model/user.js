const connection = require("../config/database")

class User {
    
    constructor(
        id = null,
        firstName, 
        lastName,
        email,
        password,
        token
    ) {
        this.id = id,
        this.firstName = firstName,
        this.lastName = lastName,
        this.email = email,
        this.password = password,
        this.token = token
    }

    static createUser(user) {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO users SET id = ?, first_name = ?, last_name = ?, email = ?, password = ?, token = ?", 
                [user.id, user.firstName, user.lastName, user.email, user.password, user.token],
                (err, result) => {
                    if (err) reject(err)
                    resolve(result.insertId)
                })
        })
    }

    static updateUser(user) {
        connection.query(
            "UPDATE users SET token = ? WHERE id = ?", 
            [user.token, user. id]
        )
    }

    static getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM users WHERE email = ? LIMIT 1", 
                [email],
                (err, user) => {
                    if (err) reject(err)
                    resolve(user[0])
                } 
            )
        })
    }

    static getUserById(id) {
        return new Promise((resolve, reject) => {
            connection.query(
                "SELECT * FROM users WHERE id = ? LIMIT 1", 
                [id],
                (err, user) => {
                    if (err) reject(err)
                    resolve(user[0])
                } 
            )
        })
    }
}

module.exports = User