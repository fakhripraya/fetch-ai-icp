"use client"

import type React from "react"

import { Fragment } from "react"
import { useDropzone, type FileRejection, type FileError } from "react-dropzone"
import { formattedNumber, isImageType } from "@/utils/global-functions"
import { Button } from "@/components/ui/button" // Using shadcn/ui Button
import styles from "./multi-upload.module.css" // CSS Module for styles

// Placeholder SVG URLs
const UploadIcon = "/placeholder.svg?height=60&width=60"
const FileIcon = "/placeholder.svg?height=40&width=40"

// Interfaces
interface FileWithMeta {
  name: string
  type: string
  size: number
  blob?: Blob
  base64?: string
  url?: string
}

interface RejectedFile {
  file: FileWithMeta
  errors: readonly FileError[]
}

interface MultiUploadProps {
  files: FileWithMeta[]
  setFiles: (files: FileWithMeta[]) => void
  rejected: RejectedFile[]
  setRejected: (rejected: RejectedFile[]) => void
  extensions: string[]
  maxSize: number
  maxLength: number
  label?: string
  subLabel?: string
  formName?: string
  customIcon?: string
  additionalElement?: React.ReactNode
  handleRemoveImageUpload?: (index: number) => void
  onDrop?: (files: File[]) => void
  uniqueKey?: string
}

interface AcceptedFileItemsProps {
  files: FileWithMeta[]
  setFiles: (files: FileWithMeta[]) => void
  handleRemoveImageUpload?: (index: number) => void
  uniqueKey?: string
}

interface FileRejectionItemsProps {
  rejected: RejectedFile[]
}

// Utility function to remove file
export const defaultHandleRemoveImageUpload = (
  files: FileWithMeta[],
  setFiles: (files: FileWithMeta[]) => void,
  index: number,
) => {
  const temp = [...files]
  temp.splice(index, 1)
  setFiles(temp)
}

// Define how to render the file source
export const defineFileSrc = (file: FileWithMeta): string | undefined => {
  if (file.blob) return URL.createObjectURL(file.blob)
  if (file.base64) return file.base64
  if (file.url) return file.url
  return undefined
}

// Render accepted file items
export const AcceptedFileItems = ({
  files,
  setFiles,
  handleRemoveImageUpload,
  uniqueKey = "file",
}: AcceptedFileItemsProps) =>
  files?.length > 0 && (
    <Fragment>
      <h3>File Diterima</h3>
      {files.map((file, index) => (
        <div key={`multi-upload-file-${uniqueKey}-${index}`} className={styles["multi-upload-file-list-container"]}>
          <li className={styles["multi-upload-file-list"]} key={`${file.name}-${index}`}>
            <img
              className={styles["multi-upload-file-img"]}
              src={isImageType(file.type) ? defineFileSrc(file) || "" : FileIcon}
              alt={file.name}
            />
            <label className={styles["multi-upload-file-text"]}>
              {file.name} - ({formattedNumber(file.size)} bytes)
            </label>
          </li>
          <Button
            onClick={() => {
              if (handleRemoveImageUpload) handleRemoveImageUpload(index)
              else defaultHandleRemoveImageUpload(files, setFiles, index)
            }}
            className={`${styles["multi-upload-button"]} ${styles["red-bg-color"]}`}
          >
            <h4 className={styles["multi-upload-button-text"]}>X</h4>
          </Button>
        </div>
      ))}
    </Fragment>
  )

// Render rejected file items
export const FileRejectionItems = ({ rejected }: FileRejectionItemsProps) =>
  rejected.length > 0 && (
    <Fragment>
      <h3>File Ditolak</h3>
      {rejected.map(({ file, errors }, index) => (
        <li className={styles["multi-upload-file-list"]} key={`${file.name}-${index}`}>
          <img
            className={styles["multi-upload-file-img"]}
            src={isImageType(file.type) ? defineFileSrc(file) || "" : FileIcon}
            alt={file.name}
          />
          <label className={styles["multi-upload-file-text"]}>
            {index + 1}. {file.name} - {formattedNumber(file.size)} bytes
            <ul>
              {errors.map((e) => (
                <li key={e.code}>{e.message}</li>
              ))}
            </ul>
          </label>
        </li>
      ))}
    </Fragment>
  )

// Main MultiUpload Component
export default function MultiUpload(props: MultiUploadProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: props.onDrop,
    onDropAccepted,
    onDropRejected,
    validator: multiFileValidator,
  })

  async function onDropRejected(rejectedFiles: FileRejection[]) {
    const proceed = rejectedFiles.length > 0
    const temp: RejectedFile[] = rejectedFiles.map((rejection) => ({
      file: {
        name: rejection.file.name,
        type: rejection.file.type,
        size: rejection.file.size,
        blob: rejection.file,
      },
      errors: rejection.errors,
    }))
    if (proceed) props.setRejected(temp)
  }

  async function onDropAccepted(acceptedFiles: File[]) {
    const proceed = acceptedFiles.length > 0
    const temp: FileWithMeta[] = [...props.files]
    for (const file of acceptedFiles) {
      if (temp.length >= props.maxLength) break
      temp.push({
        name: file.name,
        type: file.type,
        size: file.size,
        blob: file,
      })
    }
    if (proceed) props.setFiles(temp)
  }

  function multiFileValidator(file: File): { code: string; message: string } | null {
    if (!file.type || !props.extensions.includes(file.type)) {
      return {
        code: "invalid-extension",
        message: `Tipe file: ${file.type} tidak dapat diterima`,
      }
    }
    if (file.size > props.maxSize) {
      return {
        code: "size-too-large",
        message: `Size lebih besar dari ${formattedNumber(props.maxSize)} byte`,
      }
    }
    return null
  }

  return (
    <div className={`${styles["multi-upload-picture-box"]}`}>
      <div className={styles["multi-upload-picture-field"]}>
        <section className={styles["multi-upload-dropzone-container"]}>
          <div {...getRootProps({ className: styles["multi-upload-dropzone-box"] })}>
            <input {...getInputProps()} />
            <label className={styles["multi-upload-custom-typography"]}>{props.label}</label>
            <div className={styles["breakline"]} />
            <img
              className={styles["multi-upload-icon-img"]}
              src={props.customIcon || UploadIcon}
              alt={`${props.formName}-icon-image`}
            />
            <div className={styles["breakline"]} />
            <label className={styles["multi-upload-custom-typography"]}>{props.subLabel}</label>
            {props.additionalElement}
          </div>
        </section>
      </div>
      <div className={styles["multi-upload-picture-list"]}>
        <AcceptedFileItems
          files={props.files}
          setFiles={props.setFiles}
          handleRemoveImageUpload={props.handleRemoveImageUpload}
          uniqueKey={props.uniqueKey}
        />
      </div>
      <div className={styles["multi-upload-picture-list"]}>
        <FileRejectionItems rejected={props.rejected} />
      </div>
    </div>
  )
}
