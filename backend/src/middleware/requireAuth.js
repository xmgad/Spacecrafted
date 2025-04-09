import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const requireAuth = async (req, res, next) => {
    //verify auth
    const { authorization } = req.headers

    if (!authorization) { // check for existing token
        return res.status(401).json({error: 'Authorization token is required for this operation'})
    }

    if (!authorization.startsWith('Bearer ')) { // check for auth format
        res.status(400).json({ error: 'Authorization format must be Bearer <token>' });
        return;
    }

    const token = authorization.split(' ')[1] // extract token

    try {
        const {_id} = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({ _id }).select('_id')
        if (!user) {
            return res.status(404).json({ message: 'User not found, invalid token' });
        }
        req.user = user
        next()
    } catch(e) {
        console.error(e)
        res.status(403).json({message: 'Authorization token is invalid'})
    }
}

export { requireAuth }