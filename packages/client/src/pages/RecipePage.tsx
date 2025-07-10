import { useParams } from "@tanstack/react-router";

const RecipePage = () => {
  const { id } = useParams({ from: "/recipe/$id" });
  // Currently only using id internally without rendering it
  return <div>菜谱页面</div>;
};

export default RecipePage;
