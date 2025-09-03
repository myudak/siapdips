import Badge3D from "./components/Badge3D/Badge3D";
import Navbar from "./components/Navbar/Navbar";
import { DonutChart } from "@/pages/job/components/DonutChart/DonutChart";
import ActivityCalendar from "./components/ActivityCalendar/ActivityCalendar";
import TableJob from "./components/TableJob/TableJob";
import ResumeCarousel from "./components/ResumeCarousel/ResumeCarousel";
import ToolSeperator from "./components/ToolSeperator";
import GoalProgress from "./components/GoalProgress/GoalProgress";
import ProductiveTools from "./components/ProductiveTools/ProductiveTools";
import KanbanBoardPage from "./components/MyKanban";
import FooterPage from "./components/FooterPage";

const App = () => {
  return (
    <>
      <div className="p-4 relative ">
        <Navbar />

        <div className="flex w-full">
          <div className="w-2/5">
            <Badge3D />
          </div>
          <div className="w-3/5 p-8 flex flex-col gap-3">
            <div className="h-3/4 w-full">
              <DonutChart />
            </div>
            <div className="h-auto w-full">
              <GoalProgress />
            </div>
          </div>
        </div>

        <div className="flex mx-9 my-5 gap-9 flex-col">
          <ActivityCalendar />
          <TableJob />
          <ToolSeperator />
          <ResumeCarousel />
          <ProductiveTools />
          <KanbanBoardPage />
          <FooterPage />
        </div>
      </div>
    </>
  );
};

export default App;
