import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const mergeClasses = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
