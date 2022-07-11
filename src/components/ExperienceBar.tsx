import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/ExperienceBar.module.css';

export function ExperienceBar(){
    //Recupera dados do context
    const {currentExperience, experienceToNextLevel} = useContext(ChallengesContext);
    
    //Calculo para definir a porcentagem que falta para o proximo level
    const percentToNextLevel = Math.round(currentExperience * 100) / experienceToNextLevel;

    return(
        <header className={styles.experienceBar}>
            <span>0 xp</span>
            <div>
                <div style={{width: `${percentToNextLevel}%`}}>
                    <span 
                        className={styles.currentExperience} 
                        style={{left: `${percentToNextLevel}%`}}
                    >
                        {currentExperience} xp
                    </span>
                </div>
            </div>
            <span>{experienceToNextLevel} xp</span>
        </header>
    )
}