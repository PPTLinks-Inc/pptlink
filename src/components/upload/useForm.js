import { useState, useEffect } from "react";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    file: null,
    downloadable: "true",
    privacy: "public"
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
      callback();
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setSubmitting(true);
  };

  const handleChange = (event) => {
    event.persist();

    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value
    }));

    if (event.target.name === "file") {
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.files[0]
      }));
    }

    if (errors[event.target.name]) {
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
