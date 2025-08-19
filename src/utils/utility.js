import { useRef } from "react";


export const scrollToDiv = (targetRef) => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
};