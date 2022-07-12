import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { FormEvent, useState } from 'react';
import api from '../services/api';
import Cookies from 'js-cookie';

import styles from '../styles/pages/Login.module.css';
import { toast } from 'react-toastify';

export default function registerPage(){
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    async function onRegister(e: FormEvent){
        e.preventDefault();

        if(!name || !email || !password || !password2){
            toast.error("Preencha os dados corretamente.")
            return;
        }

        if(password != password2){
            toast.error("ERRO! As senhas não coincidem.")
            return;
        }

        try{
            const {data} = await api.post('register', {
                name,
                email,
                password
            })

            toast.success("Registro efetuado com sucesso")

            Cookies.set("id", data.user[0].id);
            Cookies.set("name", data.user[0].name);
            Cookies.set("email", data.user[0].email);

            Cookies.set("level", data.status[0].level);
            Cookies.set("currentExperience", data.status[0].experience);
            Cookies.set("challengesCompleted", data.status[0].challenges_completed);

            Cookies.set("token", data.token);

            return Router.push("/");

        }catch(err){
            toast.error(err.response.data.error)
        }
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Registro | Move.it</title>
            </Head>
            <main>
                <div className={styles.logo}>
                    <h1>Move.it</h1>
                </div>
                <div className={styles.login}>
                    <form onSubmit={onRegister}>
                        <input type="text" name="name" id="name" placeholder='Seu nome' onChange={e => setName(e.target.value)} />
                        <input type="email" name="email" id="email" placeholder='Seu melhor email' onChange={e => setEmail(e.target.value)}/>
                        <input type="password" name="password" id="password" placeholder='Sua senha' onChange={e => setPassword(e.target.value)}/>
                        <input type="password" name="password2" id="password2" placeholder='Repita sua senha' onChange={e => setPassword2(e.target.value)}/>
                        <button type="submit">Registrar</button>
                        <p>Já possui uma conta? <Link href="/login">Clique aqui!</Link></p>
                    </form>
                </div>
            </main>
        </div>
    )
}