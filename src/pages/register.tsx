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

    const [isLoading, setIsLoading] = useState(false);

    async function onRegister(e: FormEvent){
        e.preventDefault();
        setIsLoading(true);

        if(!name || !email || !password || !password2){
            toast.error("Preencha os dados corretamente.")
            setIsLoading(false);
            return;
        }

        if(password != password2){
            toast.error("ERRO! As senhas não coincidem.")
            setIsLoading(false);
            return;
        }

        try{
            const {data} = await api.post('register', {
                name,
                email,
                password
            })

            toast.success("Registro efetuado com sucesso")

            Cookies.set("id", data.user.id);
            Cookies.set("name", data.user.name);
            Cookies.set("email", data.user.email);

            Cookies.set("level", data.status.level);
            Cookies.set("currentExperience", data.status.experience);
            Cookies.set("challengesCompleted", data.status.challenges_completed);

            Cookies.set("token", data.token);

            return Router.push("/");

        }catch(err){
            toast.error(err.response.data.error)
            setIsLoading(false);
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
                        <button type="submit">{isLoading ? "Carregando..." : "Registrar"}</button>
                        <p>Já possui uma conta? <Link href="/login">Clique aqui!</Link></p>
                    </form>
                </div>
            </main>
        </div>
    )
}