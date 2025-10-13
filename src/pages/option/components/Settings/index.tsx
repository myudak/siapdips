import { useRef } from "react";
import EvaluationTable from "./Settingcard.PBMtable";
import SettingcardAwal from "./Settingcard.awal";
import SettingcardProfile from "./Settingcard.profile";
import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";
import LokasiFoodTruk from "./Settingcard.ft";
import NavCardSetting from "./Settingcard.navcard";
import KanbanBoard from "./TodoBoard";
import SettingMoodle from "./Settingcard.moodle";
import SettingJadwal from "./Settingcard.jadwal";

const SettingsSection = () => {
  const settingsRef = useRef<null | HTMLDivElement>(null);
  const PBMTableRef = useRef<null | HTMLDivElement>(null);
  const moodleHelperRef = useRef<null | HTMLDivElement>(null);

  useScrollToHashSection("PBMTable", PBMTableRef);
  useScrollToHashSection("sect1", settingsRef);
  useScrollToHashSection("moodleHelper", moodleHelperRef);

  return (
    <div
      ref={settingsRef}
      id="sect1"
      className="min-h-screen space-y-6 sm:space-y-8 lg:space-y-12"
    >
      <>
        <h1 className="text-xl sm:text-2xl lg:text-3xl pt-12 sm:pt-16 lg:pt-20 font-bold text-slate-900 dark:text-white text-center">
          ⚙️ Settings ~~&gt;
        </h1>
        <SettingcardAwal />
      </>
      <>
        <h1 className="text-xl sm:text-2xl lg:text-3xl pt-8 sm:pt-12 lg:pt-20 font-bold text-slate-900 dark:text-white text-center">
          NavCard
        </h1>
        <NavCardSetting />
      </>

      <>
        <h1
          id="TemplatePBM"
          ref={PBMTableRef}
          className="text-lg sm:text-xl lg:text-2xl pt-4 sm:pt-5 lg:pt-6 font-bold text-slate-900 dark:text-white text-center"
        >
          ~~ Template PBM
        </h1>
        <EvaluationTable />
      </>
      <>
        <h1 className="text-lg sm:text-xl lg:text-2xl pt-4 sm:pt-5 lg:pt-6 font-bold text-slate-900 dark:text-white text-center">
          ~~ Profilee ~~
        </h1>
        <SettingcardProfile />
      </>
      <>
        <h1
          id="foodTruk"
          className="text-lg sm:text-xl lg:text-2xl pt-4 sm:pt-5 lg:pt-6 font-bold text-slate-900 dark:text-white text-center"
        >
          Food TRUK {"{Helper}"} Settings
        </h1>
        <LokasiFoodTruk />
      </>
      <>
        <h1
          id="moodleHelper"
          className="text-lg sm:text-xl lg:text-2xl pt-4 sm:pt-5 lg:pt-6 font-bold text-slate-900 dark:text-white text-center"
          ref={moodleHelperRef}
        >
          Setting Moodle
        </h1>
        <SettingMoodle />
      </>
      <>
        <h1
          id="moodleHelper"
          className="text-lg sm:text-xl lg:text-2xl pt-4 sm:pt-5 lg:pt-6 font-bold text-slate-900 dark:text-white text-center"
          ref={moodleHelperRef}
        >
          Setting jadwal
        </h1>
        <SettingJadwal />
      </>
      <>
        <h1
          id="todoboard"
          className="text-lg sm:text-xl lg:text-2xl pt-4 sm:pt-5 lg:pt-6 font-bold text-slate-900 dark:text-white text-center"
        >
          TodoBoard
        </h1>
        <KanbanBoard />
      </>
    </div>
  );
};

export default SettingsSection;
