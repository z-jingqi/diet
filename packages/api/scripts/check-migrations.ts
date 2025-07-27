import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkMigrations() {
  try {
    console.log("🔍 检查迁移历史...\n");

    // 1. 查看本地迁移文件
    console.log("📁 本地迁移文件:");
    const localMigrations = execSync("ls -la migrations/*.sql", {
      cwd: path.join(__dirname, ".."),
      encoding: "utf8",
    });
    console.log(localMigrations);

    // 2. 查看数据库中的迁移记录
    console.log("\n🗄️ 数据库迁移记录:");
    const dbMigrations = execSync(
      'npx wrangler d1 execute DB --remote --command="SELECT * FROM __drizzle_migrations ORDER BY id;"',
      {
        cwd: path.join(__dirname, "../.."),
        encoding: "utf8",
      },
    );
    console.log(dbMigrations);

    // 3. 查看迁移日志
    console.log("\n📋 迁移日志 (_journal.json):");
    const journal = execSync("cat migrations/meta/_journal.json", {
      cwd: path.join(__dirname, ".."),
      encoding: "utf8",
    });
    console.log(journal);
  } catch (error) {
    console.error("❌ 检查迁移失败:", error);
  }
}

checkMigrations();
