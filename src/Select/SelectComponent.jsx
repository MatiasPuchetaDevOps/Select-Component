import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { debounce, isArray } from "lodash";
import { Icon } from "@iconify/react/dist/iconify.js";
import ChildrenSelect from "./ChildrenSelect";
import FormatComponent from "./FormatComponent";
import { Spinner } from "@material-tailwind/react";

const SelectComponent = forwardRef(
  (
    {
      render,
      name,
      funtionSearch = () => {},
      onSelect = () => {},
      isCategory,
      defaultValue = "",
      searchProperty = "name",
      disabled = false,
      placeholder = "",
      isSearch = false,
      isFilter = !isSearch,
      className = "",
      required = true,
      isMultiple = false,
      customFormat,
      disabledClassName,
      dropClassName,
      selectedClassName,
      height,
      dropHover,
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
    // Referencias para manejar los clicks fuera del modal
    const modalRef = useRef(null);
    const inputRef = useRef(null);
    const [fakeInput, setFakeInput] = useState(false);
    const [inputSelect, setInputSelect] = useState(false);
    const [scrollSelect, setScrollSelect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clickClose, setClickClose] = useState(false);

    // Setea los valores iniciales
    useEffect(() => {
      if (render) {
        setArrayDropdown(render);
      }
    }, [render]);

    const clearValueSelect = () => {
      setSearchValue("");
      setSelectedValueID(null);
      setFakeInput(false);
      setArrayDropdown([]);
    }

    useImperativeHandle(ref, () => ({
      clearValueSelect,
    }));
  

    useEffect(() => {
      // Para reSetear el input con sel setValue("")
      if (props.value === `` && isMultiple && !clickClose) {
        setSearchValue([]);
        setFakeInput(false);
        isSearch && setArrayDropdown([]);
      }
      if (props.value === `` && !isMultiple && !clickClose) {
        setSearchValue("");
        setFakeInput(false);
        isSearch && setArrayDropdown([]);
      }

      // Setea los valores iniciales definidos por el setValue de reack-hook-form
      if (render?.length > 0 && props.value && !isMultiple && !clickClose) {
        const foundItem = render.find((item) =>
          Object.values(item).some((value) => value === props.value)
        );
        setSearchValue(foundItem ? foundItem.name : props.value);
      } else if (props.value && !isMultiple && !clickClose) {
        setSearchValue(props.value);
      }
    }, [props.value, selectedValueID, render]);

    // Manejo de la búsqueda de elementos
    const handleSeach = async (searchText) => {
      setLoading(true);
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      }
      const res = await funtionSearch(searchText);
      if (res?.length > 0) {
        setArrayDropdown(res);
      } else {
        setArrayDropdown([]);
      }
      setLoading(false);
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
      if (isSearch && value?.length >= 2) {
        const res = await handleSearchDebounced(value);
        if (res) {
          setArrayDropdown(res);
        }
      }

      if (isSearch && value?.length < 2) {
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
              if (filteredOptions?.length > 0) {
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
              setClickClose(true);
              props.value = "";
              setSearchValue(""),
                setSelectedValueID(),
                setArrayDropdown(isSearch ? [] : render),
                setIsDropdownOpen(false);
              !isSearch && onSelect("");
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
      if (defaultValue && render?.length > 0) {
        const defaultArray =
          typeof defaultValue === "string" || defaultValue?.length === undefined
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

        if (foundItem && foundItem?.length > 0) {
          const array = [...searchValue, ...foundItem];
          setSelectedValueID(defaultArray);
          return array;
        } else {
          setSelectedValueID([]);
          return [];
        }
      }
    };

    // Función para manejar el valor por defecto
    useEffect(() => {
      if (isMultiple) {
        // setea el defaultValue en el input si es multiple
        const defaultValue = handleDefauldMultiple();
        let array = defaultValue
          ? [...searchValue, ...defaultValue]
          : searchValue;
        if (!isArray(array)) {
          array = [];
        }
        //Eliminar duplicados
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

    // Función para manejar el valor eliminado
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
      <div className="relative w-full text-left">
        {/* Input de búsqueda */}
        <div className="relative w-full text-left">
          <input
            ref={inputRef}
            type="text"
            className={`px-2 ${
              disabled
                ? disabledClassName ||
                  className ||
                  " h-10 bg-[#3A4659] text-gray-400 w-full rounded-md hover:outline hover:outline-none focus:outline-none "
                : `${
                    className ||
                    "h-10 bg-[#3A4659] text-white w-full rounded-md hover:outline hover:outline-none focus:outline-none"
                  } }`
            }`}
            multiple={isMultiple}
            value={
              searchValue === true
                ? "Activo"
                : searchValue === false
                ? "Inactivo"
                : searchValue?.long_name ||
                  searchValue?.name ||
                  searchValue?.username ||
                  searchValue?.description ||
                  searchValue?.full_name ||
                  searchValue[searchProperty] ||
                  searchValue ||
                  ""
            }
            disabled={disabled}
            onChange={handleSearchChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setIsDropdownOpen(false)}
            onClick={() => setIsDropdownOpen(true)}
            placeholder={placeholder}
          />
          {/* Ícono derecho dentro del input */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {!disabled && renderRightIcon()}
          </div>

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
              className={`${
                disabled
                  ? `${
                      disabledClassName ||
                      className ||
                      "h-10 bg-[#3A4659] text-white w-full rounded-md hover:outline-none focus:outline-none"
                    } absolute w-full top-0 left-0 truncate py-1 flex items-center`
                  : `${
                      className ||
                      "h-10 px-2 bg-[#3A4659] text-white w-full rounded-md hover:outline-none focus:outline-none"
                    } absolute w-full top-0 left-0 truncate py-1 flex items-center`
              }
            `}
            >
              <div
                className={`"pr-8 ${disabled ? "" : "px-2"} ${
                  !searchValue && "text-gray-400"
                } w-[96%] truncate`}
              >
                {searchValue ? (
                  <FormatComponent
                    item={searchValue}
                    customFormat={customFormat}
                    defaultFormat={
                      <div className="flex w-full flex-wrap h-10 overflow-scroll gap-2">
                        {Array.isArray(searchValue) ? (
                          searchValue?.map((item, idx) => (
                            <div
                              className=" flex items-center gap-2  rounded-md"
                              key={`item-${idx} `}
                            >
                              {item.name ||
                                item.username ||
                                item.full_name ||
                                item.description ||
                                searchValue[searchProperty] ||
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
                          ))
                        ) : (
                          <div>
                            {searchValue === true
                              ? "Activo"
                              : searchValue === false
                              ? "Inactivo"
                              : searchValue?.long_name ||
                                searchValue.name ||
                                searchValue.username ||
                                searchValue.description ||
                                searchValue.full_name ||
                                searchValue[searchProperty] ||
                                searchValue}
                          </div>
                        )}
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
                  inputRef?.current?.focus();
                }, 0);
              }}
              className={`${
                disabled
                  ? disabledClassName ||
                    className + "text-gray-400" ||
                    "h-10 px-2 bg-[#3A4659] text-white w-full rounded-md hover:outline hover:outline-none focus:outline-none "
                  : className ||
                    "h-10  bg-[#3A4659] text-white w-full rounded-md hover:outline hover:outline-none focus:outline-none"
              } absolute top-0 left-0 z-50 truncate py-1 flex items-center ${
                arrayDropdown?.length > 0 && searchValue
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`pr-8 px-2 w-[96%] red truncate ${
                  !searchValue && "text-gray-400"
                }`}
              >
                {searchValue ? (
                  <FormatComponent
                    item={searchValue}
                    customFormat={customFormat}
                    defaultFormat={
                      <div>
                        {searchValue === true
                          ? "Activo"
                          : searchValue === false
                          ? "Inactivo"
                          : searchValue?.long_name ||
                            searchValue.name ||
                            searchValue.username ||
                            searchValue.description ||
                            searchValue.full_name ||
                            searchValue[searchProperty] ||
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
        </div>
        {/* Dropdown de resultados */}
        {isDropdownOpen && (
          <>
            {arrayDropdown && arrayDropdown?.length > 0 ? (
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
                  dropClassName ? dropClassName : "bg-[#3a4659]"
                } rounded-md scrollBar p-2 max-h-60 text-left  fade-in shadow-lg overflow-scroll 
            `}
              >
                <ChildrenSelect
                  {...{
                    arrayDropdown,
                    onSelect,
                    searchValue,
                    setSearchValue,
                    setIsDropdownOpen,
                    name,
                    isCategory,
                    searchProperty,
                    selectedValueID,
                    setSelectedValueID,
                    handleDeletedMultiple,
                    setFakeInput,
                    isMultiple,
                    scrollSelect,
                    setScrollSelect,
                    customFormat,
                    selectedClassName,
                    height,
                    dropHover,
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
                  dropClassName ? dropClassName : "bg-[#3a4659]"
                } rounded-md scrollBar p-2 max-h-60 text-left fade-in shadow-lg overflow-scroll 
          `}
              >
                {loading ? (
                  <div>
                    <Spinner className="h-4 w-4" />
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Escriba para realizar la búsqueda
                  </p>
                )}
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
                  dropClassName ? dropClassName : "bg-[#3a4659]"
                } rounded-md scrollBar p-2 max-h-60 text-left fade-in shadow-lg overflow-scroll 
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
