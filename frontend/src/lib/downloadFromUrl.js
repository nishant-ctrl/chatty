import { apiClient } from "./api-client";

export async function downloadFileFromUrl(
    url,
    filenameWithoutExtension = "file"
) {
    try {
        // Extract file extension from URL
        const extension = getFileExtensionFromUrl(url);
        if (!extension)
            throw new Error("Could not detect file extension from URL.");

        const response = await apiClient.get(url, {
            responseType: "blob", // important for binary data
        });

        // Create blob URL
        const blob = new Blob([response.data], { type: response.data.type });
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create and trigger download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${filenameWithoutExtension}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error("Download failed:", error.message);
    }
}

// Helper to extract file extension from URL
function getFileExtensionFromUrl(url) {
    try {
        const pathname = new URL(url).pathname;
        const file = pathname.substring(pathname.lastIndexOf("/") + 1);
        return file.includes(".") ? file.split(".").pop().split("?")[0] : null;
    } catch (err) {
        return null;
    }
}
