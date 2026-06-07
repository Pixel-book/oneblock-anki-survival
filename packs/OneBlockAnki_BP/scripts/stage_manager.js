import { WORLD_PROPS } from "./constants.js";
import { getWorldNumber, setWorldNumber } from "./storage.js";

export const STAGES = [
  { id: 0, name: "tutorial", min: 0 },
  { id: 1, name: "plains", min: 30 },
  { id: 2, name: "cave", min: 120 },
  { id: 3, name: "farm_village", min: 300 },
  { id: 4, name: "ocean", min: 550 },
  { id: 5, name: "dungeon", min: 850 },
  { id: 6, name: "nether_prepare", min: 1200 },
  { id: 7, name: "end_prepare", min: 1700 },
  { id: 8, name: "loop_after_dragon", min: 2400 }
];

export function stageForRefreshes(totalRefreshes) {
  let stage = STAGES[0];
  for (const candidate of STAGES) if (totalRefreshes >= candidate.min) stage = candidate;
  return stage;
}

export function currentStage() {
  return STAGES.find((stage) => stage.id === getWorldNumber(WORLD_PROPS.stageId, 0)) ?? STAGES[0];
}

export function updateStageAfterRefresh(player, totalRefreshes) {
  const previous = getWorldNumber(WORLD_PROPS.stageId, 0);
  const next = stageForRefreshes(totalRefreshes);
  if (next.id !== previous) {
    setWorldNumber(WORLD_PROPS.stageId, next.id);
    player?.sendMessage?.("§b单方块的气息发生了变化。");
  }
  return next;
}
