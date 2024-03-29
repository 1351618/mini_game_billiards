import { PageWrapper } from "../../shared/ui/PageWrapper/PageWrapper";
import Canvas from "../../widgets/canvasWin/ui/Canvas";
import cls from "./home.module.scss";

export const Home = () => {
  return (
    <PageWrapper>
      <div className={cls.home}>
        <Canvas />
      </div>
    </PageWrapper>
  );
};
