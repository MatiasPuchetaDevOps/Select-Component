import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import { debounce } from "lodash";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useClearSelect } from "../../context/Select/ClearSelectContext";
import ChildrenSelect from "./ChildrenSelect";
import FormatComponent from "./FormatComponent";

const SelectComponent = forwardRef(
  (
    {
      id,
      render,
      name,
      funtionSearch = () => {},
      onSelect = () => {},
      type,
      isCategory,
      defaultValue = "",
      searchProperty,
      disabled = false,
      placeholder = "",
      backGroundColor = "secondary",
      isSearch = false,
      isFilter = !isSearch,
      className = "",
      required = true,
      isMultiple = false,
      ...props
    },
    ref
  ) => {
    // Estados del componente
    const [searchValue, setSearchValue] = useState(isMultiple ? [] : "");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para mostrar/ocultar el dropdown
    const [selectedValueID, setSelectedValueID] = useState(
      isMultiple ? [] : null
    );
    const [arrayDropdown, setArrayDropdown] = useState([]);
    // Obtener el estado de limpieza del contexto
    const { clearSelectMap } = useClearSelect();
    // Referencias para manejar clicks fuera del modal
    const modalRef = useRef(null);
    const inputRef = useRef(null);
    const [fakeInput, setFakeInput] = useState(false);
    const [inputSelect, setInputSelect] = useState(false);
    const [scrollSelect, setScrollSelect] = useState(false);
    const [hasRenderedOnce, setHasRenderedOnce] = useState(false);
    // Setea los valores iniciales
    useEffect(() => {
      if (render) {
        setArrayDropdown(render);
      }
    }, [render]);

    useEffect(() => {
      if (
        render?.length > 0 &&
        !hasRenderedOnce &&
        props.value &&
        !isMultiple
      ) {
        const foundItem = render.find((item) =>
          Object.values(item).some((value) => value === props.value)
        );
        setSearchValue(foundItem ? foundItem.name : props.value);
        setHasRenderedOnce(true); // Marcar que ya se ejecutó una vez
      } else if (props.value && !isMultiple) {
        setSearchValue(props.value);
      }
    }, [props.value, render]);

    // Manejo de la busqueda de elementos
    const handleSeach = async (searchText) => {
      const res = await funtionSearch(searchText);
      if (res.length > 0) {
        setArrayDropdown(res);
      } else {
        setArrayDropdown([]);
      }
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      }
    };

    // Debounce para la búsqueda con un retraso de 300ms
    const handleSearchDebounced = useCallback(
      debounce((searchText) => {
        handleSeach(searchText);
      }, 300),
      [funtionSearch] // Dependencias
    );

    // Manejo de cambios en el input
    const handleSearchChange = async (e) => {
      const value = e.target.value;
      setSearchValue(value);

      // Ejecutar la función de búsqueda y setear el array de resultados
      if (isSearch && value.length >= 2) {
        const res = await handleSearchDebounced(value);
        if (res) {
          setArrayDropdown(res);
        }
      }

      if (isSearch && value.length < 2) {
        setArrayDropdown([]);
      }

      if (isFilter) {
        let renderComplete;

        if (isCategory) {
          // Filtrar por categoría
          renderComplete = render
            .map((item) => {
              // Filtrar las subopciones que coincidan con el valor de búsqueda
              const filteredOptions = item.options.filter((subItem) =>
                subItem.name.toLowerCase().includes(value.toLowerCase())
              );

              // Retornar el objeto con las opciones filtradas si hay coincidencias
              if (filteredOptions.length > 0) {
                return { ...item, options: filteredOptions };
              }

              // Filtrar el objeto si no hay coincidencias
              return null;
            })
            .filter((item) => item !== null); // Eliminar categorías sin coincidencias
        } else {
          // Filtrar normalmente por searchProperty
          const ArrayComplete = render;
          renderComplete = ArrayComplete.filter((item) => {
            if (Array.isArray(searchProperty)) {
              // Si searchProperty es un array, buscamos en cada propiedad
              return searchProperty.some((prop) =>
                item[prop]?.toLowerCase().includes(value.toLowerCase())
              );
            } else {
              // Si searchProperty es un string, realizamos la búsqueda normal
              return item[searchProperty]
                ?.toLowerCase()
                .includes(value.toLowerCase());
            }
          });
        }

        setArrayDropdown(renderComplete);
      }
    };

    // Efecto para cerrar el dropdown si se hace clic fuera del input o modal
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          !modalRef.current?.contains(event.target) &&
          !inputRef.current?.contains(event.target)
        ) {
          setFakeInput(true);
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen)
        document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    // Para detectar y ajustar la posición del dropdown cuando haya scroll
    const handleScroll = () => {
      if (isDropdownOpen) {
        const inputReact = inputRef.current.getBoundingClientRect();
        const dropdownHeight = modalRef.current?.offsetHeight || 0; // Altura del dropdown
        const spaceBelow = window.innerHeight - inputReact.bottom - 100; // Espacio disponible debajo del input

        const input = {
          position: "fixed",
          top: inputReact.top + window.scrollY + 50,
          bottom: inputReact.bottom + window.scrollY,
          left: inputReact.left + window.scrollX,
          right: inputReact.right,
          width: inputReact.width,
          height: spaceBelow >= dropdownHeight ? "top" : "bottom",
        };
        setInputSelect(input);
      }
    };

    useEffect(() => {
      if (arrayDropdown) {
        handleScroll();
      }
    }, [arrayDropdown]);

    useEffect(() => {
      handleScroll();
      // Escuchar el evento de scroll
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        // Limpiar evento de scroll cuando se desmonte el componente
        window.removeEventListener("scroll", handleScroll, true);
      };
    }, [isDropdownOpen]);

    // Efecto para limpiar el input cuando clearSelectMap[id] cambia
    useEffect(() => {
      if (clearSelectMap[id]) {
        setSelectedValueID();
        if (!isMultiple) {
          setSearchValue("");
          if (isSearch) {
            setArrayDropdown([]);
          }
        } else {
          setSearchValue([]);
          onSelect([]);
        }
      }
    }, [clearSelectMap, id]);

    // Función para manejar el ícono de la derecha
    const renderRightIcon = () => {
      if (isDropdownOpen) {
        return (
          <Icon
            className={`text-gray-400 ${
              inputSelect.height === "bottom" ? "rotate-180" : ""
            }`}
            icon="iconamoon:arrow-down-2"
          />
        );
      }
      if (isMultiple) {
        return;
      }
      if (searchValue && !isMultiple) {
        return (
          <Icon
            onClick={() => {
              setSearchValue(""),
                setSelectedValueID(),
                setIsDropdownOpen(render),
                onSelect([]); // Limpiar input
            }}
            className="text-gray-400 cursor-pointer"
            icon="teenyicons:x-small-outline"
          />
        );
      }
      return <Icon className="text-gray-400" icon="ph:magnifying-glass" />;
    };

    // Función para manejar el valor por defecto
    const handleSetDefault = () => {
      if (isSearch && defaultValue === "") {
        return;
      }
      if (isSearch && arrayDropdown) {
        const foundItem = arrayDropdown.find((item) =>
          Object.values(item).some((value) => value === defaultValue)
        );
        setSearchValue(foundItem ? foundItem.name : defaultValue);
        setSelectedValueID(defaultValue);
      }
      if (defaultValue && arrayDropdown && render) {
        const foundItem = render.find((item) =>
          Object.values(item).some((value) => value === defaultValue)
        );
        setSearchValue(foundItem ? foundItem.name : defaultValue);
        setSelectedValueID(defaultValue);
      }
    };

    // Función para manejar el valor por defecto multiple
    const handleDefauldMultiple = () => {
      if (defaultValue && render.length > 0) {
        const defaultArray =
          typeof defaultValue === "string" || defaultValue.length === undefined
            ? [defaultValue]
            : defaultValue;

        const foundItem = render.filter((item) => {
          // Verificamos si el primer elemento de defaultArray es un string
          if (typeof defaultArray[0] === "string") {
            // Si es un array de strings, usamos includes
            return defaultArray.includes(
              item._id || item.name || item.username || item
            );
          } else {
            // Si es un array de objetos, usamos some para comparar propiedades
            return defaultArray.some(
              (defaultObj) =>
                (item._id && item._id === defaultObj._id) ||
                (item.name && item.name === defaultObj.name) ||
                (item.username && item.username === defaultObj.username)
            );
          }
        });

        if (foundItem && foundItem.length > 0) {
          const array = [...searchValue, ...foundItem];
          setSelectedValueID(defaultArray);
          return array;
        } else {
          setSelectedValueID([]);
          return [];
        }
      }
    };

    useEffect(() => {
      if (isMultiple) {
        // setea el defaultValue en el input si es multiple
        const defaultValue = handleDefauldMultiple();
        const array = defaultValue
          ? [...searchValue, ...defaultValue]
          : searchValue;

        //Eliminmar duplicados
        const foundItemWithoutDuplicates = array.reduce((acc, current) => {
          const x = acc.find(
            (item) =>
              (item.name || item.username || item._id || item) ===
              (current.name || current.username || current._id || current)
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        if (
          foundItemWithoutDuplicates?.length > 0 &&
          defaultValue?.length > 0
        ) {
          setSearchValue(foundItemWithoutDuplicates);
        }
      } else {
        handleSetDefault();
      }
    }, [defaultValue, render]);

    const handleDeletedMultiple = (item) => {
      if (isMultiple) {
        const valueItem =
          item.name || item.username || item.description || item;
        const objDeleted = searchValue.find(
          (item) =>
            (item.name || item.username || item.description || item) ===
            valueItem
        );
        if (objDeleted) {
          const newArray = searchValue.filter(
            (item) =>
              (item.name || item.username || item.description || item) !==
              (objDeleted.name ||
                objDeleted.username ||
                objDeleted.description ||
                objDeleted)
          );

          setSearchValue(newArray);
        }

        // Elimina el dato en el drop
        const value = render.filter((item) =>
          Object.values(item).includes(valueItem)
        )[0];
        if (selectedValueID.includes(value._id)) {
          const newArray = selectedValueID.filter((item) => item !== value._id);
          onSelect(newArray);
          setSelectedValueID(newArray);
        }
      }
    };

    return (
      <div id={id} className={`w-full text-left ${className}`}>
        {/* Input de búsqueda */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            multiple={isMultiple}
            className={`select-format disabled:bg-[#2a3547]  ${
              !disabled && "px-2"
            } pr-8 `}
            value={
              searchValue?.long_name ||
              searchValue?.name ||
              searchValue?.username ||
              searchValue?.description ||
              searchValue?.full_name ||
              searchValue ||
              ""
            }
            disabled={disabled}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
            onf
            onClick={() => setIsDropdownOpen(true)}
            placeholder={placeholder}
          />

          {isMultiple && (
            <div
              onClick={() => {
                if (disabled) {
                  return;
                }
                setFakeInput(false);
                setIsDropdownOpen(true);
                setTimeout(() => {
                  inputRef.current.focus();
                }, 0);
              }}
              className={`h-10 bg-secondary ${
                arrayDropdown.length > 0 ? "text-white" : "text-gray-400"
              } w-full rounded-md hover:outline hover:outline-none focus:outline-none; absolute top-0 left-0 z-50 truncate py-1 flex items-center ${
                disabled ? "bg-modal disabled-style" : ""
              } `}
            >
              <div className="px-2 pr-8  w-[96%] truncate">
                {searchValue ? (
                  <FormatComponent
                    item={searchValue}
                    type={type}
                    defaultFormat={
                      <div className="flex w-full flex-wrap h-10 overflow-scroll gap-2">
                        {searchValue.map((item, idx) => (
                          <div
                            className=" flex items-center gap-2  rounded-md"
                            key={`item-${idx} `}
                          >
                            {item.name ||
                              item.username ||
                              item.full_name ||
                              item.description ||
                              item}
                            {!disabled && (
                              <span
                                className="cursor-pointer "
                                onClick={() => handleDeletedMultiple(item)}
                              >
                                <Icon icon="material-symbols-light:close" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    }
                  />
                ) : placeholder ? (
                  placeholder
                ) : null}
              </div>
              {/* Ícono derecho dentro del input */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {!disabled && renderRightIcon()}
              </div>
            </div>
          )}

          {fakeInput && !isMultiple && (
            <div
              onClick={() => {
                setFakeInput(false);
                setIsDropdownOpen(true);
                setTimeout(() => {
                  inputRef.current.focus();
                }, 0);
              }}
              className={`h-10 bg-secondary ${
                arrayDropdown.length > 0 && searchValue
                  ? "text-white"
                  : "text-gray-400"
              } w-full rounded-md hover:outline hover:outline-none focus:outline-none; absolute top-0 left-0 z-50 truncate py-1 flex items-center ${
                disabled ? "bg-modal disabled-style" : ""
              } `}
            >
              <div className="px-2 pr-8  w-[96%] truncate">
                {searchValue ? (
                  <FormatComponent
                    item={searchValue}
                    type={type}
                    defaultFormat={
                      <div>
                        {" "}
                        {searchValue.name ||
                          searchValue.username ||
                          searchValue.description ||
                          searchValue.full_name ||
                          searchValue}
                      </div>
                    }
                  />
                ) : placeholder ? (
                  placeholder
                ) : null}
              </div>
              {/* Ícono derecho dentro del input */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {!disabled && renderRightIcon()}
              </div>
            </div>
          )}

          {/* Ícono derecho dentro del input */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {!disabled && renderRightIcon()}
          </div>
        </div>

        {/* Dropdown de resultados */}
        {isDropdownOpen && (
          <>
            {arrayDropdown && arrayDropdown.length > 0 ? (
              <div
                onMouseDown={(event) => event.preventDefault()}
                style={{
                  position: `fixed`,
                  transform: "translateY(0.1%) scale(1)",
                  top:
                    inputSelect.height === "top"
                      ? `${inputSelect.top}px`
                      : `${
                          inputSelect.top - modalRef.current?.offsetHeight - 60
                        }px`,
                  width: `${inputSelect.width}px`,
                }}
                ref={modalRef}
                className={` z-[2147483647]  ${
                  backGroundColor === "modal" ? "bg-modal" : "bg-[#3a475a]"
                } rounded-md scrollBar p-2 max-h-60  fade-in shadow-lg overflow-scroll 
            `}
              >
                <ChildrenSelect
                  {...{
                    arrayDropdown,
                    onSelect,
                    searchValue,
                    id,
                    setSearchValue,
                    setIsDropdownOpen,
                    type,
                    name,
                    isCategory,
                    searchProperty,
                    backGroundColor,
                    selectedValueID,
                    setSelectedValueID,
                    handleDeletedMultiple,
                    setFakeInput,
                    isMultiple,
                    scrollSelect,
                    setScrollSelect,
                  }}
                />
              </div>
            ) : isSearch ? (
              <div
                style={{
                  position: `fixed`,
                  transform: "translateY(0.1%) scale(1)",
                  top:
                    inputSelect.height === "top"
                      ? `${inputSelect.top}px`
                      : `${
                          inputSelect.top - modalRef.current?.offsetHeight - 60
                        }px`,
                  width: `${inputSelect.width}px`,
                }}
                ref={modalRef}
                className={` z-[2147483647]  ${
                  backGroundColor === "modal" ? "bg-modal" : "bg-[#3a475a]"
                } rounded-md scrollBar p-2 max-h-60  fade-in shadow-lg overflow-scroll 
          `}
              >
                <p className="text-gray-400">
                  Escriba para realizar la búsqueda
                </p>
              </div>
            ) : (
              <div
                style={{
                  position: `fixed`,
                  transform: "translateY(0.1%) scale(1)",
                  top:
                    inputSelect.height === "top"
                      ? `${inputSelect.top}px`
                      : `${
                          inputSelect.top - modalRef.current?.offsetHeight - 60
                        }px`,
                  width: `${inputSelect.width}px`,
                }}
                ref={modalRef}
                className={` z-[2147483647]  ${
                  backGroundColor === "modal" ? "bg-modal" : "bg-[#3a475a]"
                } rounded-md scrollBar p-2 max-h-60  fade-in shadow-lg overflow-scroll 
            `}
              >
                <p className="text-gray-400">No se encontraron resultados</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

export default SelectComponent;
