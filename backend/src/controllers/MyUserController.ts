import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../user"; 

const createCurrentUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { auth0Id } = req.body;

        if (!auth0Id) {
            res.status(400).json({ message: "auth0Id is required" });
            return;
        }

        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            res.status(200).send();
            return;
        }

        // --- IMPORTANT: Add Input Validation Here ---
        // Before creating the user, validate req.body to ensure only expected
        // fields (like email, name, etc.) are used. E.g., using zod or manually:
        // const validatedData = { auth0Id, email: req.body.email, name: req.body.name };
        // if (!validatedData.email) { /* handle error */ }
        // const newUser = new User(validatedData);
        // ------------------------------------------

        // Assuming validation passed (replace req.body with validated data)
        const newUser = new User(req.body); // Replace req.body with validated data
        await newUser.save();

        // Send the response. No return needed here if it's the last statement in the 'try'.
        res.status(201).json(newUser.toObject());

    } catch (error) {
        console.log(error); // Optional: keep for debugging server-side
        // Pass error to the Express error handling middleware
        next(error);
    }
};

export default {
    createCurrentUser,
};