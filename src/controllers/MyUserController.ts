import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../user"; 

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({ _id: req.userid });
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        res.json(currentUser);
    } catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Error fetching current user" });
    }
};

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

const updateCurrentUser: RequestHandler = async (req: Request, res: Response)=> {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await User.findById(req.userid);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.name = name;
        user.addressLine1 = addressLine1;
        user.country = country;
        user.city = city;
        await user.save();
        res.send(user);
        
    } catch(error) {
        res.status(500).json({ message: "Error Updating User" });
    }
}

export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser
}