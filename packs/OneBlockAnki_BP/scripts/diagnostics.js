import { WORLD_PROPS } from "./constants.js";
import { getWorldNumber, getWorldString } from "./storage.js";

export function diagnosticSummary() {
  return `refresh=${getWorldNumber(WORLD_PROPS.totalRefreshes, 0)} stage=${getWorldNumber(WORLD_PROPS.stageId, 0)} altar=${getWorldString(WORLD_PROPS.altarState, "reserved")}`;
}

