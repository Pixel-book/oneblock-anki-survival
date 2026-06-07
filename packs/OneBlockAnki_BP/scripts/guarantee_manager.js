import { WORLD_PROPS } from "./constants.js";
import { getWorldJson, setWorldJson } from "./storage.js";

export const DEFAULT_GUARANTEE_STATE = {
  flint: { seen: false, attempts: 0, softPity: 20, hardPity: 45 },
  iron: { seenCount: 0, attempts: 0, softPity: 40, hardPity: 90 },
  water: { seen: false, attempts: 0, softPity: 70, hardPity: 140 },
  lava: { seen: false, attempts: 0, softPity: 90, hardPity: 180 },
  obsidian: { seenCount: 0, attempts: 0, softPity: 80, hardPity: 200 },
  sugarCane: { seen: false, attempts: 0, softPity: 80, hardPity: 160 },
  leather: { seen: false, attempts: 0, softPity: 100, hardPity: 220 },
  villager: { seenCount: 0, attempts: 0, softPity: 120, hardPity: 260 },
  workstation: { seenCount: 0, attempts: 0, softPity: 100, hardPity: 220 },
  carrotPotato: { seen: false, attempts: 0, softPity: 90, hardPity: 180 },
  string: { seenCount: 0, attempts: 0, softPity: 70, hardPity: 150 },
  bone: { seenCount: 0, attempts: 0, softPity: 70, hardPity: 150 },
  enderPearl: { seenCount: 0, attempts: 0, softPity: 130, hardPity: 300 }
};

export function loadGuarantees() {
  return { ...DEFAULT_GUARANTEE_STATE, ...getWorldJson(WORLD_PROPS.guaranteeStateJson, DEFAULT_GUARANTEE_STATE) };
}

export function saveGuarantees(state) {
  setWorldJson(WORLD_PROPS.guaranteeStateJson, state);
}

export function getPityMultiplier(entry) {
  if (entry.attempts < entry.softPity) return 1;
  return 1 + Math.min(4, (entry.attempts - entry.softPity) / 25);
}

export function markProvided(resource) {
  const state = loadGuarantees();
  const item = state[resource];
  if (!item) return;
  if ("seen" in item) item.seen = true;
  if ("seenCount" in item) item.seenCount += 1;
  item.attempts = 0;
  saveGuarantees(state);
}

export function noteRefreshAttempt() {
  const state = loadGuarantees();
  for (const key of Object.keys(state)) {
    const item = state[key];
    if (item.seen === true || item.seenCount > 0) continue;
    item.attempts += 1;
  }
  saveGuarantees(state);
  return state;
}

export function applyGuarantees(stage, pool) {
  const state = noteRefreshAttempt();
  const blocks = [...pool.blocks];
  const chest = [...pool.chest];
  const mobs = [...pool.mobs];
  const addWeighted = (key, values, target) => {
    const entry = state[key];
    if (!entry) return;
    const complete = entry.seen === true || entry.seenCount > 0;
    if (complete || entry.attempts < entry.softPity) return;
    const repeats = Math.ceil(getPityMultiplier(entry));
    for (let i = 0; i < repeats; i += 1) target.push(...values);
  };
  addWeighted("flint", ["minecraft:flint"], chest);
  addWeighted("iron", ["minecraft:iron_ore"], blocks);
  addWeighted("water", stage.name === "ocean" ? ["minecraft:water_bucket"] : ["minecraft:ice"], stage.name === "ocean" ? chest : blocks);
  addWeighted("lava", ["minecraft:lava_bucket"], chest);
  addWeighted("obsidian", ["minecraft:obsidian"], blocks);
  addWeighted("villager", ["minecraft:villager"], mobs);
  addWeighted("enderPearl", ["minecraft:ender_pearl"], chest);
  if (state.water.attempts >= state.water.hardPity && stage.id >= 4) chest.push("minecraft:water_bucket");
  if (state.flint.attempts >= state.flint.hardPity && stage.id >= 1) chest.push("minecraft:flint");
  if (state.lava.attempts >= state.lava.hardPity && stage.id >= 6) chest.push("minecraft:lava_bucket");
  if (state.obsidian.attempts >= state.obsidian.hardPity && stage.id >= 6) blocks.push("minecraft:obsidian", "minecraft:obsidian");
  if (state.villager.attempts >= state.villager.hardPity && stage.id >= 3) mobs.push("minecraft:villager");
  return { blocks, chest, mobs };
}

export function recordResource(typeId) {
  const map = {
    "minecraft:gravel": "flint",
    "minecraft:flint": "flint",
    "minecraft:iron_ore": "iron",
    "minecraft:water_bucket": "water",
    "minecraft:ice": "water",
    "minecraft:packed_ice": "water",
    "minecraft:lava_bucket": "lava",
    "minecraft:obsidian": "obsidian",
    "minecraft:villager": "villager",
    "minecraft:carrot": "carrotPotato",
    "minecraft:potato": "carrotPotato",
    "minecraft:string": "string",
    "minecraft:bone": "bone",
    "minecraft:ender_pearl": "enderPearl"
  };
  if (map[typeId]) markProvided(map[typeId]);
}
