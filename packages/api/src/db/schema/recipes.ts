import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./auth";

/**
 * 菜谱表
 * 由于 SQLite JSON 支持有限，列表/对象字段统一存储为 JSON 字符串。
 */
export const recipes = sqliteTable("recipes", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  cover_image_url: text("cover_image_url"),
  cuisine_type: text("cuisine_type"),
  meal_type: text("meal_type"),
  servings: integer("servings").notNull(),
  difficulty: text("difficulty").notNull(), // easy | medium | hard
  prep_time_approx_min: integer("prep_time_approx_min"),
  cook_time_approx_min: integer("cook_time_approx_min"),
  total_time_approx_min: integer("total_time_approx_min"),
  cost_approx: integer("cost_approx"),
  currency: text("currency"),
  dietary_tags: text("dietary_tags"), // JSON array
  allergens: text("allergens"), // JSON array
  tips: text("tips"),
  leftover_handling: text("leftover_handling"),
  version: integer("version").default(1),
  checksum: text("checksum"),
  source_message_id: text("source_message_id"),

  ingredients: text("ingredients"), // JSON array
  steps: text("steps"), // JSON array
  nutrients: text("nutrients"), // JSON object
  equipments: text("equipments"), // JSON array

  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deleted_at: text("deleted_at"), // 软删除
});

/**
 * 菜谱喜好表
 * 用于记录用户对菜谱的喜好（喜欢/不喜欢）
 * 这些菜谱可能是仅有基础信息的推荐菜谱，还未生成详情
 */
export const recipePreferences = sqliteTable("recipe_preferences", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // recipe_id可以为空，因为可能只是基础推荐的菜谱，没有完整菜谱记录
  recipe_id: text("recipe_id").references(() => recipes.id, {
    onDelete: "set null",
  }),
  // 存储基础菜谱名称，即使没有完整菜谱记录
  recipe_name: text("recipe_name").notNull(),
  // 存储菜谱基础信息的JSON字符串(可选)
  recipe_basic_info: text("recipe_basic_info"),
  // 喜好: like | dislike
  preference: text("preference").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
