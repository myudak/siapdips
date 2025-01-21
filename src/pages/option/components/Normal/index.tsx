import { useRef } from "react";
import EvaluationTable from "./Settingcard.PBMtable";
import SettingcardAwal from "./Settingcard.awal";
import SettingcardProfile from "./Settingcard.profile";
import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";

const Nromal = () => {
  const settingsRef = useRef<null | HTMLDivElement>(null);
  const PBMTableRef = useRef<null | HTMLDivElement>(null);

  useScrollToHashSection("PBMTable", PBMTableRef);
  useScrollToHashSection("sect1", settingsRef);

  return (
    <div ref={settingsRef} id="sect1" className="min-h-screen mx-36 space-y-6">
      <>
        <h1 className="text-2xl pt-20 font-bold text-slate-900 dark:text-white text-center">
          ⚙️ Settings ~~&gt;
        </h1>
        <SettingcardAwal />
      </>
      <>
        <h1
          ref={PBMTableRef}
          className="text-2xl pt-5 font-bold text-slate-900 dark:text-white text-center"
        >
          ~~ Template PBM
        </h1>
        <EvaluationTable />
      </>
      <>
        <h1 className="text-2xl pt-5 font-bold text-slate-900 dark:text-white text-center">
          Profilee ~~
        </h1>
        <SettingcardProfile />
      </>
    </div>
  );
};

export default Nromal;
