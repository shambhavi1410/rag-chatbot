import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'
import './DocumentUpload.css'

const DocumentUpload = () => {
  // Load files from localStorage on mount
  const loadFilesFromStorage = () => {
    const saved = localStorage.getItem('uploadedFiles')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.files || []
      } catch (e) {
        return []
      }
    }
    return []
  }

  const [files, setFiles] = useState(() => {
    // Try to restore file list from localStorage (file objects won't persist, so we'll store metadata)
    return []
  })
  const [uploadedFilesMeta, setUploadedFilesMeta] = useState(() => {
    const saved = localStorage.getItem('uploadedFilesMeta')
    return saved ? JSON.parse(saved) : []
  })
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(() => {
    const saved = localStorage.getItem('uploadStatus')
    return saved ? JSON.parse(saved) : {}
  })

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('uploadStatus', JSON.stringify(uploadStatus))
  }, [uploadStatus])

  React.useEffect(() => {
    localStorage.setItem('uploadedFilesMeta', JSON.stringify(uploadedFilesMeta))
  }, [uploadedFilesMeta])

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const handleUpload = async (file) => {
    if (uploading) return

    setUploading(true)
    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }))

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadStatus(prev => ({ 
        ...prev, 
        [file.name]: 'success',
        [`${file.name}_info`]: response.data
      }))
      
      // Save file metadata
      setUploadedFilesMeta(prev => [...prev, {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        fileId: response.data.file_id,
        chunks: response.data.chunks
      }])
    } catch (error) {
      console.error('Upload error:', error)
      let errorMsg = 'Upload failed'
      
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMsg = 'Cannot connect to backend. Please start the server.'
      } else if (error.response) {
        errorMsg = error.response.data?.detail || error.response.statusText
      }
      
      setUploadStatus(prev => ({ 
        ...prev, 
        [file.name]: 'error',
        [`${file.name}_error`]: errorMsg
      }))
    } finally {
      setUploading(false)
    }
  }

  const handleUploadAll = async () => {
    for (const file of files) {
      if (uploadStatus[file.name] !== 'success') {
        await handleUpload(file)
      }
    }
  }

  const removeFile = (fileName) => {
    setFiles(prev => prev.filter(f => f.name !== fileName))
    setUploadedFilesMeta(prev => prev.filter(f => f.name !== fileName))
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileName]
      delete newStatus[`${fileName}_info`]
      delete newStatus[`${fileName}_error`]
      return newStatus
    })
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    const icons = {
      pdf: '📄',
      ppt: '📊',
      pptx: '📊',
      doc: '📝',
      docx: '📝',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      txt: '📃'
    }
    return icons[ext] || '📎'
  }

  return (
    <div className="document-upload">
      <h2>📄 Upload Documents</h2>
      <p className="upload-description">
        Upload unlimited documents in various formats (PDF, PPT, DOCX, JPG, PNG, etc.)
      </p>

      <div className="upload-area">
        <input
          type="file"
          id="file-input"
          multiple
          onChange={handleFileSelect}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="file-input-label">
          <div className="upload-icon">📤</div>
          <div>Click to select files or drag and drop</div>
          <div className="file-types">PDF, PPT, DOCX, JPG, PNG, TXT and more</div>
        </label>
      </div>

      {(files.length > 0 || uploadedFilesMeta.length > 0) && (
        <div className="files-list">
          <div className="files-header">
            <h3>Files ({files.length + uploadedFilesMeta.length})</h3>
            {files.length > 0 && (
              <button 
                className="upload-all-button"
                onClick={handleUploadAll}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload All'}
              </button>
            )}
          </div>

          <div className="files-grid">
            {/* Show files being uploaded */}
            {files.map((file, idx) => (
              <div key={idx} className="file-item">
                <div className="file-icon">{getFileIcon(file.name)}</div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <div className="file-actions">
                  {uploadStatus[file.name] === 'success' ? (
                    <span className="status-success">✓ Uploaded</span>
                  ) : uploadStatus[file.name] === 'uploading' ? (
                    <span className="status-uploading">⏳ Uploading...</span>
                  ) : uploadStatus[file.name] === 'error' ? (
                    <span className="status-error">✗ Error</span>
                  ) : (
                    <button
                      className="upload-button"
                      onClick={() => handleUpload(file)}
                      disabled={uploading}
                    >
                      Upload
                    </button>
                  )}
                  <button
                    className="remove-button"
                    onClick={() => removeFile(file.name)}
                  >
                    ✕
                  </button>
                </div>
                {uploadStatus[`${file.name}_info`] && (
                  <div className="upload-info">
                    Processed {uploadStatus[`${file.name}_info`].chunks} chunks
                  </div>
                )}
                {uploadStatus[`${file.name}_error`] && (
                  <div className="upload-error">
                    {uploadStatus[`${file.name}_error`]}
                  </div>
                )}
              </div>
            ))}
            {/* Show previously uploaded files from metadata */}
            {uploadedFilesMeta.filter(meta => !files.find(f => f.name === meta.name)).map((meta, idx) => (
              <div key={`meta-${idx}`} className="file-item">
                <div className="file-icon">{getFileIcon(meta.name)}</div>
                <div className="file-info">
                  <div className="file-name">{meta.name}</div>
                  <div className="file-size">
                    {(meta.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <div className="file-actions">
                  {uploadStatus[meta.name] === 'success' ? (
                    <span className="status-success">✓ Uploaded</span>
                  ) : (
                    <span className="status-success">✓ Previously Uploaded</span>
                  )}
                  <button
                    className="remove-button"
                    onClick={() => removeFile(meta.name)}
                  >
                    ✕
                  </button>
                </div>
                {(uploadStatus[`${meta.name}_info`] || meta.chunks) && (
                  <div className="upload-info">
                    Processed {uploadStatus[`${meta.name}_info`]?.chunks || meta.chunks} chunks
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentUpload

