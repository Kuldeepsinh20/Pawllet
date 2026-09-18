import React, { useRef } from 'react';
import { Upload, FileCheck, CheckCircle2 } from 'lucide-react';

/**
 * UploadCard — file upload widget.
 *
 * docState shape: { key, title, name, size, uploaded, previewUrl } | null
 * onFileUpload(docKey, fileInfo) is called when a file is selected.
 */
export default function UploadCard({
  title,
  docKey,
  docState,
  onFileUpload,
  type = "folder"
}) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : null;
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      onFileUpload(docKey, {
        key: docKey,
        title,
        name: file.name,
        size: sizeStr,
        uploaded: true,
        previewUrl,
        file
      });
    }
  };

  const isLavender = type === "lavender";
  const tabBg = isLavender ? "bg-[#CBB3E8]" : "bg-[#E0B553]";
  const bodyBg = isLavender ? "bg-[#E2D2F7] border-[#CCAFF2]" : "bg-[#E9C365] border-[#D9B045]";
  const titleColor = isLavender ? "text-[#2A1856]" : "text-[#2A1E0E]";
  const subtitleColor = isLavender ? "text-[#58398C]" : "text-[#6A4E1B]";
  const uploadedColor = isLavender ? "text-[#472280]" : "text-[#523C13]";

  const isUploaded = docState?.uploaded;

  return (
    <div className="relative group">
      {/* Folder Tab */}
      <div className={`w-28 h-4 ${tabBg} rounded-t-lg ml-3 -mb-1 shadow-xs transition-colors`}></div>

      {/* Main Folder Body */}
      <div className={`${bodyBg} border-2 rounded-2xl p-4 shadow-folder flex items-center justify-between gap-4 transition-transform group-hover:-translate-y-0.5`}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        {/* Document Preview */}
        <div className="w-16 h-20 bg-white rounded-lg border border-[#D5C28F]/80 shadow-sm flex flex-col items-center justify-center p-1.5 flex-shrink-0 relative overflow-hidden">
          {docState?.previewUrl ? (
            <img
              src={docState.previewUrl}
              alt={title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-between items-center py-1 select-none">
              <div className="w-4 h-4 rounded-full bg-red-600/90 flex items-center justify-center text-[8px] text-white font-bold">
                ★
              </div>
              <div className="w-full space-y-1">
                <div className="h-1 bg-gray-300 rounded w-full"></div>
                <div className="h-1 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              {isUploaded ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <FileCheck className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* Title & Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`text-[15px] font-bold ${titleColor} leading-tight mb-1 truncate`}>
            {title}
          </h4>
          {isUploaded ? (
            <div className={`flex items-center gap-1 text-xs ${uploadedColor} font-semibold`}>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
              <span className="truncate max-w-[120px]">{docState.name}</span>
              <span className="text-[11px] opacity-75">({docState.size})</span>
            </div>
          ) : (
            <span className={`text-xs ${subtitleColor} font-medium`}>Ready for upload</span>
          )}
        </div>

        {/* Upload Button */}
        <div>
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-3.5 py-2 bg-[#1B52D8] hover:bg-[#1541B0] active:scale-95 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>{isUploaded ? 'Replace' : 'Upload'}</span>
            <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
