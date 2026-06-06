export const STAGE_POOLS = {
  tutorial: {
    blocks: ["minecraft:grass_block", "minecraft:dirt", "minecraft:oak_log", "minecraft:oak_leaves", "minecraft:cobblestone"],
    chest: ["minecraft:apple", "minecraft:bone_meal", "minecraft:wheat_seeds"],
    mobs: []
  },
  plains: {
    blocks: ["minecraft:dirt", "minecraft:grass_block", "minecraft:oak_log", "minecraft:birch_log", "minecraft:oak_leaves", "minecraft:birch_leaves", "minecraft:cobblestone", "minecraft:gravel", "minecraft:sand", "minecraft:clay"],
    chest: ["minecraft:apple", "minecraft:wheat_seeds", "minecraft:bone_meal"],
    mobs: ["minecraft:chicken", "minecraft:cow", "minecraft:sheep", "minecraft:pig"]
  },
  cave: {
    blocks: ["minecraft:stone", "minecraft:cobblestone", "minecraft:coal_ore", "minecraft:iron_ore", "minecraft:copper_ore", "minecraft:redstone_ore", "minecraft:lapis_ore", "minecraft:deepslate", "minecraft:andesite", "minecraft:diorite", "minecraft:granite"],
    chest: ["minecraft:string", "minecraft:bone", "minecraft:arrow"],
    mobs: ["minecraft:zombie", "minecraft:skeleton", "minecraft:spider"]
  },
  farm_village: {
    blocks: ["minecraft:hay_block", "minecraft:dirt", "minecraft:grass_block", "minecraft:oak_log", "minecraft:composter", "minecraft:barrel", "minecraft:fletching_table", "minecraft:lectern", "minecraft:smithing_table"],
    chest: ["minecraft:carrot", "minecraft:potato", "minecraft:beetroot_seeds", "minecraft:wheat", "minecraft:bed", "minecraft:bell"],
    mobs: ["minecraft:villager", "minecraft:zombie_villager", "minecraft:cat"]
  },
  ocean: {
    blocks: ["minecraft:sand", "minecraft:sandstone", "minecraft:clay", "minecraft:prismarine", "minecraft:sea_lantern", "minecraft:ice", "minecraft:packed_ice"],
    chest: ["minecraft:water_bucket", "minecraft:fishing_rod", "minecraft:kelp", "minecraft:seagrass"],
    mobs: ["minecraft:cod", "minecraft:salmon", "minecraft:tropical_fish", "minecraft:drowned"]
  },
  dungeon: {
    blocks: ["minecraft:mossy_cobblestone", "minecraft:stone_bricks", "minecraft:cracked_stone_bricks", "minecraft:iron_bars", "minecraft:cobweb", "minecraft:bookshelf"],
    chest: ["minecraft:string", "minecraft:bone", "minecraft:arrow", "minecraft:book", "minecraft:enchanted_book", "minecraft:name_tag", "minecraft:saddle", "minecraft:golden_apple"],
    mobs: ["minecraft:zombie", "minecraft:skeleton", "minecraft:spider", "minecraft:witch", "minecraft:creeper"]
  },
  nether_prepare: {
    blocks: ["minecraft:obsidian", "minecraft:netherrack", "minecraft:basalt", "minecraft:blackstone", "minecraft:soul_sand", "minecraft:magma_block", "minecraft:quartz_ore", "minecraft:nether_gold_ore"],
    chest: ["minecraft:flint_and_steel", "minecraft:obsidian", "minecraft:lava_bucket", "minecraft:fire_resistance_potion", "minecraft:gold_ingot"],
    mobs: ["minecraft:zombie", "minecraft:skeleton"]
  },
  end_prepare: {
    blocks: ["minecraft:end_stone", "minecraft:obsidian", "minecraft:purpur_block", "minecraft:diamond_ore", "minecraft:emerald_ore", "minecraft:amethyst_block"],
    chest: ["minecraft:ender_pearl", "minecraft:book", "minecraft:enchanted_book", "minecraft:diamond", "minecraft:emerald"],
    mobs: ["minecraft:enderman"]
  },
  loop_after_dragon: {
    blocks: ["minecraft:stone", "minecraft:oak_log", "minecraft:iron_ore", "minecraft:diamond_ore", "minecraft:end_stone", "minecraft:obsidian"],
    chest: ["minecraft:ender_pearl", "minecraft:golden_apple", "minecraft:book"],
    mobs: ["minecraft:enderman", "minecraft:villager"]
  }
};

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

