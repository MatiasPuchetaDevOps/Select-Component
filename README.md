# 📦 SelectComponent

**`SelectComponent`** is a versatile selection component in React. It includes search, filtering, multi-select, and custom formatting options, making it easy to integrate and customize to fit your needs.

## 📥 Installation

To install the package, use the following command in your terminal:


```bash
npm install select-components
```

# Usage Examples

## Basic Selection


The **render** prop should be an array of objects containing the **name** property.

```jsx
const urgency = [
  { name: "Alta" },
  { name: "Media" },
  { name: "Baja" },
]);
<SelectComponent
  render={urgency}
  name="simpleSelect"
  placeholder="Seleccione una opción"
  onSelect={(value) => console.log("Seleccionado:", value)}
/>
```

# Compatibility with react-hook-form


Use **ControllerSelectComponent** to integrate SelectComponent with **react-hook-form**.

## Basic Controller

```jsx
<ControllerSelectComponent
  name={"urgency"}
  control={control}
  required={true}
  render={[{ name: "Alta" }, { name: "Media" }, { name: "Baja" }]}
  placeholder="Elija la urgencia"
/>
```

## Enable Search

Enable real-time search using an endpoint to fetch data.

```jsx
  <ControllerSelectComponent
    {...{
      name: "Sparepart_order",
      onSelect: handleOnSelect,
      placeholder: "Escribe el nombre repuesto",
      isSearch: true, // Activar búsqueda
      funtionSearch: getSpareParts,  Endpoint para la búsqueda
      control: control,
    }}
  />
```

## Custom Formatting

Define a custom format for each option.

```jsx
<SelectComponent
  name="formattedSelect"
  render={[{ name: "Alta" }, { name: "Media" }, { name: "Baja" }]}
  customFormat={(item) => <span>{item.customLabel}</span>}
/>
```

## Multi-Select

Enable the selection of multiple options.

```jsx
<SelectComponent
  name="multipleSelect"
  render={[{ name: "Alta" }, { name: "Media" }, { name: "Baja" }]}
  isMultiple={true}
  placeholder="Seleccione varias opciones"
/>
```

## By Category

Create sub-options organized by categories:

```jsx
  const unitOptions = [
    {
      title: "Adimensional",
      options: [{ name: "u" }]
    },
    {
      title: "Volumen",
      options: [
        { name: "m3" },
        { name: "cm3" },
        { name: "L" },
        { name: "ml" },
      ],
    },
    {
      title: "Masa",
      options: [
        { name: "kg" },
        { name: "g" },
        { name: "mg" },
      ],
    },
]
<SelectComponent
  name="advancedSelect"
  render = {unitOptions}
  searchProperty="title"
  isCategory={true}
  defaultValue="Option1"
/>

```

# ⚙️ Propiedades Disponibles

A continuación, se detallan las propiedades que puedes utilizar para configurar el componente según tus necesidades:

| Property         | Type     | Description                                                                         | Default  |
| ----------------- | -------- | ----------------------------------------------------------------------------------- | -------------------- |
| render            | function | Function to render each item in a custom way.	                                     | undefined            |
| name              | string   | Component name, useful in forms.	                                                   | undefined            |
| funtionSearch     | function | Function executed to perform custom search.	                                       | () => {}             |
| onSelect          | function | Function executed when an item is selected.                                         | () => {}             |
| isCategory        | boolean  | Displays categories within items.                                                   | undefined            |
| defaultValue      | string   | Default value displayed initially.                                                  | ""                   |
| searchProperty    | string   | Object property used to execute search or setter in the field.                      | "name"               |
| placeholder       | string   | Text displayed in the empty field.                                                  | ""                   |
| isSearch          | boolean  | Enables the search function.                                                        | false                |
| isFilter          | boolean  | Enables filtering of items (recommended when isSearch is false).                    | true                 |
| required          | boolean  | Defines if selection is mandatory.                                                   | true                 |
| isMultiple        | boolean  | Enables multiple selection.	                                                       | false                |
| customFormat      | function | Custom function to render each item, using the item as an argument.                 | undefined            |
| disabled          | boolean  | Disables the component when true.                                                    | false                |
| disabledClassName | string   | Custom CSS class when disabled..                                                     | undefined            |
| className         | string   | Custom CSS class to style the component.                                            | ""                   |
| selectedClassName | string   | Custom CSS class for selected option.                                               | undefined            |
| dropClassName     | string   | Custom CSS class for dropdown.                                                      | undefined            |
| dropHover         | string   | Custom CSS hover class for dropdown                                                 | undefined            |



 # Property Added for Controller

| Property          | Type	   | Description                                                                         | Default              |
| ----------------- | -------- | ----------------------------------------------------------------------------------- | -------------------- |
| returnString      | boolean  | Controls if a string or the object is returned.                                     | false                |
