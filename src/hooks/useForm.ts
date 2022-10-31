import React, { useState, useCallback, useMemo } from "react";

type Field = {
  name: string;
  value: string;
  validations?: RegExp[];
};

const validateField = (field: Field) => {
  let isValid = true;
  const { validations, value } = field;

  validations?.forEach((v) => {
    let passed = v.test(value);
    isValid = isValid && passed;
  });

  return isValid;
};

type Initial = {
  [key: string]: Field;
};

export const useForm = (initialData: Field[]) => {
  const initial: Initial = useMemo(
    () =>
      initialData.reduce(
        (a, val) => ({
          ...a,
          [val.name]: { ...val },
        }),
        {}
      ),
    [initialData]
  );

  const [fields, setFields] = useState(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const setField = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = fields[e.target.name];

      if (value) {
        value.value = e.target.value;

        const validated = validateField(value);

        if (!validated) {
          setErrors([...errors, value.name]);
        } else {
          setErrors((e) => e.filter((t) => t !== value.name));
        }

        setFields({ ...fields, value });
      }
    },
    [fields, errors]
  );

  const formInvalid = useMemo(() => {
    const values = Object.entries(fields).filter((f) => {
      return !f[1].value;
    });

    return errors.length || values.length ? true : false;
  }, [fields, errors]);

  return { fields, errors, setField, formInvalid };
};
