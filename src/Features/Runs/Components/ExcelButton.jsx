import * as XLSX from "xlsx";

const ExcelDownloadButton = ({ data, filename, buttonText, className }) => {
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <button onClick={handleDownload} className={className}>
      {buttonText}
    </button>
  );
};

export default ExcelDownloadButton;
