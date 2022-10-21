/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { List } from '../components/List';
import { executeRequest } from '../services/api';

type PrincipalProps = {
    setAccessToken(s:string) : void
}

export const Principal : NextPage<PrincipalProps> = ({setAccessToken}) =>{

    const [list, setList] = useState([]);

    const sair = () =>{
        localStorage.clear();
        setAccessToken('');
    }

    const getFilteredList = async() => {
        try{
            const result = await executeRequest('task', 'GET');
            if(result && result.data){
               setList(result.data);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao buscar tarefas:', e);
        }
    }

    useEffect(() => {
        getFilteredList();
    }, []);

    return (
        <>
            <Header sair={sair}/>
            <List list={list}/>
            <Footer />
        </>
    );
}