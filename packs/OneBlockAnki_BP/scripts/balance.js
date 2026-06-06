import { PLAYER_PROPS } from "./constants.js";
import { getPlayerNumber } from "./storage.js";

export function playerBalance(player) {
  return getPlayerNumber(player, PLAYER_PROPS.balance, 0);
}

