import React, { useEffect } from "react";
import SelectComponent from "./SelectComponent";
import { Controller } from "react-hook-form";
import { useAlert } from "../../context/alertContext";

function ControllerSelectComponent({
  id,
  name,
  control,
  render,
  required = false,
  disabled = false,
  defaultValue,
  searchProperty = ["name"],
  placeholder = "",
  isCategory,
  className = "",
  isMultiple = false,
  optionsAlternatives = false,
  isSearch = false,
  funtionSearch = () => {},
  onSelect = () => {},
  customFormat,
  returnString = false,
  disabledClassName,
  dropClassName,
  selectedClassName,
  height,
  dropHover,
}) {
  const { showAlert } = useAlert();
  const handleValue = async (item, field) => {
    let value;

    if (isMultiple) {
      let items = [];
      item.map((item) => items.push(item._id || item.name || item));
      value = {
        type: name,
        name: items,
        item: items,
      };

      field.onChange(value);
      onSelect(value);
      return;
    }
    if (
      (item?.type === "enabled" ||
        item?.type === "status" ||
        item?.type === "state") &&
      !optionsAlternatives
    ) {
      value = item?.name === "Activo" ? true : false;
    } else {
      value = item?.item
        ? item?.item || item?.item._id || item?.item.name
        : item?.name;
    }
    if (returnString) {
      field.onChange(value.name);
    } else {
      field.onChange(value);
    }
    onSelect(item ? item : { item: undefined });
  };

  useEffect(() => {
    if (!name) {
      showAlert({
        msg: "No se encontro el name del select",
        status: 400,
      });
      return;
    }
  }, []);

  return (
    <Controller
      name={name ? name : ""}
      control={control}
      defaultValue={
        defaultValue === "Activo"
          ? true
          : defaultValue === "Inactivo"
          ? false
          : defaultValue
      }
      rules={{
        validate: (value) => {
          const req = defaultValue ? false : required;
          if (req && (value === null || value === undefined || value === "")) {
            return "El campo es requerido";
          }
          return true;
        },
      }}
      render={({ field }) => (
        <SelectComponent
          {...field}
          id={id}
          name={name}
          render={render}
          onSelect={(item) => handleValue(item, field)}
          disabled={disabled}
          className={className}
          required={required}
          defaultValue={defaultValue}
          funtionSearch={funtionSearch}
          searchProperty={searchProperty}
          placeholder={placeholder}
          isSearch={isSearch}
          isMultiple={isMultiple}
          disabledClassName={disabledClassName}
          dropClassName={dropClassName}
          selectedClassName={selectedClassName}
          height={height}
          dropHover={dropHover}
          isCategory={isCategory}
          customFormat={customFormat}
        />
      )}
    />
  );
}

export default ControllerSelectComponent;
