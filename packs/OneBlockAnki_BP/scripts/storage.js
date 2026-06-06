import { world } from "@minecraft/server";
import { logError, logWarn } from "./logger.js";

function cleanNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function cleanBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function cleanString(value, fallback) {
  return typeof value === "string" ? value : fallback;
}

export function getWorldNumber(key, fallback) {
  return cleanNumber(world.getDynamicProperty(key), fallback);
}

export function setWorldNumber(key, value) {
  try { world.setDynamicProperty(key, Number(value)); } catch (error) { logError("Storage", `write world number ${key}`, error); }
}

export function getWorldBoolean(key, fallback) {
  return cleanBoolean(world.getDynamicProperty(key), fallback);
}

export function setWorldBoolean(key, value) {
  try { world.setDynamicProperty(key, value === true); } catch (error) { logError("Storage", `write world boolean ${key}`, error); }
}

export function getWorldString(key, fallback) {
  return cleanString(world.getDynamicProperty(key), fallback);
}

export function setWorldString(key, value) {
  try { world.setDynamicProperty(key, String(value)); } catch (error) { logError("Storage", `write world string ${key}`, error); }
}

export function getPlayerNumber(player, key, fallback) {
  return cleanNumber(player.getDynamicProperty(key), fallback);
}

export function setPlayerNumber(player, key, value) {
  try { player.setDynamicProperty(key, Number(value)); } catch (error) { logError("Storage", `write player number ${key}`, error); }
}

export function getPlayerBoolean(player, key, fallback) {
  return cleanBoolean(player.getDynamicProperty(key), fallback);
}

export function setPlayerBoolean(player, key, value) {
  try { player.setDynamicProperty(key, value === true); } catch (error) { logError("Storage", `write player boolean ${key}`, error); }
}

export function getPlayerString(player, key, fallback) {
  return cleanString(player.getDynamicProperty(key), fallback);
}

export function setPlayerString(player, key, value) {
  try { player.setDynamicProperty(key, String(value)); } catch (error) { logError("Storage", `write player string ${key}`, error); }
}

export function getWorldJson(key, fallback) {
  try {
    const raw = getWorldString(key, "");
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    logWarn("Storage", `invalid world json ${key}`);
    return fallback;
  }
}

export function setWorldJson(key, value) {
  setWorldString(key, JSON.stringify(value));
}

export function getPlayerJson(player, key, fallback) {
  try {
    const raw = getPlayerString(player, key, "");
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    logWarn("Storage", `invalid player json ${key}`);
    return fallback;
  }
}

export function setPlayerJson(player, key, value) {
  setPlayerString(player, key, JSON.stringify(value));
}

