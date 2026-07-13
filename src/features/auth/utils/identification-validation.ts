const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateIdentificationForm = (data: { email: string }) => {
  const errors = { email: "" };

  if (!data.email) {
    errors.email = "وارد کردن ایمیل الزامی است";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "فرمت ایمیل نامعتبر است";
  }

  return {
    errors,
    isValid: !errors.email,
  };
};
