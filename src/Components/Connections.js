import React from 'react'
import { CONNECTION_GAMES,DIFFICULTIES } from '../Data/connectionsData.js'


import '../Styles/connections.css'

import { ToastContainer, toast ,Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkAlreadySolved, checkAlreadySubmitted, checkIfCorrect, differenceOfArrays, shuffleArray } from '../lib/connectionsUtils.js';

import GameWonModal from './Modals/GameWonModal';
import GameLostModal from './Modals/GameLostModal';

const SolvedCard=({solvedCategory})=>{
    return(
        <div className='solved-category' style={{backgroundColor:DIFFICULTIES[solvedCategory.difficulty]}}>
            
            <p style={{fontSize:"18px",textAlign:"center"}}>
                <span>{solvedCategory.category}</span>
                <br></br>
                {solvedCategory.words.join(', ').toUpperCase()}
                </p>
        </div>
    )

}


const Card=({word,selected, handleClick})=>{
    return (<div className={`card ${selected ? 'selected' : ''}`} style={{fontSize:word.length>6?"12px":"16px"}} onClick={()=>{handleClick()}}>{word}</div>)
}


const Connections = () => {


    const [gameStart,setGameStart]=React.useState(false);

    const [gameWon,setGameWon]=React.useState(false);
    const [gameOver,setGameOver]=React.useState(false);
    const [gameOverModal,setGameOverModal]=React.useState(false);

    const [gameSolution,setGameSolution]=React.useState([]);
    const [wordsSelected,setWordsSelected]=React.useState([]);

    const [previousSubmissions,setPreviousSubmissions]=React.useState([]);
    const [attemptsLeft,setAttemptsLeft]=React.useState(4);

    const [solvedCategories,setSolvedCategories]=React.useState([]);
    
    const [gameWords,setGameWords]=React.useState([]);


    const [wordsTakenOut,setWordsTakenOut]=React.useState([])

    React.useEffect(()=>{
        const newWords=differenceOfArrays(gameWords,wordsTakenOut)
        setGameWords(newWords)
    },[wordsTakenOut])
    React.useEffect(() => {
        if (!gameOver) {
          return;
        }
        // extra delay for game won to allow confetti to show
        const modalDelay = gameWon ? 2000 : 4000;
        const delayModalOpen = window.setTimeout(() => {
            setGameOverModal(true);
          //unmount confetti after modal opens
        //   setShowConfetti(false);

        }, modalDelay);
    
        // if (isGameWon) {
        //   setShowConfetti(true);
        // }

        // Initialize an index for iterating through gameSolution
        // Define a recursive function to process each group with a delay
        const showCorrectAnswers = (currentIndex) => {
            // Base case: stop recursion when all groups have been processed
            if (currentIndex >= gameSolution.length) {
                return;
            }

            const currentSolution = gameSolution[currentIndex];

            // Check if the group has already been solved
            if (!solvedCategories.includes(currentSolution.difficulty)) {
                // Process the current group
                setWordsTakenOut(prevWordsTakenOut => [...prevWordsTakenOut, ...currentSolution.words]);
                setSolvedCategories(prevSolvedCategories => [...prevSolvedCategories, currentSolution.difficulty]);

                // Call the function recursively to process the next group after a delay of 1 second
                setTimeout(() => {
                    showCorrectAnswers(currentIndex + 1);
                }, 1000);
            } else {
                // If the group has already been solved, move to the next group immediately
                showCorrectAnswers(currentIndex + 1);
            }
        };

        // Start processing groups from index 0
        setTimeout(()=>{
            showCorrectAnswers(0);
        },500)


        
        
    
        // Return a cleanup function to clear the timeout and interval
        return () => {
            clearTimeout(delayModalOpen);
        };
    }, [gameOver,gameWon]);

    const startConnectionsGame=()=>{
        
        const index = Math.floor(Math.random() * CONNECTION_GAMES.length);
        
        const selectedGame=CONNECTION_GAMES[index]

        let updatedWords = [];

        for (let i = 0; i < selectedGame.length; i++) {
            updatedWords = [...updatedWords, ...selectedGame[i].words];
        }

        const shuffledWords = shuffleArray(updatedWords)
        setGameStart(true)
        setGameSolution(selectedGame)

        // Update the state with the shuffled array
        setGameWords(shuffledWords);

    }

    const handleWordSelect=(word)=>{

        let currentWordsSelected;
      if(wordsSelected.includes(word)){
        currentWordsSelected=wordsSelected.filter((w)=>word!==w)

        setWordsSelected(currentWordsSelected)
        return
      }

      if(wordsSelected.length===4)return;

      currentWordsSelected=[...wordsSelected, word]

        setWordsSelected(currentWordsSelected)
    }

    const shuffleWords=(e)=>{
        e.preventDefault()
        const shuffledWords = shuffleArray(gameWords)
        setGameWords(prevGameWords => [...shuffledWords]);
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        
        if(checkAlreadySubmitted(previousSubmissions, wordsSelected)) {
            toast('Already guessed!', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                closeButton:false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
                transition:Zoom
            });
            return
          }

        const prevAttempts= [...previousSubmissions, [...wordsSelected]]
        setPreviousSubmissions(prevAttempts)

        const result=checkIfCorrect(gameSolution,wordsSelected)

        let solutions;

        if(result.isCorrect){
            for (let i = 0; i < gameSolution.length; i++) {
                if(gameSolution[i].category===result.correctCategory){
  
                  solutions=[...solvedCategories, gameSolution[i].difficulty]
  
                  break
                }
            }
            
            let newGameWords=differenceOfArrays(gameWords, wordsSelected)
            
            setGameWords(newGameWords)
            setWordsSelected([])
            setSolvedCategories(solutions)
            if(solvedCategories.length===3){
                setGameOver(true)
                setGameWon(true)
            }
            
        
        } else if(result.isGuessOneAway){
          
            if(attemptsLeft===1){
                toast('YOU LOST', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    closeButton:false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                    transition:Zoom
                });

                setWordsSelected([])
                setGameOver(true)
                  
              }else{
                toast('One Guess away!', {
    
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    closeButton:false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                    transition:Zoom
                    });
              }
              setAttemptsLeft(attemptsLeft-1)
            
        }
        else{
            
    
            if(attemptsLeft===1){
                toast('YOU LOST', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    closeButton:false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                    transition:Zoom
                });
                
                 //TO DO; SET TIMEOUTS SO THE ANSWERS COULD BE SHOWN ONE BY ONE          
                
                 setWordsSelected([])
                setGameOver(true)
            }
            else{
                toast('Wrong Answer', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                closeButton:false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
                transition:Zoom
            });}

            setAttemptsLeft(attemptsLeft-1)
            
        }

    }


    const handleReset=()=>{

        setAttemptsLeft()
        setGameWon(false);
        setGameOver(false);

        setGameOverModal(false);

        setWordsSelected([]);

        setPreviousSubmissions([]);
        setAttemptsLeft(4);

        setSolvedCategories([]);

        const index = Math.floor(Math.random() * CONNECTION_GAMES.length);
        
        const selectedGame=CONNECTION_GAMES[index]

        let updatedWords = [];

        for (let i = 0; i < selectedGame.length; i++) {
            updatedWords = [...updatedWords, ...selectedGame[i].words];
        }

        const shuffledWords = shuffleArray(updatedWords)
        
        setGameSolution(selectedGame)

        // Update the state with the shuffled array
        setGameWords(shuffledWords);
    }

    const closeModal=()=>{
        
        setGameOverModal(false)
    }
    return (

        <div className='game'>
    
            <div className='connections-container'>
                
                <h1>Connnections</h1>
               
                <p>Create four groups of four!</p>
    
                {!gameStart?(
                <div className='game_start_container'>
                    <h2>How to play Connections</h2>
    
                    <div>
                        <h3>Find groups of four items that share something in common.</h3>
                        <ul>
                            <li>Select four items and tap 'Submit' to check if your guess is correct</li>
                            <li>Find the groups without making 4 mistakes!</li>
                        </ul>
                    </div>
    
    
                    <div>
                        <h3>Category Examples:</h3>
                        <ul>
                            <li>FISH: Bass, Flounder, Salmon, Trout</li>
                            <li>FIRE ___: Ant, Drill, Island, Opal</li>
                        </ul>
                    </div>
                    <p>Categories will always be more specific than "5-LETTER WORDS," "NAMES," or "VERBS."</p>
                    <p>Each puzzle has exactly one solution. Watych out for words that seem to belong to multiple categories!</p>
                    <p>Each group is assigned a color, which will be revealed as you solve:</p>
                <button onClick={startConnectionsGame}>Start Connections Game</button>
                </div>
                ):(
                    <>
                    
                    <div className="card-container">
                
                
               {solvedCategories.map((solvedIndex,index)=>(
                <SolvedCard key={index} solvedCategory={gameSolution[solvedIndex-1]}></SolvedCard>
               ))}
    
                {gameWords.map((word, index) => (
                    <Card key={index} word={word} selected={wordsSelected.includes(word)} handleClick={()=>handleWordSelect(word)}></Card>
                    ))}
    
                </div>
    
                <div className='attempts-remaining' >
                    <span id='attempts-remaining-text'>Mistakes remaining:</span>
                    <span id="attempts-remaining-bubbles">
                    {Array(attemptsLeft).fill().map((_, index) => (
                        <span key={index} className="black-circle"></span>
                    ))}
                    </span>
                </div>

                {gameOver && gameWon ? (
                    <GameWonModal open={gameOverModal} closeModal={closeModal} reset={handleReset}/>
                ) : (
                    gameOver && !gameWon ? (
                        <GameLostModal open={gameOverModal} closeModal={closeModal} reset={handleReset}/>
                    ) : (
                        <></>
                    )
                )}
    
                {gameOver?(
                    <button className="view-results" onClick={()=>{setGameOverModal(true)}}>
                    View results
                </button>
    
                ):(
                    <div className='button-group'>
                        <button className='connections-button' onClick={shuffleWords}>Shuffle</button>
                        <button className='connections-button' onClick={()=>{
                            setWordsSelected([])
                        }}> Deselect All</button>
                        <button className='connections-button'
                            onClick={handleSubmit}
                            disabled={wordsSelected.length !== 4}
                            style={{ border: wordsSelected.length !== 4 ? '2px solid gray' : '2px solid black' , color:wordsSelected.length !== 4 ?"gray":"white", backgroundColor:wordsSelected.length !== 4 ?"white":"black"}}
                            >
                                Submit
                        </button>
                    </div>
    
                )}
                </>
                )}
    
            </div>
    
            <ToastContainer />
        </div>
      )
}

export default Connections