import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile(){
    const {level} = useContext(ChallengesContext)

    return(
        <div className={styles.profileContainer}> 
            <img src="http://github.com/caiokronuz.png" alt="Caio Gabriel"/>
            <div>
                <strong>Caio Gabriel</strong>
                <p>
                    <img src="icons/level.svg" alt="Level"/>
                    Level {level}                
                </p>
            </div>
        </div>
    );
}