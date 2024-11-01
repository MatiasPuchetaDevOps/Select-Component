import React, { useEffect, useRef, useState } from "react";
import FormatComponent from "./FormatComponent";
import { VList } from "virtua";

function ChildrenSelect({
  arrayDropdown,
  onSelect,
  setSearchValue,
  setIsDropdownOpen,
  name,
  searchProperty,
  searchValue,
  clearSelect = false,
  isCategory,
  setFakeInput,
  selectedValueID,
  setSelectedValueID,
  handleDeletedMultiple,
  scrollSelect,
  setScrollSelect,
  isMultiple,
  customFormat,
  selectedClassName,
  height,
  dropHover,
}) {
  const listRef = useRef();
  const [highlightedIndex, setHighlightedIndex] = useState(scrollSelect || 0);

  const handleSelect = (item, idx) => {
    setScrollSelect(idx);
    const value =
      item._id ||
      item.name ||
      item.username ||
      item.full_name ||
      searchValue[searchProperty] ||
      item;
    if (isMultiple) {
      // Elimina el dato en el drop
      if (isMultiple && selectedValueID.includes(value)) {
        handleDeletedMultiple(
          item.name ||
            item.username ||
            item.full_name ||
            item._id ||
            searchValue[searchProperty] ||
            item
        );
        setSelectedValueID((prev) => prev.filter((item) => item !== value));
        return;
      }
      setSelectedValueID((prev) => [...prev, value]);
      setSearchValue((prev) => [
        ...prev,
        item.name ||
          item.username ||
          item.full_name ||
          item._id ||
          searchValue[searchProperty] ||
          item,
      ]);
    } else {
      setSelectedValueID(value);
      setSearchValue(item);
    }

    const selection = {
      type: name,
      item,
      name:
        item.name ||
        item.username ||
        item.full_name ||
        searchValue[searchProperty] ||
        item,
    };

    if (isMultiple) {
      const valueItem = arrayDropdown.filter(
        (item) =>
          (item._id ||
            item.name ||
            item.username ||
            item.full_name ||
            searchValue[searchProperty] ||
            item) === value
      )[0];
      onSelect([...selectedValueID, valueItem._id]);
    } else {
      onSelect(selection);
    }

    setFakeInput(true);
    isMultiple ? setIsDropdownOpen(true) : setIsDropdownOpen(false);
  };

  // Aplanar arrayDropdown para tener una lista lineal de opciones
  let count = 0;
  const flatOptions = arrayDropdown.flatMap((item, idx) =>
    isCategory
      ? [
          { type: "category", title: item.title, count: count++ },
          ...item.options.map((opt) => ({ ...opt, count: count++ })),
        ]
      : { ...item }
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, flatOptions.length - 1)
        );
      } else if (event.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        // Selecciona el ítem cuando se presiona Enter
        const arrayFilter = flatOptions.filter((item) => item.name);
        handleSelect(
          isCategory
            ? arrayFilter[highlightedIndex - 1].name
            : arrayDropdown[highlightedIndex],
          highlightedIndex
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [arrayDropdown, highlightedIndex]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToIndex(highlightedIndex);
    }
  }, [highlightedIndex]);

  useEffect(() => {
    if (clearSelect) {
      setSearchValue("");
      setSelectedValueID();
    }
  }, [clearSelect]);

  useEffect(() => {
    if (!isMultiple) {
      if (selectedValueID && listRef.current) {
        listRef.current.scrollToIndex(scrollSelect - 1 || 0);
      }
    }
  }, [selectedValueID, arrayDropdown]);

  const renderItem = (item, value, idx) => (
    <div
      key={value}
      className={`break-words py-2 ${
        dropHover ? dropHover : "hover:bg-slate-600"
      }  ${highlightedIndex === idx ? selectedClassName || "bg-slate-600" : ""}
        cursor-pointer ${
          isMultiple
            ? selectedValueID.includes(value)
              ? `${selectedClassName || "bg-[#2a3547]"} selected`
              : ""
            : selectedValueID === value
            ? `${selectedClassName || "bg-[#2a3547]"} selected`
            : ""
        } overflow-scroll rounded-md p-2`}
      onClick={() => handleSelect(isCategory ? value : item, idx)}
    >
      <FormatComponent
        item={item}
        customFormat={customFormat}
        defaultFormat={
          <div>
            {isCategory
              ? value
              : item.long_name ||
                item.name ||
                item.username ||
                item.full_name ||
                searchValue[searchProperty] ||
                item}
          </div>
        }
      />
    </div>
  );

  const renderOptions = () => {
    if (isCategory) {
      let count = 0;
      return flatOptions.map((item) =>
        item.title ? (
          <div
            key={item.title}
            className="text-gray-400 font-light text-[0.70rem]"
          >
            {item.title}
          </div>
        ) : (
          renderItem(item, item.name, ++count)
        )
      );
    } else {
      return arrayDropdown.map((item, idx) =>
        renderItem(item, item._id || item.name || item, idx)
      );
    }
  };

  const calculateHeightClassNormal = (length) => {
    if (length === 1) return "h-[2.2rem]";
    if (length === 2) return "h-[5rem]";
    if (length === 3) return "h-[7rem]";
    if (length === 4) return "h-[10rem]";
    return "h-40";
  };

  return arrayDropdown ? (
    <div
      className={`${
        height || calculateHeightClassNormal(arrayDropdown.length)
      }`}
    >
      <VList ref={listRef} className="scrollBar">
        {renderOptions()}
      </VList>
    </div>
  ) : null;
}

export default ChildrenSelect;
