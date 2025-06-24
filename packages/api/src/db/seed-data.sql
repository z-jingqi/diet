-- 插入标签分类
INSERT OR REPLACE INTO tag_categories (id, name, description, sort_order, is_active, created_at) VALUES
('medical-restrictions', '饮食限制', '基于健康状况或特殊需求的饮食调整', 1, 1, CURRENT_TIMESTAMP),
('nutritional-focus', '营养重点', '需要重点补充或控制的营养素', 2, 1, CURRENT_TIMESTAMP),
('health-objectives', '健康目标', '基于健康改善目标的饮食策略', 3, 1, CURRENT_TIMESTAMP),
('dietary-preferences', '饮食偏好', '基于个人选择和生活方式', 4, 1, CURRENT_TIMESTAMP),
('special-needs', '特殊需求', '特定人群或特殊时期的饮食需求', 5, 1, CURRENT_TIMESTAMP);

-- 插入标签
INSERT OR REPLACE INTO tags (id, name, description, category_id, restrictions, ai_prompt, is_active, sort_order, created_at, updated_at) VALUES
-- 医学限制类
('low-salt', '低盐', '控制盐分摄入，适合关注血压健康', 'medical-restrictions', '["限制钠摄入", "避免咸菜腌制品", "控制调味料"]', '用户需要低盐饮食，控制盐分摄入。避免咸菜、腌制品、加工食品、酱油等高钠食物。建议使用天然香料调味，如柠檬、醋、香草等。', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('low-sugar', '低糖', '控制糖分摄入，适合关注血糖健康', 'medical-restrictions', '["限制糖分摄入", "避免精制碳水", "控制血糖"]', '用户需要低糖饮食，避免添加糖、甜点、含糖饮料、白米饭、白面包等精制碳水化合物。建议选择全谷物、蔬菜、瘦肉等低GI食物。', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('low-fat', '低脂', '控制脂肪摄入，适合关注血脂健康', 'medical-restrictions', '["限制脂肪摄入", "避免油炸食品", "选择瘦肉"]', '用户需要低脂饮食，避免油炸食品、肥肉、奶油、黄油等高脂食物。建议选择瘦肉、鱼类、豆制品，烹饪方式以蒸、煮、烤为主。', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('low-potassium', '低钾', '控制钾元素摄入，适合特定健康需求', 'medical-restrictions', '["限制钾摄入", "避免高钾食物"]', '用户需要低钾饮食，避免香蕉、土豆、番茄、菠菜、橙子等高钾食物。建议选择苹果、梨、白米饭、瘦肉等低钾食物。', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('low-protein', '低蛋白', '控制蛋白质摄入，适合特定健康需求', 'medical-restrictions', '["限制蛋白质", "控制肉类摄入"]', '用户需要低蛋白质饮食，限制肉类、鱼类、蛋类、豆制品等高蛋白食物。建议以蔬菜、水果、谷物为主，适量补充优质蛋白。', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('gluten-free', '无麸质', '避免麸质食物，适合麸质敏感人群', 'medical-restrictions', '["避免麸质", "无小麦制品"]', '用户需要无麸质饮食，避免小麦、大麦、黑麦及其制品。建议选择大米、玉米、藜麦、荞麦等无麸质谷物。', 1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('dairy-free', '无乳制品', '避免乳制品，适合乳糖不耐受人群', 'medical-restrictions', '["避免乳制品", "无牛奶制品"]', '用户需要无乳制品饮食，避免牛奶、奶酪、酸奶等。建议选择豆奶、杏仁奶、椰奶等植物奶替代。', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 营养重点类
('high-protein', '高蛋白', '增加蛋白质摄入', 'nutritional-focus', '["增加蛋白质", "优质蛋白"]', '用户需要高蛋白质饮食，每餐应包含优质蛋白质如瘦肉、鱼类、蛋类、豆制品等。建议适当增加蛋白质在饮食中的比例。', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('high-fiber', '高纤维', '增加膳食纤维摄入', 'nutritional-focus', '["增加纤维", "全谷物"]', '用户需要高纤维饮食，多选择全谷物、蔬菜、水果、豆类等高纤维食物。有助于肠道健康和饱腹感。', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('high-calcium', '高钙', '增加钙质摄入', 'nutritional-focus', '["增加钙质", "钙补充"]', '用户需要高钙饮食，多食用奶制品、豆制品、绿叶蔬菜、坚果等富含钙质的食物。有助于骨骼健康。', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('high-iron', '高铁', '增加铁质摄入', 'nutritional-focus', '["增加铁质", "铁补充"]', '用户需要高铁饮食，建议多食用瘦肉、鱼类、豆类、绿叶蔬菜等富含铁质的食物。搭配维生素C促进铁吸收。', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('high-vitamin-c', '高维C', '增加维生素C摄入', 'nutritional-focus', '["增加维生素C", "抗氧化"]', '用户需要高维生素C饮食，建议多食用柑橘类水果、草莓、猕猴桃、青椒、西兰花等富含维生素C的食物。', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('high-omega3', '高omega-3', '增加omega-3脂肪酸摄入', 'nutritional-focus', '["增加omega-3", "健康脂肪"]', '用户需要高omega-3饮食，建议多食用深海鱼类（如三文鱼、鲭鱼）、亚麻籽、核桃等富含omega-3的食物。', 1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('high-vitamin-d', '高维D', '增加维生素D摄入', 'nutritional-focus', '["增加维生素D", "钙吸收"]', '用户需要高维生素D饮食，建议多食用蛋黄、鱼类、奶制品等，同时适当晒太阳促进维生素D合成。', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 健康目标类
('weight-loss', '减重', '以减重为目标的饮食', 'health-objectives', '["热量控制", "营养均衡", "饱腹感"]', '用户以减重为目标，需要控制总热量摄入，同时保证营养均衡。建议选择高蛋白、高纤维、低脂肪的食物，增加饱腹感。', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('muscle-gain', '增肌', '以增肌为目标的饮食', 'health-objectives', '["高蛋白", "适量碳水", "健康脂肪"]', '用户以增肌为目标，需要高蛋白质饮食配合适量碳水化合物。建议选择瘦肉、鱼类、蛋类等优质蛋白，适当增加蛋白质摄入。', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('blood-sugar-control', '控糖', '控制血糖水平', 'health-objectives', '["低GI食物", "定时定量", "控制碳水"]', '用户需要控制血糖，建议选择低GI食物，定时定量进餐，控制碳水化合物摄入。优先选择全谷物、蔬菜、瘦肉等。', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('heart-health', '护心', '保护心血管健康', 'health-objectives', '["低盐低脂", "omega-3", "抗氧化"]', '用户以保护心血管健康为目标，建议低盐低脂饮食，多食用富含omega-3的鱼类、坚果，以及富含抗氧化物质的水果蔬菜。', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('gut-health', '护肠', '维护肠道健康', 'health-objectives', '["益生菌", "膳食纤维", "易消化"]', '用户以维护肠道健康为目标，建议多食用富含膳食纤维的食物，如全谷物、蔬菜、水果，以及酸奶等益生菌食物。', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 饮食偏好类
('vegetarian', '素食', '植物性饮食', 'dietary-preferences', '["植物性食物", "避免肉类"]', '用户选择素食饮食，避免所有肉类。建议通过豆类、坚果、全谷物等补充蛋白质和必需营养素。', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('keto', '生酮', '低碳水高脂肪饮食', 'dietary-preferences', '["低碳水", "高脂肪", "适量蛋白"]', '用户选择生酮饮食，大幅减少碳水化合物摄入，增加健康脂肪摄入，保持适量蛋白质。建议选择橄榄油、坚果、鱼类等健康脂肪。', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 特殊需求类
('pregnancy', '孕期', '孕期营养需求', 'special-needs', '["叶酸", "铁质", "钙质", "蛋白质"]', '用户处于孕期，需要额外补充叶酸、铁质、钙质和蛋白质。建议选择富含这些营养素的食物，避免生食和酒精。', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('elderly', '老年', '老年人营养需求', 'special-needs', '["易消化", "高蛋白", "维生素D", "钙质"]', '用户为老年人，需要易消化的高蛋白食物，以及充足的维生素D和钙质。建议选择瘦肉、鱼类、奶制品、蔬菜等。', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('athlete', '运动', '运动人群营养需求', 'special-needs', '["高蛋白", "复合碳水", "电解质"]', '用户为运动人群，需要高蛋白质和复合碳水化合物，以及充足的电解质。建议运动前后适量补充蛋白质和碳水。', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('children', '儿童', '儿童生长发育期营养需求', 'special-needs', '["均衡营养", "优质蛋白", "钙质", "维生素"]', '用户为儿童，需要均衡的营养摄入以支持生长发育。建议多食用优质蛋白质、钙质丰富的食物，以及新鲜蔬菜水果。注意食物安全和适量原则。', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 插入标签冲突关系
INSERT OR REPLACE INTO tag_conflicts (id, tag_id_1, tag_id_2, conflict_type, description, created_at) VALUES
-- 互斥关系
('conflict-1', 'low-protein', 'high-protein', 'mutual_exclusive', '低蛋白和高蛋白标签互斥', CURRENT_TIMESTAMP),
('conflict-2', 'low-fat', 'keto', 'mutual_exclusive', '低脂和生酮标签互斥', CURRENT_TIMESTAMP),
('conflict-3', 'low-sugar', 'keto', 'warning', '低糖和生酮标签可能冲突', CURRENT_TIMESTAMP),
('conflict-4', 'dairy-free', 'high-calcium', 'warning', '无乳制品和高钙标签可能冲突', CURRENT_TIMESTAMP),
('conflict-5', 'gluten-free', 'high-fiber', 'warning', '无麸质和高纤维标签可能冲突', CURRENT_TIMESTAMP),
('conflict-6', 'vegetarian', 'high-omega3', 'warning', '素食和高omega-3标签可能冲突', CURRENT_TIMESTAMP),
('conflict-7', 'low-salt', 'heart-health', 'compatible', '低盐和护心标签兼容', CURRENT_TIMESTAMP),
('conflict-8', 'low-sugar', 'blood-sugar-control', 'compatible', '低糖和控糖标签兼容', CURRENT_TIMESTAMP),
('conflict-9', 'high-protein', 'muscle-gain', 'compatible', '高蛋白和增肌标签兼容', CURRENT_TIMESTAMP),
('conflict-10', 'high-fiber', 'gut-health', 'compatible', '高纤维和护肠标签兼容', CURRENT_TIMESTAMP),
('conflict-11', 'high-omega3', 'heart-health', 'compatible', '高omega-3和护心标签兼容', CURRENT_TIMESTAMP),
('conflict-12', 'low-fat', 'weight-loss', 'compatible', '低脂和减重标签兼容', CURRENT_TIMESTAMP),
('conflict-13', 'high-protein', 'weight-loss', 'compatible', '高蛋白和减重标签兼容', CURRENT_TIMESTAMP),
('conflict-14', 'high-calcium', 'children', 'compatible', '高钙和儿童标签兼容', CURRENT_TIMESTAMP),
('conflict-15', 'high-protein', 'children', 'compatible', '高蛋白和儿童标签兼容', CURRENT_TIMESTAMP); 