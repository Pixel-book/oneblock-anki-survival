export const VERSION = "0.1.0";

export const OVERWORLD_ID = "minecraft:overworld";
export const NETHER_ID = "minecraft:nether";
export const THE_END_ID = "minecraft:the_end";

export const CORE_BLOCK_POS = { x: 0, y: 64, z: 0 };
export const PLAYER_SPAWN_POS = { x: 0.5, y: 65, z: 0.5 };
export const DEFAULT_CORE_BLOCK = "minecraft:grass_block";

export const DEFAULT_INITIAL_BALANCE = 5;
export const QUIZ_SET_SIZE = 5;
export const QUIZ_SET_REWARD = 5;

export const CORE_EXPLOSION_GUARD_RADIUS = 6;

export const ALTAR_CENTER = { x: 1500, y: 64, z: 0 };
export const ALTAR_RESERVED_RADIUS = 64;
export const ALTAR_WARNING_RADIUS = 96;
export const ALTAR_WARNING_COOLDOWN_TICKS = 20 * 60;

export const WORLD_PROPS = {
  initialized: "oba:world_initialized",
  schemaVersion: "oba:schema_version",
  totalRefreshes: "oba:total_refreshes",
  stageId: "oba:stage_id",
  altarState: "oba:altar_state",
  altarGenerated: "oba:altar_generated",
  enteredNetherAny: "oba:entered_nether_any",
  blazeProofAny: "oba:blaze_proof_any",
  dragonDefeated: "oba:dragon_defeated",
  guaranteeStateJson: "oba:guarantee_state_json",
  lastRepairTick: "oba:last_repair_tick"
};

export const PLAYER_PROPS = {
  balance: "oba:refresh_balance",
  quizSetsCompleted: "oba:quiz_sets_completed",
  quizCardsAnswered: "oba:quiz_cards_answered",
  quizCorrect: "oba:quiz_correct",
  quizWrong: "oba:quiz_wrong",
  lastQuizAt: "oba:last_quiz_at",
  currentQuizJson: "oba:current_quiz_json",
  lastAltarWarningTick: "oba:last_altar_warning_tick"
};

