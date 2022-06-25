import { ForbiddenError } from "../error/error.js"
import jwt from '../utils/jwt.js'

export default function checkToken (req, res, next) {
    try {
        if(req.url == '/register' && req.url == '/login') {
            return next()
        }

        let { token } = req.headers

        if(!token){
            return next( new ForbiddenError(403, 'token required'))
        }

        let {user_id} = jwt.verify(token)
        req.user_id = user_id

        return next()
    } catch (error) {
        return next( new ForbiddenError(403, error.message) )
    }
}