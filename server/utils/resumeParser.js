import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parseResume(fileBuffer) {
    try {
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new Error("Received empty buffer");
        }

        // ⭐ Proper Buffer → Uint8Array conversion (CRITICAL)
        const uint8Array = new Uint8Array(
            fileBuffer.buffer,
            fileBuffer.byteOffset,
            fileBuffer.byteLength
        );

        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let extractedText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const strings = content.items.map(item => item.str);
            extractedText += strings.join(" ");
        }

        return extractedText;
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw error;
    }
}