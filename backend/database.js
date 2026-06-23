import mongoose from 'mongoose';
import {config} from './config.js'
mongoose.connect(config.mongodb.url)

//Comprobar que todo funcione

//Creo una constante que sea igual a la conexión

const connection = mongoose.connection;

connection.on("open", () => {
    console.log("MongoDB is connected");
});

connection.on("disconnected", () => {
    console.log("MongoDB connection error");
});

connection.on("error", (error) => {
    console.log("MongoDB connection error", error);
});