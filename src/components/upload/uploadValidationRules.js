export default function validate(values) {
  let errors = {};

  // upload file error
  if (values.file) {

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

    if (values.file.size > 20 * 1024 * 1024) {
      errors.file = "The file is too large";
    }

    // Check if the file extension is either "ppt" or "pptx"
    if (!mimeTypes.includes(values.file.type)) {
      errors.file = "Upload a ppt or pptx file type";
    }
  }

  if (!values.file) {
    errors.file = "Upload a presentation file";
  }

  if (!values.title) {
    errors.title = "Type in title of presentation";
  }

  if (values.title && values.title.length < 2) {
    errors.title = "Presentation title is too short";
  }

  if (!values.description) {
    errors.description = "Describe your presentation";
  }

  if (values.description && values.description.length < 5) {
    errors.description = "Presentation Description is too short";
  }

  if (!values.privacy) {
    errors.privacy = "Choose the privacy of your presentation";
  }

  if (!values.downloadable) {
    errors.downloadable = "Should your presentation be downloadable";
  }

  if (!values.category) {
    errors.category = "Choose a presentation category";
  }

  if (values.category && values.category.length < 3) {
    errors.category = "Category too short";
  }

  return errors;
}
