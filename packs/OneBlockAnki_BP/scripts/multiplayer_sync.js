import { PLAYER_PROPS, WORLD_PROPS } from "./constants.js";
import { getPlayerNumber, getWorldNumber } from "./storage.js";

export function sendStatus(player) {
  const balance = getPlayerNumber(player, PLAYER_PROPS.balance, 0);
  const total = getWorldNumber(WORLD_PROPS.totalRefreshes, 0);
  player.onScreenDisplay?.setActionBar?.(`§a余额 ${balance} §7| §b世界刷新 ${total}`);
}

