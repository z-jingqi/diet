-- 标签分类表
CREATE TABLE IF NOT EXISTS tag_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES tag_categories(id),
  restrictions TEXT, -- JSON 数组格式存储限制条件
  ai_prompt TEXT NOT NULL, -- 给AI的专门描述
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category_id);
CREATE INDEX IF NOT EXISTS idx_tags_active ON tags(is_active);
CREATE INDEX IF NOT EXISTS idx_tags_sort ON tags(sort_order);

-- 插入默认标签分类
INSERT OR IGNORE INTO tag_categories (id, name, description, sort_order) VALUES
('disease', '疾病类型', '各种慢性疾病的饮食限制', 1),
('diet', '饮食限制', '特殊的饮食要求和限制', 2),
('nutrition', '营养需求', '特定的营养补充需求', 3),
('special', '特殊需求', '其他特殊饮食需求', 4);

-- 插入示例标签数据
INSERT OR IGNORE INTO tags (id, name, description, category_id, restrictions, ai_prompt, sort_order) VALUES
('iga', 'IGA肾病', 'IgA肾病是一种免疫球蛋白A沉积在肾脏的疾病', 'disease', '["低盐", "低蛋白", "限制钾摄入"]', '用户患有IgA肾病，需要严格控制盐分摄入（每日不超过3g），蛋白质摄入需要适量控制，避免高钾食物如香蕉、土豆等。建议选择清淡、易消化的食物。', 1),
('hypertension', '高血压', '高血压患者的饮食限制', 'disease', '["低盐", "限制钠摄入"]', '用户患有高血压，需要严格控制盐分摄入（每日不超过2g），避免高钠食物如咸菜、腌制品等。建议选择新鲜蔬菜、水果和瘦肉。', 2),
('diabetes', '糖尿病', '糖尿病患者的饮食控制', 'disease', '["低糖", "控制碳水化合物"]', '用户患有糖尿病，需要严格控制糖分和碳水化合物摄入，选择低GI食物，定时定量进餐。建议选择全谷物、蔬菜和瘦肉。', 3),
('low-calorie', '低卡', '低卡路里饮食，适合减重人群', 'diet', '["控制热量", "高纤维"]', '用户需要低卡路里饮食，每餐热量控制在300-400卡路里，优先选择高纤维、低脂肪的食物，如蔬菜、瘦肉、全谷物等。', 1),
('low-salt', '低盐', '低盐饮食要求', 'diet', '["限制钠摄入"]', '用户需要低盐饮食，每日盐分摄入不超过3g，避免咸菜、腌制品、加工食品等高钠食物。', 2),
('low-sugar', '低糖', '低糖饮食要求', 'diet', '["限制糖分摄入"]', '用户需要低糖饮食，避免添加糖、甜点、含糖饮料等，选择天然甜味的食物。', 3),
('high-protein', '高蛋白', '高蛋白质饮食需求', 'nutrition', '["增加蛋白质摄入"]', '用户需要高蛋白质饮食，每餐应包含优质蛋白质如瘦肉、鱼类、蛋类、豆制品等。', 1),
('calcium', '补钙', '钙质补充需求', 'nutrition', '["增加钙质摄入"]', '用户需要补充钙质，建议多食用奶制品、豆制品、绿叶蔬菜等富含钙质的食物。', 2); 
