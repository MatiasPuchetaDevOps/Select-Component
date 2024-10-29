import React from "react";
import SelectComponent from "./SelectComponent";
import { Controller } from "react-hook-form";

function ControllerSelectComponent({
  id,
  name,
  control,
  render,
  required = false,
  type = "name",
  disabled = false,
  defaultValue,
  searchProperty = ["name"],
  placeholder = "",
  className = "",
  isMultiple = false,
  optionsAlternatives = false,
  isSearch = false,
  funtionSearch = () => {},
  onSelect = () => {},
  backGroundColor = "secondary",
  returnString = false,
}) {
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
      (item.type === "enabled" ||
        item.type === "status" ||
        item.type === "state") &&
      !optionsAlternatives
    ) {
      value = item.name === "Activo" ? true : false;
    } else {
      value = item.item
        ? item.item || item.item._id || item.item.name
        : item.name;
    }
    if (returnString) {
      field.onChange(value.name);
    } else {
      field.onChange(value);
    }
    onSelect(item);
  };

  return (
    <Controller
      name={name}
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
          backGroundColor={backGroundColor}
          isMultiple={isMultiple}
        />
      )}
    />
  );
}

export default ControllerSelectComponent;
