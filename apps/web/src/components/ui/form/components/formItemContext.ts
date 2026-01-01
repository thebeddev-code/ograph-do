import React from "react";

type FormItemContextModel = {
  id: string;
};
export const FormItemContext = React.createContext<FormItemContextModel>(
  {} as FormItemContextModel,
);
