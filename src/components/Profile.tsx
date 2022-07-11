import Cookies from 'js-cookie';
import Router from 'next/router';

import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile(){
    const {name,level} = useContext(ChallengesContext)

    function logout(){
        Cookies.remove('token');
        Cookies.remove('id');
        Cookies.remove('name');
        Cookies.remove('email');
        Cookies.remove('challengesCompleted');
        Cookies.remove('currentExperience');
        Cookies.remove('level');
        Router.push('/login')
    }

    return(
        <div className={styles.profileContainer}> 
            <img src="https://i.imgur.com/yI6fyJ0.png" alt={name}/>
            <div>
                <strong>{name}</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}             
                </p>
                <button onClick={logout}>Deslogar</button>
            </div>
        </div>
    );
}
