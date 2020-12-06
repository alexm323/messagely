const db = require("../db");
const ExpressError = require('../expressError.js')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const { BCRYPT_WORK_FACTOR } = require("../config");
/** User class for message.ly */



/** User of the site. */

class User {
  constructor(username, password, first_name, last_name, phone) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
  }
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register(username, password, first_name, last_name, phone) {
    try {
      console.log('in the try')
      // if (!newUsername || !newPassword || !newFirst_name || !newLast_name || !newPhone) {
      //   throw new ExpressError("Missing required information", 400)
      // }
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
      const results = await db.query(
        `INSERT INTO users (username,password,first_name,last_name,phone,join_at,last_login_at) 
        VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
        RETURNING username,password,first_name,last_name,phone 
        `, [username, hashedPassword, first_name, last_name, phone])
      // const { username, password, first_name, last_name, phone } = results.rows[0];
      const user = results.rows[0]
      return new User(user.username, user.password, user.first_name, user.last_name, user.phone)
    } catch (error) {
      console.log('in the catch of user.js model')
      throw new ExpressError(error, 404)
    }

  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    // if a username or a password is not provided then we should throw an error that required info is missing
    if (!username || !password) {
      throw new ExpressError("Missing required information to authenticate", 400)
    }
    // make a query to the database to see if a user exists with that username

    try {
      const results = await db.query(`SELECT username,password FROM users WHERE username = $1`, [username])
      let user = results.rows[0]
      console.log(user)
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          return true
        } else {
          return false
        }
      } else {
        throw new ExpressError(`Username ${username}, not found`, 404)
      }
    } catch (error) {
      return error
    }



  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    // const results = await db.query(`SELECT username from users WHERE id = $1`, [username])
    // const user = results.rows[0]
    // if (!user) {
    //   throw new ExpressError(`Username ${username}, not found`)
    // } else {
    const new_login_time = await db.query(`UPDATE users SET last_login_at =CURRENT_TIMESTAMP WHERE username = $1 RETURNING last_login_at`, [username])
    // }
    console.log(new_login_time)

  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query('SELECT username,first_name,last_name,phone FROM users')
    return results.rows
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    if (!username) {
      throw new ExpressError("username must be provided", 400)
    }
    try {
      const results = await db.query(`SELECT username,first_name,last_name,phone,join_at,last_login_at FROM users WHERE username=$1`, [username])
      const user = results.rows[0]
      if (!user) {
        throw new ExpressError(`Username ${username}, not found`)
      }
      return user
    } catch (error) {
      return error
    }
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    if (!username) {
      throw new ExpressError("username must be provided", 400)
    }
    try {
      const results = await db.query(`SELECT username,first_name,last_name,phone,join_at,last_login_at FROM users WHERE username=$1`, [username])
      const user = results.rows[0]
      if (!user) {
        throw new ExpressError(`Username ${username}, not found`)
      }
      return user
    } catch (error) {
      return error
    }
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;

