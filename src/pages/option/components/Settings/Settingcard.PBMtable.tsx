import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { defaultSettingsPBM, questions } from "./Settingcard.PBMtable.constant";

const EvaluationTable = () => {
  const [selectedValues, setSelectedValues] = useState(defaultSettingsPBM);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const getSettingsPBM = async () => {
      const settingsPBM = await chrome.storage.local.get(["settingsPBM"]);
      if (settingsPBM.settingsPBM) {
        setSelectedValues(settingsPBM.settingsPBM);
      } else {
        await chrome.storage.local.set({ settingsPBM: defaultSettingsPBM });
        setSelectedValues(defaultSettingsPBM);
      }
    };
    getSettingsPBM();
  }, []);

  useEffect(() => {
    if (selectedValues === defaultSettingsPBM) return;
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    chrome.storage.local.set({ settingsPBM: selectedValues });
    toast.success("Saved", {
      action: {
        label: "X",
        onClick: () => console.log("(#-_ゝ-)"),
      },
    });
  }, [selectedValues]);

  const renderRadioOptions = (questionId: number) => {
    let options;
    switch (questionId) {
      case 13:
        options = [
          "Wifi Rumah/Kos",
          "Internet HP",
          "Wifi Kampus",
          "Tethering Teman",
        ];
        break;
      case 14:
        options = ["Laptop", "HP", "Desktop"];
        break;
      case 15:
        options = ["Kuliah Online", "Tatap Muka"];
        break;
      case 16:
        options = ["Webex", "Ms Teams", "Lainnya"];
        break;
      case 12:
      case 25:
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32:
      case 33:
      case 34:
        options = ["Ya", "Tidak"];
        break;
      default:
        options = ["Ada", "Tidak"];
        break;
    }
    return (
      <RadioGroup
        name={String(questionId)}
        className="flex gap-4"
        // @ts-ignore
        value={selectedValues[questionId]}
        onValueChange={(value) =>
          setSelectedValues({ ...selectedValues, [questionId]: value })
        }
      >
        {options.map((option) => (
          <div key={option} className="flex items-center">
            <RadioGroupItem
              className="peer "
              value={option}
              id={`radio-${questionId}-${option}`}
            />
            <Label
              htmlFor={`radio-${questionId}-${option}`}
              className="cursor-pointer rounded-md border-2 border-muted p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground peer-checked:bg-accent peer-checked:text-accent-foreground"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  return (
    <Table className="mb-0">
      <TableHeader>
        <TableRow>
          <TableHead colSpan={4} className="text-center font-medium text-lg">
            Pertanyaan Evaluasi PBM
          </TableHead>
        </TableRow>
        <TableRow>
          <TableHead
            colSpan={4}
            className="text-center font-medium text-sm"
            id="mks_dosen"
          >
            [MIK1694201] Matkul gtw F | Dr. myudakk S.T., M.Cs. | BELUM
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((categoryData, index) => (
          <>
            <TableRow
              key={`category-${index}`}
              className="bg-gray-200 dark:bg-gray-800"
            >
              <TableCell className="font-bold">
                {categoryData.category}
              </TableCell>
              <TableCell colSpan={2} className="font-bold">
                {categoryData.categoryTitle}
              </TableCell>
              <TableCell className="font-bold">Jawaban</TableCell>
            </TableRow>
            {categoryData.questions.map((question) => (
              <TableRow key={`question-${question.id}`}>
                <TableCell></TableCell>
                <TableCell>{question.id}</TableCell>
                <TableCell>{question.text}</TableCell>
                <TableCell>{renderRadioOptions(question.id)}</TableCell>
              </TableRow>
            ))}
          </>
        ))}
      </TableBody>
    </Table>
  );
};

export default EvaluationTable;
