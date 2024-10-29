# 📦 SelectComponent

**`SelectComponent`** es un componente versátil de selección en React. Incluye búsqueda, filtrado, selección múltiple y opciones de formato personalizado, lo que facilita su integración y personalización según tus necesidades.

## 📥 Instalación

Para instalar el paquete, usa el siguiente comando en tu terminal:

```bash
npm install select-components
```

# Casos de uso

## Selección Básica

El prop render debe ser un array de objetos que contengan la propiedad name.

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

# Compatibilidad con react-hook-form

Utiliza ControllerSelectComponent para integrar SelectComponent con react-hook-form.

## Controller basico

```jsx
<ControllerSelectComponent
  name={"urgency"}
  control={control}
  required={true}
  render={[{ name: "Alta" }, { name: "Media" }, { name: "Baja" }]}
  placeholder="Elija la urgencia"
/>
```

## Activar Búsqueda

Permite la búsqueda en tiempo real utilizando un endpoint para obtener datos.

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

## Formato Personalizado

Permite definir un formato personalizado para cada opción.

```jsx
<SelectComponent
  name="formattedSelect"
  render={[{ name: "Alta" }, { name: "Media" }, { name: "Baja" }]}
  customFormat={(item) => <span>{item.customLabel}</span>}
/>
```

## Selección Múltiple

Habilita la selección de múltiples opciones.

```jsx
<SelectComponent
  name="multipleSelect"
  render={[{ name: "Alta" }, { name: "Media" }, { name: "Baja" }]}
  isMultiple={true}
  placeholder="Seleccione varias opciones"
/>
```

## Por categoria

Para crear subopciones organizadas por categorías:

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

| Propiedad         | Tipo     | Descripción                                                                         | Valor Predeterminado |
| ----------------- | -------- | ----------------------------------------------------------------------------------- | -------------------- |
| render            | function | Función para renderizar cada elemento de forma personalizada.                       | undefined            |
| name              | string   | Nombre del componente, útil en formularios.                                         | undefined            |
| funtionSearch     | function | Función que se ejecuta al realizar una búsqueda personalizada.                      | () => {}             |
| onSelect          | function | Función que se ejecuta cuando se selecciona un elemento.                            | () => {}             |
| isCategory        | boolean  | Muestra las categorías dentro de los elementos.                                     | undefined            |
| defaultValue      | string   | Valor predeterminado que se mostrará al iniciar.                                    | ""                   |
| searchProperty    | string   | Propiedad del objeto para ejecutar la búsqueda o seter en el campo.                 | "name"               |
| placeholder       | string   | Texto que aparecerá en el campo cuando esté vacío.                                  | ""                   |
| isSearch          | boolean  | Habilita la función de búsqueda.                                                    | false                |
| isFilter          | boolean  | Habilita el filtrado de elementos (se recomienda cuando isSearch es false).         | true                 |
| required          | boolean  | Define si la selección es obligatoria.                                              | true                 |
| isMultiple        | boolean  | Habilita la selección múltiple.                                                     | false                |
| customFormat      | function | Función personalizada para renderizar cada elemento, usando el item como argumento. | undefined            |
| disabled          | boolean  | Desactiva el componente cuando está en true.                                        | false                |
| disabledClassName | string   | Clase CSS personalizada cuando esta desactivado.                                    | undefined            |
| className         | string   | Clase CSS personalizada para estilizar el componente.                               | ""                   |
| selectedClassName | string   | Clase CSS personalizada de la opcion seleccionada.                                  | undefined            |
| dropClassName     | string   | Clase CSS personalizada del desplegable.                                            | undefined            |
| dropHover         | string   | Clase CSS personalizada hover del drop.                                             | undefined            |



 # Propiedad añadida para el Controller

| Propiedad         | Tipo     | Descripción                                                                         | Valor Predeterminado |
| ----------------- | -------- | ----------------------------------------------------------------------------------- | -------------------- |
| returnString      | boolean  | Controla si se devuelve un string o el objeto                                        | false                |
