import mongoose from "mongoose";

type connectionObject={
    isConnected ?:number;
}

const connection:connectionObject={};

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try{
        const dbConnection=await mongoose.connect(process.env.MONGODB_URL || '');
        console.log("PRINTING DB CONNECTION: ",dbConnection);
        connection.isConnected=dbConnection.connections[0].readyState;
        console.log("PRINTING CONNECTIONS: ",dbConnection.connections);
        console.log("Successfully connected to DB");

    }catch(error){
        console.error("ERROR WHILE CONNECTING TO DATABASE",error);
        process.exit(1);
    }
}

export default dbConnect