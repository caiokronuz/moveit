import { GetServerSideProps } from 'next'

import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from "../contexts/CountdownContext";
import { ChallengesProvider } from '../contexts/ChallengesContext';

import Head from 'next/head'
 
import styles from '../styles/pages/Home.module.css';

interface HomeProps {
  id: number;
  name: string;
  email: string;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  token: string;
}

export default function Home(props: HomeProps) {

  return (
    //Salva os dados no context de challenges
    <ChallengesProvider 
      id={props.id}
      name={props.name}
      email={props.email}
      level={props.level} 
      currentExperience={props.currentExperience} 
      challengesCompleted={props.challengesCompleted}
      token={props.token}
    >

      <div className={styles.container}>
        <Head>
          <title>Inicio | Move.it</title>
        </Head>

        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div className={styles.challengeDiv}>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  //Retorna dados salvos nos cookies
 
  const {id, name, email, level, currentExperience, challengesCompleted, token} = ctx.req.cookies;

  if(!token){
    return{
      redirect:{
        permanent: false,
        destination: '/login'
      },
      props: {},
    }
  }

  return{
    //Manda os dados como prop para pagina
    props: {
      id: Number(id),
      name: String(name),
      email: String(email),
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
      token: String(token),
    }
  }
}
