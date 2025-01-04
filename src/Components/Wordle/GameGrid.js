import LetterCard from "./Letter/LetterCard";

const GameGrid = () => {
  return (
    <div className="wordle-grid">
      <div className="row">
        <LetterCard attemptNum={0} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={1} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={2} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={3} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={4} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={5} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={4}></LetterCard>
      </div>
    </div>
  );
};
export default GameGrid;
