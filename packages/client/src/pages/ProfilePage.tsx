import FunctionMenu from "@/components/profile/FunctionMenu";
import TastePreferences from "@/components/profile/TastePreferences";
import FoodPreferences from "@/components/profile/FoodPreferences";
import CuisinePreferences from "@/components/profile/CuisinePreferences";

const ProfilePage = () => {
  // 桌面端Card高度配置
  const desktopCardHeight = "lg:h-[600px] lg:flex lg:flex-col";

  return (
    <div className="flex flex-col flex-1 min-h-0 p-4 space-y-6">
      {/* 响应式网格布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
        {/* 功能菜单 */}
        <FunctionMenu className={desktopCardHeight} />

        {/* 口味偏好 */}
        <TastePreferences className={desktopCardHeight} />

        {/* 菜系偏好 */}
        <CuisinePreferences className={desktopCardHeight} />

        {/* 食物偏好 */}
        <FoodPreferences className={desktopCardHeight} />
      </div>
    </div>
  );
};

export default ProfilePage;
