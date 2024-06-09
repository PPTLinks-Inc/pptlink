import { useState, useEffect, useRef } from "react";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    toggle: false,
    file: null,
    downloadable: "true",
    privacy: "public",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; // Skip the effect on the initial render
    }

    if (Object.keys({ ...errors.errors }).length === 0 && submitting) {
      callback(1);
      setSubmitting(false); // Reset submitting after callback
    }

    if (Object.keys({ ...errors.errors2 }).length === 0 && submitting) {
      callback(2);
      setSubmitting(false); // Reset submitting after callback
    }
  }, [errors, callback, submitting]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (
      Object.keys(validationErrors.errors).length === 0 ||
      Object.keys(validationErrors.errors2).length === 0
    ) {
      setSubmitting(true);
    }
  };

  const handleChange = (event) => {
    // event.persist(); // what is this sapost to do...😒🤦‍♀️I don't tink it's a thing... it should be defined... it not yet so it's not a thing...
    const { name, value, files, checked } = event.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: files ? files[0] : value
    }));

    if (checked !== undefined)
      setValues((prevValues) => ({ ...prevValues, toggle: checked }));

    if (name === "file" && files[0]) {
      const file = files[0];
      const mimeTypes = [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.template",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/vnd.ms-powerpoint.addin.macroEnabled.12",
        "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
        "application/vnd.ms-powerpoint.template.macroEnabled.12",
        "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"
      ];

      if (file.size > 20 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          errors: { ...prevErrors.errors, file: "The file is too large" }
        }));
        return;
      }

      if (!mimeTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          errors: {
            ...prevErrors.errors,
            file: "Upload a ppt or pptx file type"
          }
        }));
        return;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        errors: { ...prevErrors.errors, file: "" }
      }));
    }

    if (
      (errors.errors && errors.errors[event.target.name] && name !== "file") ||
      (errors.errors2 && errors.errors2[event.target.name] && name !== "file")
    ) {
      setErrors(validate(values));
    }
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors
  };
};

export default useForm;
