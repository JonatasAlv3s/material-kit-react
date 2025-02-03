import type { FormHandles } from "@unform/core";

import { useRef, useCallback } from "react";



export const UseForm = () => {
    const formRef = useRef<FormHandles>(null);

    const isSaveAndNew = useRef(false);
    const isSaveAndBack = useRef(false);

    const handleSave = useCallback(() => {
        isSaveAndNew.current = false;
        isSaveAndBack.current = false;
        formRef.current?.submitForm();
    }, []);

    const handleSaveAndNew = useCallback(() => {
        isSaveAndNew.current = true;
        isSaveAndBack.current = false;
        formRef.current?.submitForm();
    }, []);

    const handleSaveAndBack = useCallback(() => {
        isSaveAndNew.current = false;
        isSaveAndBack.current = true;
        formRef.current?.submitForm();
    }, []);

    const handleisSaveAndNew = useCallback(() => isSaveAndNew.current, []);

    const handleisSaveAndBack = useCallback(() => isSaveAndBack.current, []);

    return {
        formRef,
        save: handleSave,
        saveAndNew: handleSaveAndNew,
        saveAndBack: handleSaveAndBack,
        isSaveAndNew: handleisSaveAndNew,
        isSaveAndBack: handleisSaveAndBack,
    }
};