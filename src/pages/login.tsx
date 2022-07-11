import Router from 'next/router';
import Link from 'next/link';

import {FormEvent, useState} from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

import styles from '../styles/pages/Login.module.css';

export default function loginPage(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function onLogin(e:FormEvent){
        e.preventDefault();

        //status[0]
        //level, experience, challenges_completed

        //user[0]
        //id, name, email

        //token

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

            return Router.push("/")
        }catch(err){
            alert(err.response.data.error)
        }
    }

    return(
        <div className={styles.container}>
            <main>
                <div className={styles.logo}>
                    <h1>Move.it</h1>
                </div>
                <div className={styles.login}>
                    <form onSubmit={onLogin}>
                        <input type="email" name="email" id="email" placeholder='Email' onChange={e => setEmail(e.target.value)}/>
                        <input type="password" name="password" id="password" placeholder='Senha' onChange={e => setPassword(e.target.value)}/>
                        <button type="submit">Logar</button>
                        <p>Não possui uma conta? <Link href="/register">Clique aqui!</Link></p>
                    </form>
                </div>
            </main>
        </div>
    )
}