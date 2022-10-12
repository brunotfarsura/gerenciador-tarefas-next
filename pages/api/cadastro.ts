import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDB } from '../../middlewares/connectDB';
import md5 from 'md5';
import { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import { UserModel } from '../../models/userModel';

type CadastroRequest = {
    name: string,
    email: string,
    password: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {
    try{
        if(req.method !== 'POST'){
            return res.status(405).json(
                {
                    error: 'Metodo não existente'
                }
            )
        }

        const {body} = req;
        const dados = body as CadastroRequest;

        if(!dados.email || !dados.password || !dados.name){
            return res.status(400).json(
                {
                    error: 'Favor preencher os campos obrigatórios'
                }
            );
        }

        if(!dados.name || dados.name.length < 2){
            return res.status(400).json({error: 'Nome inválido'});
        }

        if(isEmailValid(dados)){
            return res.status(400).json({error: 'Email inválido'});
        }

        if(isPasswordValid(dados)){
            return res.status(400).json({error: 'Senha inválida'});
        }

        const existsUser = await UserModel.find({email: dados.email});
        if(existsUser && existsUser.length > 0){
            return res.status(400).json({error: 'Já existe uma conta com os dados informados'});
        }

        dados.password = md5(dados.password);
        await UserModel.create(dados);

        return res.status(201).json(
            {
                msg: 'Cadastro efetuado com sucesso'
            }
        );
    } catch(e: any){
        console.log('Erro ao efetuar o cadastro', e);
    }

    function isPasswordValid(dados: CadastroRequest) {
        const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/;
        return !regexPassword.test(dados.password);
    }

    function isEmailValid(dados: CadastroRequest) {
        const regexEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return !regexEmail.test(dados.email);
    }
}

export default connectDB(handler);