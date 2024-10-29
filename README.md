# 📦 SelectComponent

**`SelectComponent`** es un componente versátil de selección en React. Incluye búsqueda, filtrado, selección múltiple y opciones de formato personalizado, lo que facilita su integración y personalización según tus necesidades.

## 📥 Instalación

Para instalar el paquete, usa el siguiente comando en tu terminal:

```bash
npm install select-components
```

# 🚀 Uso Rápido

Puedes importar y utilizar SelectComponent en tu proyecto de React. Aquí tienes un ejemplo básico:

```sh
import { SelectComponent } from 'select-components';

function App() {
  return (
    <SelectComponent
    name="exampleSelect"
    placeholder="Seleccione una opción"
    isSearch={true}
    customFormat={(item) => <span>{item.customText}</span>}
    onSelect={(value) => console.log("Seleccionado:", value)}
    />
  )
}
```

## 📝 Ejemplos de Uso

Selección Básica

```sh
<SelectComponent
  name="simpleSelect"
  placeholder="Seleccione una opción"
  onSelect={(value) => console.log("Seleccionado:", value)}
/>
```

## Activar Búsqueda

```sh
<SelectComponent
  name="searchSelect"
  isSearch={true}
  funtionSearch={(query) => console.log("Buscando:", query)}
  placeholder="Buscar elementos"
/>

```

## Formato Personalizado

```sh
<SelectComponent
  name="formattedSelect"
  customFormat={(item) => <span>{item.customLabel}</span>}
/>
```

## Selección Múltiple

```sh
<SelectComponent
  name="multipleSelect"
  isMultiple={true}
  placeholder="Seleccione varias opciones"
/>
```

## Ejemplo Completo

Este ejemplo incluye propiedades avanzadas como searchProperty, isCategory, y defaultValue.

```sh
<SelectComponent
  name="advancedSelect"
  searchProperty="title"
  isCategory={true}
  defaultValue="Option1"
/>
```

# ⚙️ Propiedades Disponibles

A continuación, se detallan las propiedades que puedes utilizar para configurar el componente según tus necesidades:

| Propiedad       | Tipo     | Descripción                                                                   | Valor Predeterminado      |
|------------------|----------|-------------------------------------------------------------------------------|---------------------------|
| render           | function | Función para renderizar cada elemento de forma personalizada.                  | undefined                 |
| name             | string   | Nombre del componente, útil en formularios.                                   | undefined                 |
| funtionSearch    | function | Función que se ejecuta al realizar una búsqueda personalizada.                | () => {}                  |
| onSelect         | function | Función que se ejecuta cuando se selecciona un elemento.                     | () => {}                  |
| isCategory       | boolean  | Muestra las categorías dentro de los elementos.                               | undefined                 |
| defaultValue     | string   | Valor predeterminado que se mostrará al iniciar.                              | ""                        |
| searchProperty    | string   | Propiedad del objeto para ejecutar la búsqueda.                               | "name"                    |
| disabled         | boolean  | Desactiva el componente cuando está en true.                                 | false                     |
| placeholder      | string   | Texto que aparecerá en el campo cuando esté vacío.                           | ""                        |
| backGroundColor  | string   | Define el color de fondo del componente.                                      | "secondary"               |
| isSearch         | boolean  | Habilita la función de búsqueda.                                             | false                     |
| isFilter         | boolean  | Habilita el filtrado de elementos (se recomienda cuando isSearch es false).  | true                      |
| className        | string   | Clase CSS personalizada para estilizar el componente.                         | ""                        |
| required         | boolean  | Define si la selección es obligatoria.                                       | true                      |
| isMultiple       | boolean  | Habilita la selección múltiple.                                             | false                     |
| customFormat     | function | Función personalizada para renderizar cada elemento, usando el item como argumento.| undefined                 |

