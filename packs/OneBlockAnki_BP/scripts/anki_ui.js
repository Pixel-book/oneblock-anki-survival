import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { PLAYER_PROPS, QUIZ_SET_REWARD, QUIZ_SET_SIZE } from "./constants.js";
import { answerCurrent, applyQuizReward, makeQuizSet } from "./anki_quiz.js";
import { logError } from "./logger.js";
import { getPlayerNumber } from "./storage.js";

export async function openBalanceHelp(player) {
  try {
    const balance = getPlayerNumber(player, PLAYER_PROPS.balance, 0);
    const result = await new MessageFormData()
      .title("方块刷新余额不足")
      .body(`当前余额：${balance}\n完成一套题可获得 ${QUIZ_SET_REWARD} 次刷新余额。`)
      .button1("开始答题")
      .button2("稍后再说")
      .show(player);
    if (result.selection === 0) return startQuiz(player);
  } catch (error) {
    logError("AnkiUI", "open balance help failed", error);
  }
}

export async function startQuiz(player) {
  const quiz = makeQuizSet();
  return showQuestion(player, quiz);
}

async function showQuestion(player, quiz) {
  try {
    if (quiz.index >= QUIZ_SET_SIZE) return showResult(player, quiz);
    const card = quiz.cards[quiz.index];
    const form = new ActionFormData().title(`Anki ${quiz.index + 1}/${QUIZ_SET_SIZE}`).body(`题目：${card.front}`);
    for (const choice of card.choices) form.button(choice);
    const result = await form.show(player);
    if (result.canceled || result.selection == null) {
      player.sendMessage("§e题组已中断，本次不发放余额。");
      return;
    }
    const ok = answerCurrent(quiz, result.selection);
    player.sendMessage(ok ? "§a答对了。" : `§c答错了。答案：${card.answer}`);
    return showQuestion(player, quiz);
  } catch (error) {
    logError("AnkiUI", "question failed", error);
  }
}

async function showResult(player, quiz) {
  const balance = applyQuizReward(player, quiz);
  await new MessageFormData()
    .title("本套题完成")
    .body(`答对：${quiz.correct}/${QUIZ_SET_SIZE}\n获得刷新余额：+${QUIZ_SET_REWARD}\n当前余额：${balance}`)
    .button1("继续生存")
    .button2("再做一套")
    .show(player)
    .then((result) => {
      if (result.selection === 1) startQuiz(player);
    })
    .catch((error) => logError("AnkiUI", "result failed", error));
}

