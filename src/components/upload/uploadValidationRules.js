export default function validate(values) {
  let errors = {};
  let errors2 = {};

  // Upload file error checks
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

  if (values.file) {
    if (values.file.size > 10 * 1024 * 1024) {
      errors.file = "The file is too large";
    }

    if (!mimeTypes.includes(values.file.type)) {
      errors.file = "Upload a ppt or pptx file type";
    }
  }

  if (!values.file && !values?.tempFileId) {
    errors.file = "Upload a presentation file";
  }

  // Other validation checks
  if (!values.title) {
    errors.title = "Type in title of presentation";
  }

  if (values.title && values.title.length < 2) {
    errors.title = "Presentation title is too short";
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

  // Page 2 errors
  if (!values.name) {
    errors2.name = "Type in presenter's name";
  }

  if (values.name && values.name.length < 2) {
    errors2.name = "Presenter's name is too short";
  }

  if (values.bio && values.bio.length < 5) {
    errors2.bio = "Please give more details about the presenter";
  }

  // Social media link validation
  const socialMediaRegexes = [
    /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,}$/,
    /^(https?:\/\/)?(www\.)?(web\.)?facebook\.com\/[a-zA-Z0-9./_-]+$/,
    /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,}/,
    /^https:\/\/www\.tiktok\.com\/@[\w.-]+(\/video\/\d+)?(\?[^/\s]*)?$/,
    /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//,
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(@[\w.-]+|[\w.-]+)|youtu\.be\/[\w.-]+)(\?[^/\s]*)?$/,
    /^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}$/
  ];

  const isValidSocialLink = socialMediaRegexes.some((regex) =>
    regex.test(values.social)
  );

  if (values.social && !isValidSocialLink) {
    errors2.social = "Input a valid social media link";
  }

  // Date and time rules
  if (values.toggle && !values.date) {
    errors2.date = "Choose a presentation date";
  }

  // Get the current date in YYYY-MM-DD format
  const currentDate = new Date();
  currentDate.setHours(1, 0, 0, 0); 
  const choosenDate = new Date(values.date);
  choosenDate.setHours(1, 0, 0, 0);
  console.log("Choosen", choosenDate);
  if (values.toggle && values.date && choosenDate < currentDate) {
    errors2.date = "Date cannot be in the past";
  }

  if (values.toggle && !values.startTime) {
    errors2.startTime = "Select when presentation starts";
  }

  if (values.toggle && values.startTime.length !== 0) {
    const startTime = new Date(`1970-01-01T${values.startTime}:00Z`).getTime();
    const endTime = new Date(`1970-01-01T${values.endTime}:00Z`).getTime();
    const tenMinutesInMillis = 10 * 60 * 1000;

    if ((endTime - startTime) < tenMinutesInMillis) {
      errors2.endTime = "End time must be at least 10 minutes after start time";
    }
  }

  return { errors, errors2 };
}