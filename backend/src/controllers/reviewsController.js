const reviewsController = {};

import Reviews from "../models/reviews.js"; 

reviewsController.getReviews = async (req,res) => {
    try{
        const reviews = await Reviews.find();
        return res.status(200).json(reviews);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

reviewsController.createReview = async (req, res)=>{
    try{
        let{
            rating,
            comment,
            idEmployee,
            idPizza
        } = req.body;

        comment = comment?.trim();
        

        if(!rating || !comment){
            return res.status(400).json({message: "Rating and comment are required"});
        }

        if((Number(rating)) < 1 || (Number(rating)) > 5){
            return res.status(400).json({message: "Rating must be between 1 and 5"});
        }

        if (comment.length > 500 || comment.length < 3 ){
            return res.status(400).json({message: "Comment must be valid"})
        }

        const newReview = new Reviews({
            rating,
            comment,
            idEmployee,
            idPizza
        });

        await newReview.save();
        return res.status(201).json({message: "Review created successfully"});
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

reviewsController.deleteReview = async (req,res)=> {
    try {
        const deleteReview = await Reviews.findByIdAndDelete(req.params.id);
        if(!deleteReview) return res.status(404).json({message: "Review not found"});
        return res.status(200).json({message: "Review deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

reviewsController.updateReview = async (req,res)=>{
    try {
        let{
            rating,
            comment,
            idEmployee,
            idPizza
        } = req.body;

        rating  = rating?.trim();
        comment = comment?.trim();

        if(!rating || !comment){
            return res.status(400).json({message: "Rating and comment are required"});
        }

        if((Number(rating)) < 1 || (Number(rating)) > 5){
            return res.status(400).json({message: "Rating must be between 1 and 5"});
        }

        if (comment.length > 500 || comment.length < 3 ){
            return res.status(400).json({message: "Comment must be valid"})
        }

        const updateReview = await Reviews.findByIdAndUpdate(req.params.id, {
            rating,
            comment,
            idEmployee,
            idPizza
        }, {new: true});
        
        if(!updateReview) return res.status(404).json({message: "Review not found"});
        return res.status(200).json({message: "Review updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default reviewsController;