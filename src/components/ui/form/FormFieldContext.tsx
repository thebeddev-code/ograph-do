import { createContext, useContext, useId, useRef } from "react";

type FormFieldContextModel = {
  id: string;
};
const FormFieldContext = createContext({} as FormFieldContextModel);

export const useFormFieldContext = () => useContext(FormFieldContext);

export function FormFieldContextProvider() {
  const id = useId();
  const v = useRef({ id });
  return (
    <FormFieldContext.Provider value={v.current}></FormFieldContext.Provider>
  );
}
