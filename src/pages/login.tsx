import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import {FormEvent, useState} from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

import styles from '../styles/pages/Login.module.css';
import { toast } from 'react-toastify';

export default function loginPage(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function onLogin(e:FormEvent){
        e.preventDefault();
        setIsLoading(true);

        if(!email || !password){
            toast.error("Preencha os dados corretamente.")
            setIsLoading(false);
            return;
        }

        try{
            const {data} = await api.post('login', {
                email, 
                password
            })
    
            Cookies.set("id", data.user[0].id);
            Cookies.set("name", data.user[0].name);
            Cookies.set("email", data.user[0].email);

            Cookies.set("level", data.status[0].level);
            Cookies.set("currentExperience", data.status[0].experience);
            Cookies.set("challengesCompleted", data.status[0].challenges_completed);

            Cookies.set("token", data.token);

            toast.success(`Seja bem vindo, ${data.user[0].name}`)
            return Router.push("/")
        }catch(err){
            toast.error(err.response.data.error)
        }
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Login | Move.it</title>
            </Head>
            <main>
                <div className={styles.logo}>
                    <h1>Move.it</h1>
                </div>
                <div className={styles.login}>
                    <form onSubmit={onLogin}>
                        <input type="email" name="email" id="email" placeholder='Email' onChange={e => setEmail(e.target.value)}/>
                        <input type="password" name="password" id="password" placeholder='Senha' onChange={e => setPassword(e.target.value)}/>
                        <button type="submit">{isLoading ? "Carregando...": "Logar"}</button>
                        <p>Não possui uma conta? <Link href="/register">Clique aqui!</Link></p>
                    </form>
                </div>
            </main>
        </div>
    )
}