import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose from 'mongoose';

export const connectDB = (handler: NextApiHandler) =>
    async(req: NextApiRequest, res: NextApiResponse) => {
        const readyState = mongoose.connections[0].readyState;
        console.log('Verifica o estado da conexão com o banco de dados (0 = offline, 1 = online)', readyState);

        if(readyState){
            return handler(req, res);
        }

        const {DB_CONNECTION_STRING} = process.env;

        if(!DB_CONNECTION_STRING){
            return res.status(500).json({
                error: 'Missing DB_CONNECTION_STRING env variable'
            });
        }

        mongoose.connection.on('connected', () => console.log('Conectado com sucesso'));
        mongoose.connection.on('error', err => console.log('Falha ao conectar no banco de dados', err));
        await mongoose.connect(DB_CONNECTION_STRING);

        return handler(req, res);
    }