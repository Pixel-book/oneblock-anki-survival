import { PLAYER_PROPS, QUIZ_SET_REWARD, QUIZ_SET_SIZE } from "./constants.js";
import { SAMPLE_CARDS } from "./anki_data.js";
import { getPlayerNumber, setPlayerNumber } from "./storage.js";

export function makeQuizSet() {
  const cards = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5).slice(0, QUIZ_SET_SIZE);
  return { index: 0, correct: 0, cards };
}

export function answerCurrent(quiz, selection) {
  const card = quiz.cards[quiz.index];
  const choice = card.choices[selection];
  const ok = choice === card.answer;
  quiz.index += 1;
  if (ok) quiz.correct += 1;
  return ok;
}

export function applyQuizReward(player, quiz) {
  const balance = getPlayerNumber(player, PLAYER_PROPS.balance, 0) + QUIZ_SET_REWARD;
  setPlayerNumber(player, PLAYER_PROPS.balance, balance);
  setPlayerNumber(player, PLAYER_PROPS.quizSetsCompleted, getPlayerNumber(player, PLAYER_PROPS.quizSetsCompleted, 0) + 1);
  setPlayerNumber(player, PLAYER_PROPS.quizCardsAnswered, getPlayerNumber(player, PLAYER_PROPS.quizCardsAnswered, 0) + QUIZ_SET_SIZE);
  setPlayerNumber(player, PLAYER_PROPS.quizCorrect, getPlayerNumber(player, PLAYER_PROPS.quizCorrect, 0) + quiz.correct);
  setPlayerNumber(player, PLAYER_PROPS.quizWrong, getPlayerNumber(player, PLAYER_PROPS.quizWrong, 0) + (QUIZ_SET_SIZE - quiz.correct));
  setPlayerNumber(player, PLAYER_PROPS.lastQuizAt, Date.now());
  return balance;
}

