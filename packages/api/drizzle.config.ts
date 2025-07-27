import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// 切换逻辑：生产环境（NODE_ENV=production）走 Cloudflare D1 HTTP API；
// 本地开发则直接通过 wrangler-cli 与 Miniflare 的 sqlite 文件交互，免账号 Token。

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  verbose: true,
  strict: true,
  ...(isProd
    ? {
        // 线上：通过 HTTP API 直接连接远程 D1
        driver: "d1-http",
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
          databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID!,
          token: process.env.CLOUDFLARE_D1_TOKEN!,
        },
      }
    : {
        // 本地直接指向 Miniflare 生成的 sqlite 文件，Drizzle 会自动使用 better-sqlite 驱动
        dbCredentials: {
          // 动态查找 .wrangler/state/v3/d1/miniflare-D1DatabaseObject 下最新的 *.sqlite 文件
          url: (() => {
            try {
              const base = path.resolve(
                __dirname,
                "../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject",
              );

              const sqliteFiles = fs
                .readdirSync(base)
                .filter((f) => f.endsWith(".sqlite"))
                .sort(
                  (a, b) =>
                    fs.statSync(path.join(base, b)).mtimeMs -
                    fs.statSync(path.join(base, a)).mtimeMs,
                );

              if (sqliteFiles.length === 0) {
                throw new Error("No local .sqlite file found");
              }

              // 使用 file:// 协议
              return `file:${path.join(base, sqliteFiles[0])}`;
            } catch (err) {
              console.warn(
                '⚠️  未找到本地 D1 数据库文件，已使用内存数据库。请先运行 `wrangler d1 execute DB --local --command="SELECT 1"` 以生成本地数据库。',
              );
              return ":memory:";
            }
          })(),
        },
      }),
});
