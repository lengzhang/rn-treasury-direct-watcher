import { useTreasuryDirectContext } from "@/contexts/TreasuryDirectContext";
import { useState, useEffect, useMemo } from "react";

const useAddWatcherModal = (
  isOpen: boolean,
  addWatcher: (type: string, term: string) => void
) => {
  const { types, terms } = useTreasuryDirectContext();

  const [selectedType, setSelectedType] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedType("");
        setSelectedTerm("");
      }, 100);
    }
  }, [isOpen]);

  const tdTypeList = useMemo(
    () => [...types].sort().map((type) => ({ label: type, value: type })),
    [types]
  );

  const tdTermList = useMemo(() => {
    if (!selectedType) return [];
    if (!terms[selectedType]) return [];
    return Object.values(terms[selectedType])
      .sort((a, b) => {
        if (a.Year !== undefined && b.Year !== undefined && a.Year !== b.Year) {
          return (a.Year || 0) - (b.Year || 0);
        }
        if (
          a.Month !== undefined &&
          b.Month !== undefined &&
          a.Month !== b.Month
        ) {
          return (a.Month || 0) - (b.Month || 0);
        }
        if (a.Week !== undefined && b.Week !== undefined && a.Week !== b.Week) {
          return (a.Week || 0) - (b.Week || 0);
        }
        if (a.Day !== undefined && b.Day !== undefined && a.Day !== b.Day) {
          return (a.Day || 0) - (b.Day || 0);
        }
        return a.term.localeCompare(b.term);
      })
      .map(({ term }) => ({ label: term, value: term }));
  }, [selectedType, terms]);

  const onValueChangeType = (value: string) => {
    setSelectedType(value);
    setSelectedTerm("");
  };

  const onValueChangeTerm = (value: string) => {
    setSelectedTerm(value);
  };

  const onSubmit = () => {
    addWatcher(selectedType, selectedTerm);
  };

  return {
    selectedType,
    selectedTerm,
    onValueChangeType,
    onValueChangeTerm,
    tdTypeList,
    tdTermList,
    onSubmit,
  };
};

export default useAddWatcherModal;
