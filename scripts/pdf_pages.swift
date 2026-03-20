import Foundation
import PDFKit

guard CommandLine.arguments.count >= 2 else {
  fputs("Usage: swift pdf_pages.swift /path/to/file.pdf\n", stderr)
  exit(1)
}

let path = CommandLine.arguments[1]
let url = URL(fileURLWithPath: path)

guard let doc = PDFDocument(url: url) else {
  fputs("Failed to open PDF: \(path)\n", stderr)
  exit(1)
}

var pages: [[String: Any]] = []
pages.reserveCapacity(doc.pageCount)

for index in 0..<doc.pageCount {
  let text = doc.page(at: index)?.string ?? ""
  pages.append([
    "pageNumber": index + 1,
    "text": text,
  ])
}

let payload: [String: Any] = [
  "path": path,
  "pageCount": doc.pageCount,
  "pages": pages,
]

let data = try JSONSerialization.data(withJSONObject: payload, options: [.prettyPrinted, .sortedKeys])
FileHandle.standardOutput.write(data)
