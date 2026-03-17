import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/pequenocesarDB")

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