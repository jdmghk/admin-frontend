import { useState } from "react";

type CsvOptions<T extends object> = {
  data: T[]; // Array of data objects to export
  filename?: string; // Optional filename for the CSV file
  headers?: (keyof T)[]; // Optional array of headers/column names
  onSuccess?: () => void; // Callback function on successful download
  onError?: (error: Error) => void; // Callback on download error
};

function useCsvDownload<T extends object>({
  data,
  filename = "data.csv",
  headers,
  onSuccess,
  onError,
}: CsvOptions<T>) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  // Convert data array to CSV string
  const convertToCsv = (): string => {
    if (!data.length) return ""; // Check if data array is empty

    // Use headers if provided, otherwise infer from first data object
    const csvHeaders = headers || (Object.keys(data[0] as T) as (keyof T)[]);
    const headerRow = csvHeaders.join(",");

    // Map data rows
    const rows = data.map((row) =>
      csvHeaders
        .map(
          (header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"` // Handle commas/quotes in values
        )
        .join(",")
    );

    return [headerRow, ...rows].join("\n");
  };

  // Function to trigger CSV download
  const downloadCsv = () => {
    if (!data.length || downloadTriggered) return;

    setIsDownloading(true);
    setDownloadTriggered(true);

    try {
      const csvContent = convertToCsv();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.setAttribute("download", filename);
      link.style.display = "none";
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      setDownloadTriggered(false);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Download failed", error);
      if (onError)
        onError(error instanceof Error ? error : new Error("Download failed"));
    }
  };

  return { downloadCsv, isDownloading };
}

export default useCsvDownload;
