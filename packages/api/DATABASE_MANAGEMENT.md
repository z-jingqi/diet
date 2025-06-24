# 🗄️ 数据库管理指南

本指南介绍如何使用 Drizzle ORM 和 Drizzle Kit 管理 Cloudflare D1 数据库。

## 📋 目录

- [环境准备](#环境准备)
- [数据库操作流程](#数据库操作流程)
- [新增数据库表](#新增数据库表)
- [修改表结构](#修改表结构)
- [数据迁移](#数据迁移)
- [种子数据管理](#种子数据管理)
- [常见问题](#常见问题)

## 🔧 环境准备

### 1. 确保环境变量配置正确

在项目根目录的 `.dev.vars` 文件中确保以下变量：

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_D1_DATABASE_ID=your_database_id
CLOUDFLARE_WORKERS_AI_API_TOKEN=your_api_token
```

### 2. 确保 Drizzle 配置正确

检查 `packages/api/drizzle.config.ts`：

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID || '',
    token: process.env.CLOUDFLARE_WORKERS_AI_API_TOKEN || '',
  },
});
```

## 🚀 数据库操作流程

### 基本工作流程

```bash
# 1. 修改 schema 定义
# 编辑 packages/api/src/db/schema.ts

# 2. 生成迁移文件
cd packages/api
pnpm db:generate

# 3. 应用迁移到远程数据库
pnpm db:migrate

# 4. 如果需要，插入种子数据
npx tsx scripts/seed-db-remote.ts
```

### 📝 迁移文件命名规则

Drizzle Kit 会自动生成迁移文件名，格式为：`{序号}_{随机形容词}_{随机名词}`

#### 示例：
- `0000_small_ricochet.sql` - 第一个迁移文件
- `0001_curly_master_mold.sql` - 第二个迁移文件

#### 为什么这样命名？
- ✅ **避免冲突**：多个开发者同时创建迁移时不会冲突
- ✅ **唯一性**：确保每个迁移文件都有唯一的标识
- ✅ **可读性**：比纯数字更有描述性
- ✅ **排序**：数字前缀确保正确的执行顺序

#### 迁移文件关联：
1. **本地文件**：`migrations/0000_small_ricochet.sql`
2. **迁移日志**：`migrations/meta/_journal.json` 记录元数据
3. **数据库记录**：`__drizzle_migrations` 表追踪已应用的迁移

#### 查看迁移历史：
```bash
# 查看迁移状态
npx tsx scripts/check-migrations.ts

# 查看数据库中的迁移记录
npx wrangler d1 execute DB --remote --command="SELECT * FROM __drizzle_migrations ORDER BY id;"
```

## ➕ 新增数据库表

### 步骤 1: 在 Schema 中定义新表

编辑 `packages/api/src/db/schema.ts`，添加新表定义：

```typescript
// 示例：新增一个 recipes 表
export const recipes = sqliteTable('recipes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ingredients: text('ingredients').notNull(), // JSON 格式
  instructions: text('instructions').notNull(), // JSON 格式
  nutritionInfo: text('nutrition_info'), // JSON 格式
  tags: text('tags'), // JSON 格式存储标签ID数组
  userId: text('user_id').references(() => users.id),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
```

### 步骤 2: 生成迁移文件

```bash
cd packages/api
pnpm db:generate
```

这会生成一个新的迁移文件，如 `migrations/0002_add_recipes_table.sql`

### 步骤 3: 检查迁移文件

查看生成的迁移文件，确保 SQL 语句正确：

```sql
-- 示例迁移文件内容
CREATE TABLE `recipes` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `nutrition_info` text,
  `tags` text,
  `user_id` text,
  `is_public` integer DEFAULT false,
  `created_at` text DEFAULT CURRENT_TIMESTAMP,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
```

### 步骤 4: 应用迁移

```bash
pnpm db:migrate
```

### 步骤 5: 验证表创建

```bash
# 检查表是否存在
npx wrangler d1 execute DB --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name='recipes';"

# 查看表结构
npx wrangler d1 execute DB --remote --command="PRAGMA table_info(recipes);"
```

## 🔄 修改表结构

### 场景 1: 添加新字段

#### 步骤 1: 修改 Schema

```typescript
// 在现有表中添加新字段
export const users = sqliteTable('users', {
  // ... 现有字段
  newField: text('new_field'), // 新增字段
  anotherField: integer('another_field', { mode: 'boolean' }).default(false),
});
```

#### 步骤 2: 生成并应用迁移

```bash
pnpm db:generate
pnpm db:migrate
```

### 场景 2: 修改字段类型

⚠️ **注意**: SQLite 对字段类型修改有限制，通常需要重建表

#### 推荐做法：创建新字段

```typescript
// 不要直接修改字段类型，而是添加新字段
export const users = sqliteTable('users', {
  // ... 现有字段
  oldField: text('old_field'), // 保留原字段
  newField: integer('new_field'), // 添加新字段
});
```

#### 数据迁移脚本

创建数据迁移脚本 `scripts/migrate-field-data.ts`：

```typescript
import { execSync } from 'child_process';

async function migrateFieldData() {
  try {
    // 1. 将旧字段数据复制到新字段
    const updateCommand = `npx wrangler d1 execute DB --remote --command="UPDATE users SET new_field = CAST(old_field AS INTEGER) WHERE old_field IS NOT NULL;"`;
    execSync(updateCommand, { cwd: '../..', encoding: 'utf8' });
    
    // 2. 验证数据迁移
    const verifyCommand = `npx wrangler d1 execute DB --remote --command="SELECT COUNT(*) FROM users WHERE new_field IS NOT NULL;"`;
    execSync(verifyCommand, { cwd: '../..', encoding: 'utf8' });
    
    console.log('✅ 字段数据迁移完成');
  } catch (error) {
    console.error('❌ 字段数据迁移失败:', error);
  }
}

migrateFieldData();
```

### 场景 3: 删除字段

⚠️ **注意**: SQLite 不支持直接删除字段，需要重建表

#### 推荐做法：标记字段为废弃

```typescript
// 在 schema 中保留字段但标记为废弃
export const users = sqliteTable('users', {
  // ... 其他字段
  deprecatedField: text('deprecated_field'), // 标记为废弃，不再使用
});
```

## 📊 数据迁移

### 批量数据操作

创建迁移脚本 `scripts/data-migration.ts`：

```typescript
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateData() {
  try {
    console.log('🚀 开始数据迁移...');
    
    // 执行 SQL 文件
    const sqlFile = path.join(__dirname, '../src/db/data-migration.sql');
    const command = `npx wrangler d1 execute DB --remote --file=${sqlFile}`;
    
    const result = execSync(command, { 
      cwd: path.join(__dirname, '../..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ 数据迁移完成');
    console.log(result);
    
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    process.exit(1);
  }
}

migrateData();
```

### 创建数据迁移 SQL 文件

`packages/api/src/db/data-migration.sql`：

```sql
-- 示例：批量更新数据
UPDATE tags SET sort_order = sort_order + 1 WHERE category_id = 'nutritional-focus';

-- 示例：插入新数据
INSERT OR REPLACE INTO tag_categories (id, name, description, sort_order, is_active, created_at) 
VALUES ('new-category', '新分类', '新添加的分类', 6, 1, CURRENT_TIMESTAMP);

-- 示例：删除旧数据
DELETE FROM tag_conflicts WHERE conflict_type = 'deprecated';
```

## 🌱 种子数据管理

### 更新种子数据

1. **修改种子数据文件**: `packages/api/src/db/seed-data.sql`
2. **运行种子脚本**: `npx tsx scripts/seed-db-remote.ts`

### 部分数据更新

创建专门的更新脚本 `scripts/update-seed-data.ts`：

```typescript
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateSeedData() {
  try {
    console.log('🚀 开始更新种子数据...');
    
    // 只更新特定表的数据
    const updateFile = path.join(__dirname, '../src/db/update-tags.sql');
    const command = `npx wrangler d1 execute DB --remote --file=${updateFile}`;
    
    const result = execSync(command, { 
      cwd: path.join(__dirname, '../..'),
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('✅ 种子数据更新完成');
    console.log(result);
    
  } catch (error) {
    console.error('❌ 种子数据更新失败:', error);
    process.exit(1);
  }
}

updateSeedData();
```

## 🔍 数据库维护

### 查看数据库状态

```bash
# 查看所有表
npx wrangler d1 execute DB --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

# 查看表结构
npx wrangler d1 execute DB --remote --command="PRAGMA table_info(table_name);"

# 查看数据量
npx wrangler d1 execute DB --remote --command="SELECT COUNT(*) FROM table_name;"

# 查看数据库大小
npx wrangler d1 execute DB --remote --command="SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"
```

### 备份和恢复

```bash
# 导出数据库（本地开发环境）
npx wrangler d1 execute DB --local --command=".dump" > backup.sql

# 导入数据库（本地开发环境）
npx wrangler d1 execute DB --local --file=backup.sql
```

## ❗ 常见问题

### 1. 迁移失败：表已存在

**错误**: `table already exists`

**解决方案**:
```bash
# 删除冲突的表（谨慎操作）
npx wrangler d1 execute DB --remote --command="DROP TABLE IF EXISTS table_name;"
pnpm db:migrate
```

### 2. 外键约束失败

**错误**: `FOREIGN KEY constraint failed`

**解决方案**:
- 确保引用的表和数据存在
- 检查外键关系是否正确
- 按正确顺序插入数据（先插入被引用的表）

### 3. 权限错误

**错误**: `Authentication error [code: 10000]`

**解决方案**:
```bash
# 重新登录 wrangler
npx wrangler logout
npx wrangler login --api-token
```

### 4. 迁移文件冲突

**问题**: 多个开发者同时修改 schema

**解决方案**:
1. 协调修改顺序
2. 手动合并迁移文件
3. 重新生成迁移文件

## 📝 最佳实践

### 1. Schema 设计原则

- 使用有意义的字段名
- 添加适当的约束和索引
- 考虑数据完整性和性能
- 使用 JSON 字段存储复杂数据

### 2. 迁移管理

- 每次修改后立即生成和应用迁移
- 在测试环境验证迁移
- 保持迁移文件的可读性
- 记录重要的数据变更

### 3. 数据安全

- 定期备份重要数据
- 在生产环境谨慎执行删除操作
- 使用事务确保数据一致性
- 测试数据迁移脚本

### 4. 性能优化

- 为常用查询字段添加索引
- 避免过度复杂的查询
- 合理使用 JSON 字段
- 定期清理无用数据

## 🛠️ 常用命令速查

```bash
# 生成迁移文件
pnpm db:generate

# 应用迁移
pnpm db:migrate

# 推送到数据库（开发环境）
pnpm db:push

# 查看数据库
pnpm db:studio

# 执行 SQL 文件
npx wrangler d1 execute DB --remote --file=path/to/file.sql

# 执行 SQL 命令
npx wrangler d1 execute DB --remote --command="SELECT * FROM table_name;"

# 查看表结构
npx wrangler d1 execute DB --remote --command="PRAGMA table_info(table_name);"
```

---

## 📞 需要帮助？

如果遇到问题，请：

1. 检查错误日志
2. 验证环境变量配置
3. 确认网络连接
4. 查看 Cloudflare D1 文档
5. 联系开发团队 