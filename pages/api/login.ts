import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDB } from '../../middlewares/connectDB';
import md5 from 'md5';
import { UserModel } from '../../models/userModel';
import jwt from 'jsonwebtoken';

type LoginRequest = {
    login: string
    password: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try{
        if(req.method !== 'POST'){
            return res.status(405).json(
                {
                    error: 'Metodo não existente'
                }
            )
        }

        const {body} = req;
        const dados = body as LoginRequest;

        if(!dados.login || !dados.password){
            return res.status(400).json(
                {
                    error: 'Favor preencher os campos obrigatórios'
                }
            );
        }

        const{JWT_SECRET} = process.env;
        if(!JWT_SECRET){
            return res.status(500).json({
                error: 'JWT não encontrado'
            });
        }

        const existsUser = await UserModel.find({email: dados.login, password: md5(dados.password)});
        if(existsUser && existsUser.length > 0){
            const user = existsUser[0];
            const token = jwt.sign({_id: user._id}, JWT_SECRET);

            res.status(200).json({name: user.name, email: user.email, token});
        }
        return res.status(400).json({error : 'Login e senha não conferem'});

    } catch(e: any){
        console.log('Erro ao efetuar o login', e);
    }
}

export default connectDB(handler);