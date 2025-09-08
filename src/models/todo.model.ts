// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
import mongoose from 'mongoose';

const { Schema } =  mongoose;

const TodoSchema = new Schema(
    {
        title: { 
            type: String,
            required: [true, 'Please enter a title'],
        },
        completed: { 
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Todo = mongoose.model('Todo', TodoSchema);