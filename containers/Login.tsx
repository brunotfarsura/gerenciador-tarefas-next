/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { Component, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { executeRequest } from '../services/api';

type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps>= ({setAccessToken}) =>{

    const [nameModal, setNameModal] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailModal, setEmailModal] = useState('');
    const [passwordModal, setPasswordModal] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setMessage('');
        setNameModal('');
        setEmailModal('');
        setPasswordModal('');
    }

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setMessage('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
                localStorage.setItem('accessToken', result.data.token);
                localStorage.setItem('name', result.data.name);
                localStorage.setItem('email', result.data.email);
                setAccessToken(result.data.token);
             }
            
        }catch(e: any){
            console.log('Erro ao efetuar o login: ', e);
            if(e?.response?.data?.error){
                setMessage(e?.response?.data?.error);
            }
            else{
                setMessage('Ocorreu erro ao efetuar login...');
            }
        }

        setLoading(false);
    }

    const doRegister = async() => {
        try{
            if(!emailModal || !passwordModal || !nameModal){
                return setMessage('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name: nameModal,
                email: emailModal,
                password: passwordModal
            };

            await executeRequest('cadastro', 'POST', body);
            
        }catch(e: any){
            console.log('Erro ao efetuar o cadastro: ', e);
            if(e?.response?.data?.error){
                setMessage(e?.response?.data?.error);
            }
            else{
                setMessage('Ocorreu erro ao efetuar o cadastro...');
            }
        }

        closeModal();
        setMessage('Usuário cadastrado com sucesso!');
    }

    return (
        <div className='container-login'>
            <img src='/logo.svg' alt='Logo Fiap' className='logo'/>
            <div className="form">
                {message && <p>{message}</p>}
                <div>
                    <img src='/mail.svg' alt='Login'/> 
                    <input type="text" placeholder="Login" 
                        value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                    <img src='/lock.svg' alt='Senha'/> 
                    <input type="password" placeholder="Senha" 
                        value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                <button type='button' onClick={() => setShowModal(true)} disabled={loading}>{loading ? '...Carregando' : 'Cadastro'}</button>
                <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                        <p>Cadastrar novo usuário</p>
                        {message && <p className='error'>{message}</p>}
                        <input type="text" placeholder='Nome'
                            value={nameModal} onChange={e => setNameModal(e.target.value)}/>
                        <input type="email" placeholder='Email'
                            value={emailModal} onChange={e => setEmailModal(e.target.value)}/>
                        <input type="password" placeholder='Password'
                            value={passwordModal} onChange={e => setPasswordModal(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button
                            disabled={loading}
                            onClick={doRegister}
                        >   {loading? "..Carregando" : "Salvar"}</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
            </div>
        </div>
    );
} 