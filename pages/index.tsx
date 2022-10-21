import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Login } from '../containers/Login'

const Home: NextPage = () => {

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if(typeof window !== 'undefined'){
      const token = localStorage.getItem('accessToken');
      if(token){
        setAccessToken(token);
      }
    }
  }, []);

  return (
    <>
      {!accessToken ? <Login setAccessToken={setAccessToken}/> : <><h1>Bem Vindo</h1></>}
    </>
  );
}


export default Home