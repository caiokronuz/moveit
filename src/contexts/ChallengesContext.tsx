import {createContext, useState, ReactNode, useEffect} from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';
import api from '../services/api';
import { toast } from 'react-toastify';

export const ChallengesContext = createContext({} as ChallengesContextData);

interface Challenge{
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData{
    name: string;
    level: number; 
    currentExperience: number; 
    challengesCompleted: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    activeChallenge: Challenge; 
    resetChallenge: () => void;
    completeChallenge: () => void;
    experienceToNextLevel: number;
    closeLevelUpModal: () => void;
    isLoading: boolean;
}

interface ChallengesProviderProps{
    children: ReactNode;
    id: number;
    name: string;
    email: string;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    token: string;
}

export function ChallengesProvider({
    children, 
    ...rest
}:ChallengesProviderProps){
    const [id] = useState(rest.id)
    const [name] = useState(rest.name)
    const [email] = useState(rest.email)
    const [token] = useState(rest.token);
    const [level, setLevel] = useState<number>(rest.level)
    const [currentExperience, setCurrentExperience] = useState<number>(rest.currentExperience);
    const [challengesCompleted, setChallengesCompleted] = useState<number>(rest.challengesCompleted);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4,2)

    async function updateStatus(level, currentExperience, challengesCompleted, token){
        await api.put('/status', {
            level,
            experience: currentExperience,
            challenges_completed: challengesCompleted,
        }, {
            headers: {Authorization: `Bearer ${token}`}
        })
    }

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengesCompleted', String(challengesCompleted))

        updateStatus(level, currentExperience, challengesCompleted, token);
    }, [level, currentExperience, challengesCompleted])

    function levelUp(){
        setLevel(level + 1)
        setIsLevelUpModalOpen(true)
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio!', {
                body: `Valendo ${challenge.amount} xp!`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null)
    }

    async function completeChallenge(){
        
        setIsLoading(true);

        if(!activeChallenge){
            return;
        }

        const {amount} = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience)
        setChallengesCompleted(challengesCompleted + 1)

        try{
            await updateStatus(level, currentExperience, challengesCompleted, token);
            toast.success("Informações salvas com sucesso!")
        }catch(err){
            toast.error("Erro ao salvar seus dados")
        }finally{
            setIsLoading(false);
            setActiveChallenge(null);
        }
    }

    return(
        <ChallengesContext.Provider 
            value={{
                name,
                level, 
                currentExperience, 
                challengesCompleted, 
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completeChallenge,
                experienceToNextLevel,
                closeLevelUpModal,
                isLoading
                }}
            >

            {children}
            {isLevelUpModalOpen && <LevelUpModal />}

        </ChallengesContext.Provider>
    );
}