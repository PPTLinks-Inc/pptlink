import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "../../constants/routes";
import axios from "axios";

const useForm = (callback, validate) => {
  const [values, setValues] = useState({
    toggle: false,
    file: null,
    downloadable: "true",
    privacy: "PUBLIC",
    date: new Date().toISOString(),
    startTime: "",
    endTime: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const isInitialRender = useRef(true);

  function onUploadProgress(progressEvent) {
    const { loaded, total } = progressEvent;
    let percent = Math.floor((loaded * 100) / total);
    setUploadProgress(percent);
  }

  const uploadPresentation = useMutation({
    mutationKey: ["upload-ppt"],
    mutationFn: function (formData) {
      return axios.post(`${SERVER_URL}/api/v1/ppt/upload`, formData, {
        onUploadProgress
      });
    },
    onSuccess: function () {
      setUploadProcessing(true);
    },
    onError: function (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        errors: { ...prevErrors.errors, file: error.response?.data.message || error.response.message }
      }));
    }
  });

  const savePresentation = useMutation({
    mutationKey: ["save-presentation"],
    mutationFn: function (data) {
      return axios.post(`${SERVER_URL}/api/v1/ppt/presentation`, data);
    },
    onSuccess: function ({ data }) {
      window.location.replace(`/${data.liveId}`);
    },
    onError: function (error) {
      alert(error.response?.data.message || error.response.message);
    }
  });

  useEffect(() => {
    // if (values.file === null) {
    //   setUploadProgress(0);

    // }
    if (!uploadPresentation.isPending && values.file) {
      const formData = new FormData();
      formData.append("ppt", values.file);
      uploadPresentation.mutate(formData);
    }
  }, [values.file]);

  useEffect(() => {
    if (!values.toggle && Object.keys(errors).length) {
      setErrors((prev) => {
        const temp = prev;
        temp.errors2.date = "";
        temp.errors2.startTime = "";
        temp.errors2.endTime = "";
        return temp;
      });
    }
  }, [values.toggle]);

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

  const handleSubmit = (currentView) => {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    console.log("Errors", validationErrors);
    if (currentView === 3 && Object.keys(validationErrors.errors).length === 0 && Object.keys(validationErrors.errors2).length === 0 && values?.tempFileId) {
      console.log("Submitting", values);
      const data = {
        title: values.title,
        description: values.description,
        category: JSON.parse(values.category),
        downloadable: values.downloadable === "true",
        linkType: values.privacy,
        tempFileId: values.tempFileId,
        presenterName: values.name,
        bio: values?.bio,
        socialMediaLink: values?.social,
        presentationDate: values.toggle ? values?.date : null,
        presentationStartTime: values.toggle ? values?.startTime : null,
        presentationEndTime: values.toggle ? values?.endTime : null
      }
      //remove null values
      Object.keys(data).forEach(key => data[key] === null && delete data[key]);
      savePresentation.mutate(data);
      return;
    }

    if (
      Object.keys(validationErrors.errors).length === 0 ||
      Object.keys(validationErrors.errors2).length === 0
    ) {
      setSubmitting(true);
    }
  };

  const handleChange = (event) => {
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
        "application/wps-office.pptx",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.presentationml.template",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/vnd.ms-powerpoint.addin.macroEnabled.12",
        "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
        "application/vnd.ms-powerpoint.template.macroEnabled.12",
        "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"
      ];

      if (file.size > 10 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          errors: { ...prevErrors.errors, file: "File should not be more than 10MB" }
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
        errors: { ...prevErrors.errors, file: null }
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
    setValues,
    savePresentation,
    values,
    errors,
    uploadProgress,
    uploadProcessing
  };
};

export default useForm;
