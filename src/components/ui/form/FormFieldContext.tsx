import { createContext, useContext, useId, useMemo } from "react";

type FormFieldContextModel = {
  id: string;
};
const FormFieldContext = createContext({} as FormFieldContextModel);

export const useFormFieldContext = () => useContext(FormFieldContext);

export function FormFieldContextProvider() {
  const id = useId();
  const v = useMemo(() => {
    return { id };
  }, [id]);
  return <FormFieldContext.Provider value={v}></FormFieldContext.Provider>;
}
