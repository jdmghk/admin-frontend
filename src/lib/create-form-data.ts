// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFormData(values: Record<string, any>): FormData {
  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    const value = values[key as keyof typeof values];

    // Handle appending objects, arrays, and other types as needed
    if (value instanceof File) {
      formData.append(key, value); // Handle files specifically
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item as string | Blob);
      });
    } else {
      formData.append(key, String(value)); // Convert other types to string
    }
  });

  return formData;
}
