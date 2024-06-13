import User from "../model/user.model.js";

export const signup = async (req, res, next) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });

    try {
        await newUser.save();
        res.status(201).json({
            message: "Created user successfully"
        });
    } catch (error) {
        next(error);
    }

}