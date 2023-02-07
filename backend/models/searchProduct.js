import mongoose from "mongoose";

const searchProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
        productURL: {
            type: String,
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        reviews: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const SearchProduct = mongoose.model("Search Product", searchProductSchema);
export default SearchProduct;
